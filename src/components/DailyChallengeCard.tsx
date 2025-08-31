import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, Star } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

interface DailyChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string | null;
    difficulty: string;
    points: number;
    topic_id: string;
  };
  isCompleted: boolean;
}

export const DailyChallengeCard = ({ challenge, isCompleted }: DailyChallengeCardProps) => {
  const { completeChallenge } = useUserData();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleComplete = async () => {
    if (!isCompleted) {
      await completeChallenge(challenge.id);
    }
  };

  return (
    <Card className={`${isCompleted ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4" />
              {challenge.points}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenge.description && (
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Topic: {challenge.topic_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          
          {isCompleted ? (
            <div className="flex items-center gap-2 text-green-600">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Completed!</span>
            </div>
          ) : (
            <Button onClick={handleComplete} size="sm">
              Complete Challenge
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};