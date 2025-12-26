import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CalibrationData {
  sleepNaps: string | null;
  feedingSolids: string | null;
  physicalSkills: string[];
  languageSounds: string | null;
  socialSeparation: string | null;
  currentChallenge: string | null;
}

export interface Calibration extends CalibrationData {
  id: string;
  babyId: string;
  householdId: string;
  emergingEarlyFlags: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
  promptDismissCount: number;
  lastPromptDismissedAt: string | null;
}

export function useCalibration(babyId?: string) {
  const { user } = useAuth();
  const [calibration, setCalibration] = useState<Calibration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalibration = useCallback(async () => {
    if (!babyId || !user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('baby_calibrations')
        .select('*')
        .eq('baby_id', babyId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setCalibration({
          id: data.id,
          babyId: data.baby_id,
          householdId: data.household_id,
          sleepNaps: data.sleep_naps,
          feedingSolids: data.feeding_solids,
          physicalSkills: data.physical_skills || [],
          languageSounds: data.language_sounds,
          socialSeparation: data.social_separation,
          currentChallenge: data.current_challenge,
          emergingEarlyFlags: (data.emerging_early_flags as Record<string, boolean>) || {},
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          promptDismissCount: (data as any).prompt_dismiss_count ?? 0,
          lastPromptDismissedAt: (data as any).last_prompt_dismissed_at ?? null,
        });
      }
    } catch (err: any) {
      console.error('Error fetching calibration:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [babyId, user]);

  useEffect(() => {
    fetchCalibration();
  }, [fetchCalibration]);

  const saveCalibration = async (
    targetBabyId: string,
    householdId: string,
    data: CalibrationData,
    emergingFlags: Record<string, boolean>
  ): Promise<void> => {
    if (!user) throw new Error('Not authenticated');

    const payload = {
      baby_id: targetBabyId,
      household_id: householdId,
      sleep_naps: data.sleepNaps,
      feeding_solids: data.feedingSolids,
      physical_skills: data.physicalSkills,
      language_sounds: data.languageSounds,
      social_separation: data.socialSeparation,
      current_challenge: data.currentChallenge,
      emerging_early_flags: emergingFlags,
    };

    const { error: upsertError } = await supabase
      .from('baby_calibrations')
      .upsert(payload, { onConflict: 'baby_id' });

    if (upsertError) throw upsertError;

    // Refetch to get updated data
    await fetchCalibration();
  };

  const updateCalibration = async (
    data: Partial<CalibrationData>,
    emergingFlags?: Record<string, boolean>
  ): Promise<void> => {
    if (!calibration || !user) throw new Error('No calibration to update');

    const updatePayload: Record<string, unknown> = {};
    
    if (data.sleepNaps !== undefined) updatePayload.sleep_naps = data.sleepNaps;
    if (data.feedingSolids !== undefined) updatePayload.feeding_solids = data.feedingSolids;
    if (data.physicalSkills !== undefined) updatePayload.physical_skills = data.physicalSkills;
    if (data.languageSounds !== undefined) updatePayload.language_sounds = data.languageSounds;
    if (data.socialSeparation !== undefined) updatePayload.social_separation = data.socialSeparation;
    if (data.currentChallenge !== undefined) updatePayload.current_challenge = data.currentChallenge;
    if (emergingFlags !== undefined) updatePayload.emerging_early_flags = emergingFlags;

    const { error: updateError } = await supabase
      .from('baby_calibrations')
      .update(updatePayload)
      .eq('id', calibration.id);

    if (updateError) throw updateError;

    await fetchCalibration();
  };

  const dismissPrompt = async (): Promise<void> => {
    if (!calibration || !user) return;

    const newCount = calibration.promptDismissCount + 1;
    const { error: updateError } = await supabase
      .from('baby_calibrations')
      .update({
        prompt_dismiss_count: newCount,
        last_prompt_dismissed_at: new Date().toISOString(),
      })
      .eq('id', calibration.id);

    if (updateError) throw updateError;
    await fetchCalibration();
  };

  return {
    calibration,
    loading,
    error,
    saveCalibration,
    updateCalibration,
    dismissPrompt,
    refetch: fetchCalibration,
  };
}
