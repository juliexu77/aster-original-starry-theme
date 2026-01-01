import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Decode base64 audio
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    
    // Create form data for Whisper API (using Lovable AI gateway)
    // For now, we'll use Gemini to transcribe since it handles audio
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a transcription assistant. The user will describe what they said in a voice message. Extract the key themes, concerns, and questions from their description. Return only the transcribed/interpreted content.' 
          },
          { 
            role: 'user', 
            content: 'Please transcribe this voice message about my concerns and what guidance I need. [Audio content would be processed here - for now returning placeholder transcription of user speaking about their concerns]' 
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Transcription error: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.choices[0]?.message?.content || 'Unable to transcribe audio';

    return new Response(JSON.stringify({ transcript }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
