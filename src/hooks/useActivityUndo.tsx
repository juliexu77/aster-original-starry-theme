import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivitySnapshot {
  id: string;
  type: string;
  logged_at: string;
  details: any;
  household_id: string;
  created_by: string;
}

interface UndoOperation {
  type: 'create' | 'update' | 'delete';
  activity: ActivitySnapshot;
  previousState?: ActivitySnapshot; // For updates
}

const MAX_UNDO_HISTORY = 10;

export const useActivityUndo = () => {
  const [undoStack, setUndoStack] = useState<UndoOperation[]>([]);

  const trackCreate = useCallback((activity: ActivitySnapshot) => {
    setUndoStack(prev => [
      { type: 'create', activity },
      ...prev.slice(0, MAX_UNDO_HISTORY - 1)
    ]);
  }, []);

  const trackUpdate = useCallback((activity: ActivitySnapshot, previousState: ActivitySnapshot) => {
    setUndoStack(prev => [
      { type: 'update', activity, previousState },
      ...prev.slice(0, MAX_UNDO_HISTORY - 1)
    ]);
  }, []);

  const trackDelete = useCallback((activity: ActivitySnapshot) => {
    setUndoStack(prev => [
      { type: 'delete', activity },
      ...prev.slice(0, MAX_UNDO_HISTORY - 1)
    ]);
  }, []);

  const undo = useCallback(async () => {
    if (undoStack.length === 0) return false;

    const operation = undoStack[0];
    
    try {
      switch (operation.type) {
        case 'create':
          // Undo create = delete the activity
          await supabase
            .from('activities')
            .delete()
            .eq('id', operation.activity.id);
          break;

        case 'update':
          // Undo update = restore previous state
          if (operation.previousState) {
            await supabase
              .from('activities')
              .update({
                type: operation.previousState.type,
                logged_at: operation.previousState.logged_at,
                details: operation.previousState.details
              })
              .eq('id', operation.activity.id);
          }
          break;

        case 'delete':
          // Undo delete = recreate the activity
          await supabase
            .from('activities')
            .insert({
              id: operation.activity.id,
              household_id: operation.activity.household_id,
              type: operation.activity.type,
              logged_at: operation.activity.logged_at,
              details: operation.activity.details,
              created_by: operation.activity.created_by
            });
          break;
      }

      // Remove the operation from the stack
      setUndoStack(prev => prev.slice(1));
      return true;
    } catch (error) {
      console.error('Error undoing operation:', error);
      return false;
    }
  }, [undoStack]);

  const canUndo = undoStack.length > 0;

  return {
    trackCreate,
    trackUpdate,
    trackDelete,
    undo,
    canUndo,
    undoCount: undoStack.length
  };
};
