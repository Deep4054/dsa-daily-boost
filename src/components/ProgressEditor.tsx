import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/hooks/useUserData";
import { Edit, Save, X } from "lucide-react";

interface ProgressEditorProps {
  progress: {
    id: string;
    topic_id: string;
    mastery_level: number;
    problems_solved: number;
    study_time_minutes: number;
    completed: boolean;
  };
}

export const ProgressEditor = ({ progress }: ProgressEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mastery_level: progress.mastery_level,
    problems_solved: progress.problems_solved,
    study_time_minutes: progress.study_time_minutes
  });
  const { updateProblemStatus } = useUserData();

  const handleSave = async () => {
    // Update progress in database
    await updateProblemStatus(progress.topic_id, 'completed');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      mastery_level: progress.mastery_level,
      problems_solved: progress.problems_solved,
      study_time_minutes: progress.study_time_minutes
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {progress.topic_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={progress.completed ? "default" : "secondary"}>
              {progress.completed ? "Completed" : "In Progress"}
            </Badge>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Mastery Level: {formData.mastery_level}%</Label>
          <Progress value={formData.mastery_level} className="mt-2" />
          {isEditing && (
            <Input
              type="range"
              min="0"
              max="100"
              value={formData.mastery_level}
              onChange={(e) => setFormData(prev => ({ ...prev, mastery_level: parseInt(e.target.value) }))}
              className="mt-2"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="problems">Problems Solved</Label>
            {isEditing ? (
              <Input
                id="problems"
                type="number"
                value={formData.problems_solved}
                onChange={(e) => setFormData(prev => ({ ...prev, problems_solved: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            ) : (
              <div className="text-2xl font-bold">{formData.problems_solved}</div>
            )}
          </div>
          
          <div>
            <Label htmlFor="study_time">Study Time (minutes)</Label>
            {isEditing ? (
              <Input
                id="study_time"
                type="number"
                value={formData.study_time_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, study_time_minutes: parseInt(e.target.value) || 0 }))}
                min="0"
              />
            ) : (
              <div className="text-2xl font-bold">{formData.study_time_minutes}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};