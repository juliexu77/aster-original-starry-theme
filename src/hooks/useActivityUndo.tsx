// Stubbed - activities table doesn't exist
export const useActivityUndo = () => {
  return {
    trackCreate: () => {},
    trackUpdate: () => {},
    trackDelete: () => {},
    undo: async () => false,
    canUndo: false,
    undoCount: 0
  };
};
