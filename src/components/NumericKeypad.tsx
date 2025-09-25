import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Delete } from "lucide-react";

interface NumericKeypadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title?: string;
  unit?: string;
  initialValue?: string;
}

export const NumericKeypad = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Enter Amount",
  unit = "oz",
  initialValue = ""
}: NumericKeypadProps) => {
  const [value, setValue] = useState(initialValue);

  const handleNumber = (num: string) => {
    if (value.length < 6) { // Limit to reasonable length
      setValue(prev => prev + num);
    }
  };

  const handleDecimal = () => {
    if (!value.includes('.') && value.length > 0) {
      setValue(prev => prev + '.');
    }
  };

  const handleBackspace = () => {
    setValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (value && parseFloat(value) > 0) {
      onSubmit(value);
      setValue("");
      onClose();
    }
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-medium text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Display */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-foreground min-h-[40px] flex items-center justify-center">
              {value || "0"}
              <span className="text-xl text-muted-foreground ml-2">{unit}</span>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {/* Numbers 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="outline"
                className="h-12 text-lg font-medium hover:bg-muted"
                onClick={() => handleNumber(num.toString())}
              >
                {num}
              </Button>
            ))}
            
            {/* Bottom row: decimal, 0, backspace */}
            <Button
              variant="outline"
              className="h-12 text-lg font-medium hover:bg-muted"
              onClick={handleDecimal}
            >
              .
            </Button>
            <Button
              variant="outline"
              className="h-12 text-lg font-medium hover:bg-muted"
              onClick={() => handleNumber("0")}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-12 hover:bg-muted"
              onClick={handleBackspace}
            >
              <Delete className="h-5 w-5" />
            </Button>
          </div>

          {/* Submit button */}
          <Button
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={!value || parseFloat(value) <= 0}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};