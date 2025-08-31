import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useUserData } from "@/hooks/useUserData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Target, Flame, BookOpen, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user, userProgress: progress, userStats: stats, loading } = useUserData();
  const navigate = useNavigate();

  // Remove redirect to make dashboard accessible
  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate("/");
  //   }
  // }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome back, {user.user_metadata?.full_name || user.email}! 👋
          </h1>
          <p className="text-gray-300">
            Ready to continue your DSA journey? Let's make today count!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-purple-900 border-purple-700">
                  <CardContent className="p-4 text-center">
                    <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalProblems}</div>
                    <div className="text-sm text-purple-300">Problems Solved</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-900 border-purple-700">
                  <CardContent className="p-4 text-center">
                    <Trophy className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.topicsMastered}</div>
                    <div className="text-sm text-purple-300">Topics Mastered</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-900 border-purple-700">
                  <CardContent className="p-4 text-center">
                    <Flame className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.currentStreak}</div>
                    <div className="text-sm text-purple-300">Day Streak</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-900 border-purple-700">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stats.totalXP}</div>
                    <div className="text-sm text-purple-300">Total XP</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress.length > 0 ? (
                  <div className="space-y-3">
                    {progress
                      .sort((a, b) => new Date(b.last_practiced).getTime() - new Date(a.last_practiced).getTime())
                      .slice(0, 5)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <p className="font-medium text-white">{item.topic_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="text-sm text-gray-400">
                              {item.problems_solved} problems solved
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={item.mastery_level >= 70 ? "default" : "secondary"} className="bg-purple-600 text-white">
                              {item.mastery_level}% mastery
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.last_practiced).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No activity yet. Start solving problems to see your progress here!</p>
                    <Button 
                      onClick={() => navigate("/")}
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                    >
                      Start Learning
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Goals */}
            {stats && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Problems</span>
                      <span className="text-sm font-medium text-white">
                        {stats.weeklyGoals.problemsCompleted}/{stats.weeklyGoals.problemsTarget}
                      </span>
                    </div>
                    <Progress 
                      value={(stats.weeklyGoals.problemsCompleted / stats.weeklyGoals.problemsTarget) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Study Hours</span>
                      <span className="text-sm font-medium text-white">
                        {stats.weeklyGoals.hoursCompleted}/{stats.weeklyGoals.hoursTarget}
                      </span>
                    </div>
                    <Progress 
                      value={(stats.weeklyGoals.hoursCompleted / stats.weeklyGoals.hoursTarget) * 100} 
                      className="h-2"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">Topics</span>
                      <span className="text-sm font-medium text-white">
                        {stats.weeklyGoals.topicsCompleted}/{stats.weeklyGoals.topicsTarget}
                      </span>
                    </div>
                    <Progress 
                      value={(stats.weeklyGoals.topicsCompleted / stats.weeklyGoals.topicsTarget) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
                  variant="outline"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;