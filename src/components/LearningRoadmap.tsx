import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock, Target } from "lucide-react";
import { dsaTopics } from "@/data/dsaTopics";
import { UserProgress } from "@/hooks/useUserData";

interface LearningRoadmapProps {
  userProgress: UserProgress[];
}

const roadmapStages = [
  {
    title: "Foundation",
    topics: ["arrays", "strings", "basic-math"],
    description: "Start with basic data structures and problem-solving patterns"
  },
  {
    title: "Core Structures", 
    topics: ["linked-lists", "stacks-queues", "hashing"],
    description: "Master fundamental data structures and their operations"
  },
  {
    title: "Advanced Structures",
    topics: ["trees", "heaps", "graphs"],
    description: "Learn complex data structures and tree/graph algorithms"
  },
  {
    title: "Algorithms",
    topics: ["sorting", "searching", "recursion", "dynamic-programming"],
    description: "Master algorithmic techniques and optimization strategies"
  },
  {
    title: "Advanced Topics",
    topics: ["backtracking", "greedy", "advanced-graphs", "system-design"],
    description: "Tackle complex algorithmic concepts and system design"
  }
];

export const LearningRoadmap = ({ userProgress }: LearningRoadmapProps) => {
  const getTopicProgress = (topicId: string) => {
    return userProgress.find(p => p.topic_id === topicId);
  };

  const getStageProgress = (topics: string[]) => {
    const completedTopics = topics.filter(topicId => {
      const progress = getTopicProgress(topicId);
      return progress?.mastery_level && progress.mastery_level >= 70;
    }).length;
    
    return Math.round((completedTopics / topics.length) * 100);
  };

  const getStageStatus = (topics: string[]) => {
    const completedTopics = topics.filter(topicId => {
      const progress = getTopicProgress(topicId);
      return progress?.mastery_level && progress.mastery_level >= 70;
    }).length;
    
    if (completedTopics === topics.length) return 'completed';
    if (completedTopics > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Learning Roadmap</h2>
        <p className="text-muted-foreground">
          Follow this structured path to master Data Structures & Algorithms
        </p>
      </div>

      <div className="space-y-4">
        {roadmapStages.map((stage, index) => {
          const progress = getStageProgress(stage.topics);
          const status = getStageStatus(stage.topics);
          
          return (
            <Card key={stage.title} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      status === 'completed' 
                        ? 'bg-success text-success-foreground' 
                        : status === 'in-progress'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stage.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {status === 'completed' && (
                      <Badge variant="default" className="bg-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {status === 'in-progress' && (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    )}
                    {status === 'not-started' && (
                      <Badge variant="outline">
                        <Circle className="h-3 w-3 mr-1" />
                        Not Started
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground">{progress}% Complete</p>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stage.topics.map(topicId => {
                    const topic = dsaTopics.find(t => t.id === topicId);
                    const topicProgress = getTopicProgress(topicId);
                    
                    if (!topic) return null;
                    
                    return (
                      <div 
                        key={topicId}
                        className={`p-3 rounded-lg border transition-colors ${
                          topicProgress?.mastery_level && topicProgress.mastery_level >= 70
                            ? 'bg-success/10 border-success/20'
                            : topicProgress?.mastery_level && topicProgress.mastery_level > 0
                            ? 'bg-warning/10 border-warning/20'
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{topic.title}</h4>
                          {topicProgress?.mastery_level && topicProgress.mastery_level >= 70 ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : topicProgress?.mastery_level && topicProgress.mastery_level > 0 ? (
                            <Target className="h-4 w-4 text-warning" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        
                        {topicProgress && (
                          <div className="space-y-1">
                            <Progress 
                              value={topicProgress.mastery_level} 
                              className="h-1" 
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{topicProgress.mastery_level}% mastery</span>
                              <span>{topicProgress.problems_solved} problems</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};