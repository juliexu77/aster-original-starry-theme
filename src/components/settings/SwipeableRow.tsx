import { useState, useRef, ReactNode } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface SwipeableRowProps {
  children: ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

export const SwipeableRow = ({ 
  children, 
  onDelete,
  deleteLabel = "Delete"
}: SwipeableRowProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const DELETE_THRESHOLD = -80;
  const CONFIRM_WIDTH = 80;
  
  // Background opacity based on drag
  const deleteOpacity = useTransform(x, [-CONFIRM_WIDTH, 0], [1, 0]);
  
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < DELETE_THRESHOLD) {
      // Snapped to show delete button
      setShowConfirm(true);
    } else {
      // Reset
      setShowConfirm(false);
    }
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  const handleReset = () => {
    setShowConfirm(false);
  };

  return (
    <div 
      ref={constraintsRef}
      className="relative overflow-hidden"
    >
      {/* Delete button background */}
      <motion.div 
        className="absolute inset-y-0 right-0 flex items-center justify-end bg-destructive"
        style={{ 
          width: CONFIRM_WIDTH,
          opacity: showConfirm ? 1 : deleteOpacity
        }}
      >
        <button
          onClick={handleConfirmDelete}
          className="h-full w-full flex items-center justify-center text-destructive-foreground text-[13px] font-medium"
        >
          {deleteLabel}
        </button>
      </motion.div>
      
      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -CONFIRM_WIDTH, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: showConfirm ? -CONFIRM_WIDTH : 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        style={{ x }}
        className="relative touch-pan-y"
        onClick={showConfirm ? handleReset : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
};
