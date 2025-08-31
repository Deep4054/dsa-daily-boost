import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, BookOpen } from "lucide-react";

interface StudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  onSessionComplete: (durationMinutes: number, problemsSolved: number) => void;
}

export const StudySessionModal = ({ isOpen, onClose, topicTitle, onSessionComplete }: StudySessionModalProps) => {
  const [duration, setDuration] = useState(30);
  const [problemsSolved, setProblemsSolved] = useState(1);

  const handleSubmit = () => {
    onSessionComplete(duration, problemsSolved);
    onClose();
    setDuration(30);
    setProblemsSolved(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Study Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Record your study session for <strong>{topicTitle}</strong>
          </p>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="duration">Study Duration (minutes)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  min="1"
                  max="480"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="problems">Problems Solved</Label>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="problems"
                  type="number"
                  value={problemsSolved}
                  onChange={(e) => setProblemsSolved(parseInt(e.target.value) || 0)}
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Log Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};