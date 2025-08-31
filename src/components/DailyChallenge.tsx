import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Star, 
  Clock, 
  ExternalLink,
  Trophy,
  Target
} from "lucide-react";

export const DailyChallenge = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

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
          <h3 className="text-lg font-semibold">Two Sum Problem</h3>
          <p className="text-primary-foreground/80 text-sm">
            Given an array of integers and a target sum, return indices of two numbers that add up to the target.
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Easy</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>15-20 min</span>
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
            variant="secondary" 
            className="flex-1 bg-white/20 hover:bg-white/30 text-white border-none"
          >
            Start Challenge
          </Button>
          <Button 
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