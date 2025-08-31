import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, BookmarkIcon } from "lucide-react";

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  onStatusUpdate: (status: 'completed' | 'not-completed' | 'saved') => void;
}

export const ProgressModal = ({ isOpen, onClose, topicTitle, onStatusUpdate }: ProgressModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'not-completed' | 'saved' | null>(null);

  const handleStatusSelect = (status: 'completed' | 'not-completed' | 'saved') => {
    setSelectedStatus(status);
    onStatusUpdate(status);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            How did you do with <strong>{topicTitle}</strong>?
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleStatusSelect('completed')}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4 hover:bg-green-50 hover:border-green-200"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Completed</div>
                <div className="text-sm text-muted-foreground">I solved the problems successfully</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleStatusSelect('not-completed')}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4 hover:bg-red-50 hover:border-red-200"
            >
              <XCircle className="h-5 w-5 text-red-600" />
              <div className="text-left">
                <div className="font-medium">Not Completed</div>
                <div className="text-sm text-muted-foreground">I couldn't solve the problems</div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleStatusSelect('saved')}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-4 hover:bg-blue-50 hover:border-blue-200"
            >
              <BookmarkIcon className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Saved for Later</div>
                <div className="text-sm text-muted-foreground">I bookmarked but didn't complete</div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};