import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Pause, Play, RotateCcw, Check, ArrowLeft } from "lucide-react";
import { FamilyMember, VoiceIntakeData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CosmosVoiceRecorderProps {
  member: FamilyMember;
  onComplete: (data: VoiceIntakeData) => void;
  onBack: () => void;
}

type RecordingState = 'idle' | 'recording' | 'paused' | 'review';

export const CosmosVoiceRecorder = ({
  member,
  onComplete,
  onBack
}: CosmosVoiceRecorderProps) => {
  const [state, setState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(20).fill(0.1));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_DURATION = 90; // seconds
  const MIN_DURATION = 10; // seconds

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [audioUrl]);

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current || state !== 'recording') return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Sample 20 values from the frequency data
    const samples = 20;
    const step = Math.floor(dataArray.length / samples);
    const newValues = Array(samples).fill(0).map((_, i) => {
      const value = dataArray[i * step] / 255;
      return Math.max(0.1, value); // Minimum height
    });
    
    setWaveformValues(newValues);
    animationFrameRef.current = requestAnimationFrame(updateWaveform);
  }, [state]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      source.connect(analyserRef.current);
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(100);
      setState('recording');
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Start waveform animation
      updateWaveform();
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Couldn't access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setState('review');
      setWaveformValues(Array(20).fill(0.1));
    }
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setState('idle');
    setWaveformValues(Array(20).fill(0.1));
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob || duration < MIN_DURATION) {
      toast.error(`Please record at least ${MIN_DURATION} seconds`);
      return;
    }

    try {
      setIsTranscribing(true);

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
      });
      reader.readAsDataURL(audioBlob);
      const base64Audio = await base64Promise;

      // Call transcription edge function
      const { data, error } = await supabase.functions.invoke('transcribe-voice', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data?.transcript) {
        onComplete({
          transcript: data.transcript,
          duration
        });
      } else {
        throw new Error('No transcript received');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to process voice message. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[60vh] flex flex-col px-5 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
          disabled={state === 'recording' || isTranscribing}
        >
          <ArrowLeft className="w-5 h-5 text-foreground/50" />
        </button>
        <div className="text-[11px] text-foreground/40">
          {formatTime(duration)} / {formatTime(MAX_DURATION)}
        </div>
        <div className="w-9" />
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h3 className="text-[16px] font-serif text-foreground/90 mb-3">
          {state === 'idle' && "Take a breath..."}
          {state === 'recording' && "I'm listening..."}
          {state === 'review' && "Your message"}
        </h3>
        <p className="text-[12px] text-foreground/50 max-w-[280px] mx-auto">
          {state === 'idle' && (
            <>You have 90 seconds to tell me what's happening in your life right now. What's on your mind? Don't overthink it—just speak from your heart.</>
          )}
          {state === 'recording' && (
            <>Speak freely about what's happening with {member.type === 'child' ? member.name : 'you'}...</>
          )}
          {state === 'review' && (
            <>Listen to your message before submitting.</>
          )}
        </p>
      </motion.div>

      {/* Waveform Visualization */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Outer glow ring */}
          <motion.div
            animate={{
              scale: state === 'recording' ? [1, 1.1, 1] : 1,
              opacity: state === 'recording' ? [0.3, 0.5, 0.3] : 0.2
            }}
            transition={{
              duration: 2,
              repeat: state === 'recording' ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl"
            style={{ width: 200, height: 200, left: -30, top: -30 }}
          />
          
          {/* Waveform circle */}
          <div className="relative w-[140px] h-[140px] rounded-full bg-gradient-to-br from-purple-950/50 to-indigo-950/50 border border-purple-500/20 flex items-center justify-center">
            {/* Waveform bars */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-end gap-[3px] h-[60px]">
                {waveformValues.map((value, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: `${value * 100}%` }}
                    transition={{ duration: 0.1 }}
                    className="w-[4px] bg-gradient-to-t from-purple-400/60 to-purple-300/80 rounded-full"
                    style={{ minHeight: 4 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio element for playback */}
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} className="hidden" />
      )}

      {/* Controls */}
      <div className="mt-8 space-y-4">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={startRecording}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500/80 to-indigo-500/80 text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </motion.button>
          )}

          {state === 'recording' && (
            <motion.button
              key="stop"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={stopRecording}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500/80 to-rose-500/80 text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:from-red-500 hover:to-rose-500 transition-all"
            >
              <MicOff className="w-5 h-5" />
              Stop Recording
            </motion.button>
          )}

          {state === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* Playback button */}
              <button
                onClick={playAudio}
                className="w-full py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/70 font-medium text-[13px] flex items-center justify-center gap-2 hover:bg-foreground/10 transition-all"
              >
                <Play className="w-4 h-4" />
                Listen to your message
              </button>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={resetRecording}
                  disabled={isTranscribing}
                  className="flex-1 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/60 font-medium text-[13px] flex items-center justify-center gap-2 hover:bg-foreground/10 transition-all disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Record Again
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isTranscribing || duration < MIN_DURATION}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500/80 to-indigo-500/80 text-white font-medium text-[13px] flex items-center justify-center gap-2 hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50"
                >
                  {isTranscribing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Use This
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Privacy note */}
      <p className="text-[10px] text-foreground/30 text-center mt-6">
        Your voice message is transcribed and used only to personalize this reading.
        Audio is immediately deleted after transcription.
      </p>
    </div>
  );
};
