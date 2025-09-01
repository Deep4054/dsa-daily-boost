import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dsaTopics } from "@/data/dsaTopics";
import { 
  Calendar, 
  Star, 
  Clock, 
  ExternalLink,
  Trophy,
  Target
} from "lucide-react";
import { useToast } from "./ui/use-toast";

export const DailyChallenge = () => {
  const { toast } = useToast();

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Deterministically select a challenge based on the day of the year
  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const dailyChallenge = dsaTopics[getDayOfYear(new Date()) % dsaTopics.length];

  return (
    <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Daily Challenge</span>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {today}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{dailyChallenge.title}</h3>
          <p className="text-primary-foreground/80 text-sm">
            {dailyChallenge.description}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{dailyChallenge.difficulty}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{dailyChallenge.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>50 XP</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Today's Goal</div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="text-sm">Complete in under 20 minutes for bonus XP!</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => toast({
              title: "Challenge Started!",
              description: `The timer has begun for ${dailyChallenge.title}. Good luck!`,
            })}
            variant="secondary" 
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none"
          >
            Start Challenge
          </Button>
          <Button 
            onClick={() => {
              if (dailyChallenge.leetcodeUrl) {
                window.open(dailyChallenge.leetcodeUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            disabled={!dailyChallenge.leetcodeUrl}
            variant="outline" 
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};