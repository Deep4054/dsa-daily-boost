import { useState } from "react";
import { Header } from "@/components/Header";
import { TopicCard } from "@/components/TopicCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ProgressStats } from "@/components/ProgressStats";
import { AIChatbot } from "@/components/AIChatbot";
import { ProgressEditor } from "@/components/ProgressEditor";
import { StudyTimer } from "@/components/StudyTimer";
import { useUserData } from "@/hooks/useUserData";
import { useStudySession } from "@/hooks/useStudySession";
import { dsaTopics, dsaCategories, codingPlatforms, learningResources } from "@/data/dsaTopics";
import { motivationalQuotes } from "@/data/dsaTopics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Home, TrendingUp, Bot, Trophy, Target, Flame, Star, Settings, Timer } from "lucide-react";
import { ProfileSettings } from "@/components/ProfileSettings";
import { DailyLogsChart } from "@/components/DailyLogsChart";
import { TimerDurationSelector } from "@/components/TimerDurationSelector";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, userProgress: progress, userStats: stats, dailyLogs, studySessions, challengeCompletions, updateProblemStatus, updateTopicProgress, loading } = useUserData();
  const { sessionState, startSession, endSession, updateTimeLeft, switchTopic, addPendingUpdate } = useStudySession();

  const filteredTopics = dsaTopics.filter(topic => {
    const matchesCategory = !activeCategory || 
      Object.entries(dsaCategories).find(([key, cat]) => 
        key === activeCategory && cat.name === topic.category
      );
    
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isTimerActive={sessionState.isActive} />
      
      <main className="container mx-auto px-4 py-6">
        {sessionState.isActive && (
          <div className="mb-6">
            <StudyTimer
              categoryName={sessionState.currentTopic!}
              categoryTitle={sessionState.currentTopicTitle!}
              initialTimeLeft={sessionState.timeLeft}
              onSessionComplete={() => endSession()}
              onTimeUpdate={updateTimeLeft}
              onSwitchTopic={() => {
                // Allow switching topics during timer
              }}
              pendingUpdates={sessionState.pendingUpdates}
            />
          </div>
        )}
        
        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-4xl">
            <TabsTrigger value="home" disabled={sessionState.isActive}>
              <Home className="h-4 w-4 mr-1" />
              Home
            </TabsTrigger>
            <TabsTrigger value="learn">
              <BookOpen className="h-4 w-4 mr-1" />
              Learn
            </TabsTrigger>
            <TabsTrigger value="logs" disabled={sessionState.isActive}>
              <TrendingUp className="h-4 w-4 mr-1" />
              Daily Logs
            </TabsTrigger>
            <TabsTrigger value="profile" disabled={sessionState.isActive}>
              <Settings className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="about" disabled={sessionState.isActive}>About</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Welcome to DSA Daily Boost</h2>
                <p className="text-muted-foreground mb-6">
                  Sign in to track your progress, get personalized recommendations, and unlock all features.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Welcome Section */}
                <div className="text-center py-8">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user.user_metadata?.full_name || user.email}! 👋
                  </h1>
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white mb-4">
                    <p className="text-lg font-medium mb-2">🚀 Ready to continue your DSA journey?</p>
                    <p className="text-sm opacity-90">"Success is the sum of small efforts repeated day in and day out." - Robert Collier</p>
                  </div>
                </div>

                {/* Daily Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {dailyLogs.find(log => log.log_date === new Date().toISOString().split('T')[0])?.problems_solved || 0}
                      </div>
                      <div className="text-sm text-gray-400">Problems Today</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Flame className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {dailyLogs.find(log => log.log_date === new Date().toISOString().split('T')[0])?.study_time_minutes || 0}
                      </div>
                      <div className="text-sm text-gray-400">Minutes Today</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <Timer className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {dailyLogs.find(log => log.log_date === new Date().toISOString().split('T')[0])?.timer_duration_minutes || 0}
                      </div>
                      <div className="text-sm text-gray-400">Timer Minutes</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {dailyLogs.find(log => log.log_date === new Date().toISOString().split('T')[0])?.overtime_minutes || 0}
                      </div>
                      <div className="text-sm text-gray-400">Overtime Minutes</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Study Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {studySessions && studySessions.length > 0 ? (
                      <div className="space-y-3">
                        {studySessions.slice(0, 5).map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium text-white">{session.category}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(session.session_date).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className="text-purple-400">
                                {session.problems_solved || 0} problems
                              </span>
                              <span className="text-orange-400">
                                {session.study_time_minutes || 0}min
                              </span>
                              <span className="text-green-400">
                                +{Math.max(0, (session.study_time_minutes || 0) - (session.timer_duration_minutes || 0))}min
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        No study sessions yet. Complete a timer to start tracking!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="learn" className="space-y-6">
            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <CategoryFilter 
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Topics Grid */}
            <div className="space-y-6">
              {Object.entries(dsaCategories).map(([categoryKey, category]) => {
                const categoryTopics = filteredTopics.filter(topic => topic.category === category.name);
                
                if (categoryTopics.length === 0) return null;
                
                const categoryProgress = progress.filter(p => 
                  categoryTopics.some(topic => topic.id === p.topic_id)
                );
                const totalProblems = categoryProgress.reduce((sum, p) => sum + p.problems_solved, 0);
                const totalPossible = categoryTopics.reduce((sum, topic) => sum + topic.problemsCount, 0);
                const categoryMastery = totalPossible > 0 ? Math.round((totalProblems / totalPossible) * 100) : 0;
                
                return (
                  <div key={categoryKey} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        {category.name}
                        {!sessionState.isActive && (
                          <div className="ml-4">
                            <TimerDurationSelector 
                              onDurationSelect={(minutes) => {
                                const seconds = minutes * 60;
                                startSession(category.name, category.name, seconds);
                              }}
                            />
                          </div>
                        )}
                      </h3>
                    </div>
                    

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryTopics.map((topic) => (
                        <TopicCard 
                          key={topic.id} 
                          topic={topic}
                          userProgress={progress.find(p => p.topic_id === topic.id)}
                          onProgressUpdate={user ? (sessionState.isActive ? addPendingUpdate : updateProblemStatus) : undefined}
                          onStartTimer={startSession}
                          isTimerActive={sessionState.isActive}
                          isCurrentTopic={sessionState.currentTopic === category.name}
                          sessionState={sessionState}
                          addPendingUpdate={addPendingUpdate}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>





          <TabsContent value="logs" className="space-y-6">
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Sign in to View Daily Logs</h2>
                <p className="text-muted-foreground">
                  Track your daily study progress and see your learning trends.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Daily Study Logs</h2>
                
                {/* Motivation Section */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white mb-6">
                  <h3 className="text-xl font-bold mb-2">🎆 Daily Motivation</h3>
                  <p className="text-lg">{motivationalQuotes[0]}</p>
                </div>

                {dailyLogs.length > 0 ? (
                  <>
                    <DailyLogsChart dailyLogs={dailyLogs} />
                    
                    {/* Enhanced Daily Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-600">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            🏆 This Week's Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-white">
                              <span>Problems Solved:</span>
                              <span className="font-bold">{dailyLogs.slice(0, 7).reduce((sum, log) => sum + (log.problems_solved || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span>Study Time:</span>
                              <span className="font-bold">{dailyLogs.slice(0, 7).reduce((sum, log) => sum + (log.study_time_minutes || 0), 0)} min</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span>Overtime:</span>
                              <span className="font-bold text-green-400">+{dailyLogs.slice(0, 7).reduce((sum, log) => sum + (log.overtime_minutes || 0), 0)} min</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center gap-2">
                            📈 All Time Stats
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between text-white">
                              <span>Total Problems:</span>
                              <span className="font-bold">{dailyLogs.reduce((sum, log) => sum + (log.problems_solved || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span>Total Study Time:</span>
                              <span className="font-bold">{Math.round(dailyLogs.reduce((sum, log) => sum + (log.study_time_minutes || 0), 0) / 60)} hours</span>
                            </div>
                            <div className="flex justify-between text-white">
                              <span>Study Days:</span>
                              <span className="font-bold">{dailyLogs.length} days</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white">Recent Study Days</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dailyLogs.slice(0, 10).map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg border border-gray-600">
                              <div>
                                <p className="font-medium text-white">
                                  {new Date(log.log_date).toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Efficiency: {log.timer_duration_minutes > 0 ? Math.round(((log.study_time_minutes || 0) / (log.timer_duration_minutes || 1)) * 100) : 0}%
                                </p>
                              </div>
                              <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-purple-400 font-bold">{log.problems_solved || 0}</div>
                                  <div className="text-xs text-gray-500">problems</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-orange-400 font-bold">{log.study_time_minutes || 0}</div>
                                  <div className="text-xs text-gray-500">actual min</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-blue-400 font-bold">{log.timer_duration_minutes || 0}</div>
                                  <div className="text-xs text-gray-500">timer min</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-green-400 font-bold">+{log.overtime_minutes || 0}</div>
                                  <div className="text-xs text-gray-500">overtime</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Start Your DSA Journey!</h3>
                    <p className="text-gray-400 mb-6">
                      Complete your first timer session to start tracking your amazing progress!
                    </p>
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white max-w-md mx-auto">
                      <p className="font-medium">{motivationalQuotes[0]}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {!user ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Sign in to View Profile</h2>
                <p className="text-muted-foreground">
                  Customize your learning experience.
                </p>
              </div>
            ) : (
              <ProfileSettings />
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg p-8 text-white mb-8">
                <h1 className="text-4xl font-bold mb-4 text-center">🚀 DSA Daily Boost</h1>
                <p className="text-xl text-center text-purple-200 mb-6">
                  Professional DSA Learning Platform with Comprehensive Resources
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-400">{dsaTopics.length}+</div>
                    <div className="text-sm text-purple-200">DSA Topics</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-400">2000+</div>
                    <div className="text-sm text-purple-200">Practice Problems</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">50+</div>
                    <div className="text-sm text-purple-200">Hours Content</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-3xl font-bold text-orange-400">6+</div>
                    <div className="text-sm text-purple-200">Platforms</div>
                  </div>
                </div>
              </div>

              {/* Coding Platforms */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">💻 Supported Coding Platforms</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {codingPlatforms.map((platform, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          {platform.name}
                          <Badge variant="secondary" className="bg-purple-800 text-purple-200">
                            {platform.problems}
                          </Badge>
                        </CardTitle>
                        <p className="text-gray-400 text-sm">{platform.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Difficulty:</span>
                            <span className="text-white">{platform.difficulty}</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-500">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {platform.features.map((feature, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 border-purple-600 text-purple-300 hover:bg-purple-900/30"
                            onClick={() => window.open(platform.url, '_blank')}
                          >
                            Visit Platform
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Learning Resources */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">📚 Learning Resources</h2>
                <div className="space-y-6">
                  {learningResources.map((category, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-white text-xl">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.resources.map((resource, i) => (
                            <div key={i} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                              <h4 className="font-semibold text-purple-300 mb-2">{resource.name}</h4>
                              <p className="text-sm text-gray-300 mb-3">{resource.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                                onClick={() => window.open(resource.url, '_blank')}
                              >
                                Visit Resource →
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gray-900 rounded-lg p-6 text-white border border-gray-700">
                  <h3 className="text-2xl font-bold mb-4 text-gray-300">🚀 Professional Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Comprehensive DSA Topics with Preparation Plans</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Custom Timer Durations (15-60+ minutes)</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Email Notifications & Progress Reports</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Multiple Coding Platforms Integration</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Detailed Resource Collections</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Learning Roadmap & Phase Tracking</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Overtime Tracking & Dedication Metrics</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Motivational Quotes & Achievement System</li>
                  </ul>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 text-white border border-gray-700">
                  <h3 className="text-2xl font-bold mb-4 text-gray-300">📚 Professional Learning Path</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-600 pl-4">
                      <h4 className="font-semibold text-purple-300">1. Explore Topics</h4>
                      <p className="text-sm text-gray-300">Browse comprehensive DSA topics with detailed preparation plans</p>
                    </div>
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-blue-300">2. Custom Timer</h4>
                      <p className="text-sm text-gray-300">Set personalized study durations with overtime tracking</p>
                    </div>
                    <div className="border-l-4 border-green-600 pl-4">
                      <h4 className="font-semibold text-green-300">3. Multi-Resource Learning</h4>
                      <p className="text-sm text-gray-300">Access videos, articles, and practice problems from multiple platforms</p>
                    </div>
                    <div className="border-l-4 border-orange-600 pl-4">
                      <h4 className="font-semibold text-orange-300">4. Track & Improve</h4>
                      <p className="text-sm text-gray-300">Monitor progress with detailed analytics and email reports</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white mt-8 border border-gray-700">
                <h3 className="text-3xl font-bold mb-6 text-center text-white">🎯 Why Choose DSA Daily Boost?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="bg-purple-900/30 rounded-lg p-6">
                    <div className="text-5xl mb-4">📚</div>
                    <h4 className="font-bold text-purple-300 mb-3 text-lg">Comprehensive Content</h4>
                    <p className="text-sm text-gray-300">Detailed preparation plans, multiple resource types, and professional learning paths</p>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-6">
                    <div className="text-5xl mb-4">⚡</div>
                    <h4 className="font-bold text-blue-300 mb-3 text-lg">Smart Features</h4>
                    <p className="text-sm text-gray-300">Custom timers, email notifications, overtime tracking, and motivational elements</p>
                  </div>
                  <div className="bg-green-900/30 rounded-lg p-6">
                    <div className="text-5xl mb-4">🚀</div>
                    <h4 className="font-bold text-green-300 mb-3 text-lg">Professional Growth</h4>
                    <p className="text-sm text-gray-300">Industry-standard practices, multiple coding platforms, and career-focused learning</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;