import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  FileText, 
  Code, 
  CheckCircle, 
  Circle,
  Clock,
  Star,
  Youtube,
  List,
  Timer,
  Lock,
  BookOpen,
  Target,
  TrendingUp,
  ExternalLink,
  PlayCircle,
  Zap,
  Award,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressModal } from "@/components/ProgressModal";
import { useUserData } from "@/hooks/useUserData";
import { DSATopic } from "@/data/dsaTopics";

interface TopicCardProps {
  topic: DSATopic;
  userProgress?: {
    mastery_level: number;
    problems_solved: number;
    completed: boolean;
    study_time_minutes: number;
  };
  onProgressUpdate?: (topicId: string, status?: 'completed' | 'not-completed' | 'saved') => void;
  onStartTimer?: (topicId: string, topicTitle: string) => void;
  isTimerActive?: boolean;
  isCurrentTopic?: boolean;
  sessionState?: any;
  addPendingUpdate?: (topicId: string) => void;
}

export const TopicCard = ({
  topic,
  userProgress,
  onProgressUpdate,
  onStartTimer,
  isTimerActive = false,
  isCurrentTopic = false,
  sessionState,
  addPendingUpdate
}: TopicCardProps) => {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showResources, setShowResources] = useState(false);

  const {
    id,
    title,
    category,
    difficulty,
    estimatedTime,
    problemsCount,
    striverVideoUrl,
    striverSeriesUrl,
    blogUrl,
    leetcodeUrl,
    categoryColor,
    description,
    preparationPlan,
    resources,
    roadmapPosition
  } = topic;

  const progress = userProgress?.mastery_level || 0;
  const completedProblems = userProgress?.problems_solved || 0;
  const studyTime = userProgress?.study_time_minutes || 0;
  const isCompleted = progress >= 70;

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400 bg-green-900/20 border-green-600';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-600';
      case 'Hard': return 'text-red-400 bg-red-900/20 border-red-600';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-600';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Beginner': return 'text-blue-400 bg-blue-900/20';
      case 'Intermediate': return 'text-purple-400 bg-purple-900/20';
      case 'Advanced': return 'text-orange-400 bg-orange-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handlePracticeClick = () => {
    if (leetcodeUrl && (!isTimerActive || isCurrentTopic)) {
      window.open(leetcodeUrl, '_blank');
      setTimeout(() => setShowProgressModal(true), 3000);
    }
  };

  const isDisabled = isTimerActive && category !== sessionState?.currentTopic;

  return (
    <Card className={cn(
      "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white transition-all duration-300",
      isDisabled && "opacity-30 grayscale cursor-not-allowed",
      !isDisabled && "hover:shadow-xl hover:scale-[1.02] hover:border-purple-500/50",
      isCompleted && "ring-2 ring-green-500/30"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-2">
              {isDisabled ? (
                <Lock className="w-5 h-5 text-gray-500" />
              ) : isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Circle className="w-5 h-5 text-gray-500" />
              )}
              <CardTitle className="text-lg text-white leading-tight">{title}</CardTitle>
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-purple-800/50 text-purple-200 border border-purple-600/30"
              >
                {category}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getDifficultyColor(difficulty))}
              >
                {difficulty}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getPhaseColor(roadmapPosition.phase))}
              >
                {roadmapPosition.phase}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Target className="w-4 h-4" />
              <span>{problemsCount} problems</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        {userProgress && (
          <div className="grid grid-cols-3 gap-4 p-3 bg-gray-800/50 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{completedProblems}</div>
              <div className="text-xs text-gray-400">Solved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{progress}%</div>
              <div className="text-xs text-gray-400">Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-400">{Math.round(studyTime / 60)}h</div>
              <div className="text-xs text-gray-400">Studied</div>
            </div>
          </div>
        )}
        
        {/* Primary Resource Links */}
        <div className="grid grid-cols-2 gap-3">
          {striverVideoUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-red-900/20 hover:bg-red-800/30 border-red-600/30 text-red-200 hover:text-red-100"
              onClick={() => window.open(striverVideoUrl, '_blank')}
              disabled={isDisabled}
            >
              <Youtube className="w-4 h-4" />
              <span>Striver Video</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          {blogUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-blue-900/20 hover:bg-blue-800/30 border-blue-600/30 text-blue-200 hover:text-blue-100"
              onClick={() => window.open(blogUrl, '_blank')}
              disabled={isDisabled}
            >
              <FileText className="w-4 h-4" />
              <span>Article</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          {leetcodeUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-orange-900/20 hover:bg-orange-800/30 border-orange-600/30 text-orange-200 hover:text-orange-100"
              onClick={() => window.open(leetcodeUrl, '_blank')}
              disabled={isDisabled}
            >
              <Code className="w-4 h-4" />
              <span>Practice</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
          {striverSeriesUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-purple-900/20 hover:bg-purple-800/30 border-purple-600/30 text-purple-200 hover:text-purple-100"
              onClick={() => window.open(striverSeriesUrl, '_blank')}
              disabled={isDisabled}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Series</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          )}
        </div>
        
        {/* Expandable Sections */}
        <div className="space-y-3">
          {/* Preparation Plan */}
          <div className="border border-gray-700 rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto text-left hover:bg-gray-800/50"
              onClick={() => setShowDetails(!showDetails)}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-medium">Preparation Plan</span>
              </div>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showDetails && (
              <div className="p-4 border-t border-gray-700 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center">
                    <Zap className="w-3 h-3 mr-1" /> Short Term (1-2 weeks)
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {preparationPlan.shortTerm.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                    <Award className="w-3 h-3 mr-1" /> Long Term (1-3 months)
                  </h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {preparationPlan.longTerm.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Comprehensive Resources */}
          <div className="border border-gray-700 rounded-lg">
            <Button
              variant="ghost"
              className="w-full justify-between p-3 h-auto text-left hover:bg-gray-800/50"
              onClick={() => setShowResources(!showResources)}
            >
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="font-medium">All Resources</span>
                <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300">
                  {resources.videos.length + resources.articles.length + resources.practice.length}
                </Badge>
              </div>
              {showResources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            {showResources && (
              <div className="p-4 border-t border-gray-700 space-y-4">
                {/* Videos */}
                {resources.videos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center">
                      <PlayCircle className="w-3 h-3 mr-1" /> Videos ({resources.videos.length})
                    </h4>
                    <div className="space-y-2">
                      {resources.videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-200">{video.title}</p>
                            <p className="text-xs text-gray-400">{video.duration}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 p-1"
                            onClick={() => window.open(video.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Articles */}
                {resources.articles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                      <FileText className="w-3 h-3 mr-1" /> Articles ({resources.articles.length})
                    </h4>
                    <div className="space-y-2">
                      {resources.articles.map((article, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-200">{article.title}</p>
                            <p className="text-xs text-gray-400">{article.readTime}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 p-1"
                            onClick={() => window.open(article.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Practice Platforms */}
                {resources.practice.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                      <Code className="w-3 h-3 mr-1" /> Practice Platforms ({resources.practice.length})
                    </h4>
                    <div className="space-y-2">
                      {resources.practice.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-200">{platform.platform}</p>
                            <p className="text-xs text-gray-400">{platform.problems} problems</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300 p-1"
                            onClick={() => window.open(platform.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <ProgressModal
        isOpen={showProgressModal}
        onClose={() => setShowProgressModal(false)}
        topicTitle={title}
        onStatusUpdate={(status) => {
          if (onProgressUpdate) {
            onProgressUpdate(id, status);
          }
        }}
      />
    </Card>
  );
};