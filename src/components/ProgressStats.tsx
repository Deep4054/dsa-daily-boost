import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Book,
  Target
} from "lucide-react";

import { UserProgress, UserStats } from "@/hooks/useUserData";

interface ProgressStatsProps {
  userProgress: UserProgress[];
  userStats?: UserStats | null;
}

export const ProgressStats = ({ userProgress, userStats }: ProgressStatsProps) => {
  // Calculate stats from actual database fields only
  const totalProblems = userProgress.reduce((sum, p) => sum + p.problems_solved, 0);
  const totalStudyTime = userProgress.reduce((sum, p) => sum + p.study_time_minutes, 0);
  const completedTopics = userProgress.filter(p => p.completed).length;
  const masteredTopics = userProgress.filter(p => p.mastery_level >= 70).length;
  const averageMastery = userProgress.length > 0 
    ? Math.round(userProgress.reduce((sum, p) => sum + p.mastery_level, 0) / userProgress.length)
    : 0;

  const stats = [
    {
      title: "Problems Solved",
      value: totalProblems.toString(),
      subtitle: "Total problems completed",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "Study Time",
      value: `${totalStudyTime} min`,
      subtitle: "From timer sessions only",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      title: "Topics Mastered",
      value: masteredTopics.toString(),
      subtitle: "≥70% mastery level",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Completed Topics",
      value: completedTopics.toString(),
      subtitle: "Marked as completed",
      icon: Target,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Database Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span className="text-gray-300">{stat.title}</span>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.subtitle}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Details Table */}
      <Card className="bg-gray-900 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Topic Progress Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userProgress.length > 0 ? (
            <div className="space-y-4">
              {userProgress
                .sort((a, b) => b.mastery_level - a.mastery_level)
                .map((progress) => (
                  <div key={progress.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        {progress.topic_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={progress.completed ? "default" : "secondary"}
                          className={progress.completed ? "bg-green-600" : "bg-gray-600"}
                        >
                          {progress.completed ? "Completed" : "In Progress"}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-300">
                          {progress.mastery_level}% mastery
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                      <div>
                        <span className="text-gray-400">Problems Solved:</span>
                        <div className="font-medium">{progress.problems_solved}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Study Time:</span>
                        <div className="font-medium">{progress.study_time_minutes} min</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Last Studied:</span>
                        <div className="font-medium">
                          {new Date(progress.last_studied).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={progress.mastery_level} 
                      className="h-2 mt-3" 
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No progress data yet.</p>
              <p className="text-sm">Start a study session to track your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};