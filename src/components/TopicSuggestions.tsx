import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Target, Star } from "lucide-react";
import { dsaTopics } from "@/data/dsaTopics";
import { UserProgress } from "@/hooks/useUserData";

interface TopicSuggestionsProps {
  userProgress: UserProgress[];
  onTopicSelect: (topicId: string) => void;
}

export const TopicSuggestions = ({ userProgress, onTopicSelect }: TopicSuggestionsProps) => {
  const getPersonalizedSuggestions = () => {
    const suggestions = [];
    
    // Get topics with low mastery that were recently studied
    const needsReview = userProgress
      .filter(p => p.mastery_level < 70 && p.mastery_level > 0)
      .sort((a, b) => new Date(b.last_studied).getTime() - new Date(a.last_studied).getTime())
      .slice(0, 2);
    
    needsReview.forEach(progress => {
      const topic = dsaTopics.find(t => t.id === progress.topic_id);
      if (topic) {
        suggestions.push({
          ...topic,
          reason: 'Review needed',
          icon: Target,
          priority: 'high'
        });
      }
    });
    
    // Get next logical topics based on prerequisites
    const completedTopics = userProgress
      .filter(p => p.mastery_level >= 70)
      .map(p => p.topic_id);
    
    // Suggest arrays if nothing completed
    if (completedTopics.length === 0) {
      const arrays = dsaTopics.find(t => t.id === 'arrays');
      if (arrays) {
        suggestions.push({
          ...arrays,
          reason: 'Start here',
          icon: Star,
          priority: 'high'
        });
      }
    }
    
    // Suggest next topics based on completed ones
    const nextTopics = [];
    if (completedTopics.includes('arrays')) {
      nextTopics.push('strings', 'linked-lists');
    }
    if (completedTopics.includes('strings') && completedTopics.includes('arrays')) {
      nextTopics.push('stacks-queues', 'hashing');
    }
    if (completedTopics.includes('linked-lists') && completedTopics.includes('stacks-queues')) {
      nextTopics.push('trees', 'recursion');
    }
    
    nextTopics.forEach(topicId => {
      const topic = dsaTopics.find(t => t.id === topicId);
      const hasProgress = userProgress.find(p => p.topic_id === topicId);
      
      if (topic && !hasProgress) {
        suggestions.push({
          ...topic,
          reason: 'Next in path',
          icon: TrendingUp,
          priority: 'medium'
        });
      }
    });
    
    // Add trending topics if we need more suggestions
    if (suggestions.length < 4) {
      const trendingTopics = ['dynamic-programming', 'graphs', 'trees'];
      trendingTopics.forEach(topicId => {
        const topic = dsaTopics.find(t => t.id === topicId);
        const hasProgress = userProgress.find(p => p.topic_id === topicId);
        
        if (topic && !hasProgress && !suggestions.find(s => s.id === topicId)) {
          suggestions.push({
            ...topic,
            reason: 'Popular choice',
            icon: TrendingUp,
            priority: 'low'
          });
        }
      });
    }
    
    return suggestions.slice(0, 4);
  };

  const suggestions = getPersonalizedSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {suggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            const userTopicProgress = userProgress.find(p => p.topic_id === suggestion.id);
            
            return (
              <div 
                key={suggestion.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    suggestion.priority === 'high' 
                      ? 'bg-primary/10 text-primary'
                      : suggestion.priority === 'medium'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge 
                        variant={suggestion.priority === 'high' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.reason}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {suggestion.description}
                    </p>
                    {userTopicProgress && (
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {userTopicProgress.mastery_level}% complete
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onTopicSelect(suggestion.id)}
                >
                  Start
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};