import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Play, Pause, Square, RotateCcw, Mail, Bell, Target } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useBrowserHistory } from "@/hooks/useBrowserHistory";
import { BrowserHistoryPanel } from "@/components/BrowserHistoryPanel";
import { TimerDurationSelector } from "@/components/TimerDurationSelector";
import { emailService } from "@/services/emailService";
import { toast } from "@/hooks/use-toast";
import { motivationalQuotes } from "@/data/dsaTopics";

interface StudyTimerProps {
  categoryName: string;
  categoryTitle: string;
  initialTimeLeft?: number;
  onSessionComplete: () => void;
  onSwitchTopic: () => void;
  onTimeUpdate: (timeLeft: number) => void;
  pendingUpdates?: { [topicId: string]: number };
}

export const StudyTimer = ({
  categoryName,
  categoryTitle,
  initialTimeLeft = 25 * 60,
  onSessionComplete,
  onSwitchTopic,
  onTimeUpdate,
  pendingUpdates = {}
}: StudyTimerProps) => {
  const [timerDuration, setTimerDuration] = useState(initialTimeLeft);
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('dsa-study-session');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isActive && parsed.currentTopic === categoryName) {
        return parsed.timeLeft;
      }
    }
    return initialTimeLeft;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('dsa-study-session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.isActive && parsed.currentTopic === categoryName;
    }
    return false;
  });
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [overtimeMinutes, setOvertimeMinutes] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { user, addStudySession } = useUserData();
  const { history, completedSessions, isTracking, startTracking, stopTracking, clearHistory, clearCompletedSessions } = useBrowserHistory();

  // Set random motivational quote on component mount
  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setMotivationalQuote(randomQuote);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1;
          onTimeUpdate(newTime);

          // Handle overtime
          if (newTime < 0) {
            const overtime = Math.abs(newTime);
            setOvertimeMinutes(Math.ceil(overtime / 60));
          }

          // Save to localStorage for persistence
          const sessionData = {
            isActive: true,
            currentTopic: categoryName,
            currentTopicTitle: categoryTitle,
            startTime: sessionStartTime?.getTime() || Date.now(),
            timeLeft: newTime,
            timerDuration
          };
          localStorage.setItem('dsa-study-session', JSON.stringify(sessionData));

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate, categoryName, categoryTitle, sessionStartTime, timerDuration]);

  // Auto-complete timer when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }
  }, [timeLeft, isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    if (!isTracking) {
      startTracking(categoryName, categoryTitle);
    }

    // Show motivational toast
    toast({
      title: "🚀 Timer Started!",
      description: motivationalQuote,
      duration: 4000,
    });
  };

  const handlePause = () => setIsRunning(false);

  const handleStop = async () => {
    const actualMinutes = sessionStartTime ? Math.ceil((Date.now() - sessionStartTime.getTime()) / (1000 * 60)) : 0;
    const timerDurationMinutes = Math.ceil(timerDuration / 60);
    const overtimeMinutesActual = Math.max(0, actualMinutes - timerDurationMinutes);

    if (actualMinutes > 0) {
      await addStudySession(problemsSolved, actualMinutes, timerDurationMinutes, categoryName);
    }

    // Send email notification if enabled
    if (emailNotifications && user && actualMinutes >= 5) {
      try {
        await emailService.sendTimerCompleteEmail(
          user.email || '',
          user.user_metadata?.full_name || 'Student',
          {
            duration: actualMinutes,
            problemsSolved,
            topicStudied: categoryTitle,
            overtime: overtimeMinutesActual
          }
        );
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    stopTracking(false);
    resetTimer();
    onSessionComplete();
  };

  const handleSessionComplete = async () => {
    const actualMinutes = sessionStartTime ? Math.ceil((Date.now() - sessionStartTime.getTime()) / (1000 * 60)) : 0;
    const timerDurationMinutes = Math.ceil(timerDuration / 60);
    const overtimeMinutesActual = Math.max(0, actualMinutes - timerDurationMinutes);

    await addStudySession(problemsSolved, actualMinutes, timerDurationMinutes, categoryName);

    // Send email notification
    if (emailNotifications && user) {
      try {
        await emailService.sendTimerCompleteEmail(
          user.email || '',
          user.user_metadata?.full_name || 'Student',
          {
            duration: actualMinutes,
            problemsSolved,
            topicStudied: categoryTitle,
            overtime: overtimeMinutesActual
          }
        );
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    stopTracking(true);

    // Show browser notification
    if (Notification.permission === 'granted') {
      new Notification('🎉 Study Session Complete!', {
        body: `Excellent work! You completed ${timerDurationMinutes}min timer for ${categoryTitle} and solved ${problemsSolved} problems!`,
        icon: '/favicon.ico'
      });
    }

    // Show success toast
    toast({
      title: "🎉 Session Complete!",
      description: `Great job! You studied ${categoryTitle} for ${actualMinutes} minutes and solved ${problemsSolved} problems.`,
      duration: 6000,
    });

    resetTimer();
    onSessionComplete();
  };

  const resetTimer = () => {
    if (isTracking) {
      stopTracking(false);
    }
    setTimeLeft(timerDuration);
    setIsRunning(false);
    setProblemsSolved(0);
    setOvertimeMinutes(0);
    setSessionStartTime(null);
    onTimeUpdate(timerDuration);
    localStorage.removeItem('dsa-study-session');
  };

  const handleReset = () => {
    resetTimer();
  };

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning) {
      setTimerDuration(newDuration);
      setTimeLeft(newDuration);
      onTimeUpdate(newDuration);
    }
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Professional Study Timer
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="text-purple-100 hover:bg-purple-700"
              >
                {emailNotifications ? <Mail className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </Button>
              <Badge variant="secondary" className="bg-purple-700 text-purple-100">
                {isRunning ? 'Active' : 'Ready'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Duration Selector */}
          {!isRunning && (
            <TimerDurationSelector
              selectedDuration={timerDuration}
              onDurationChange={handleDurationChange}
            />
          )}
          
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-purple-100">{categoryTitle}</h3>
            <div className="text-6xl font-mono font-bold text-white mb-2">
              {formatTime(Math.abs(timeLeft))}
            </div>
            {timeLeft < 0 && (
              <div className="text-lg font-semibold text-yellow-300 mb-2">
                ⚡ Overtime: +{overtimeMinutes} min
              </div>
            )}
            <div className="flex items-center justify-center gap-4 text-sm text-purple-200">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                Problems: {problemsSolved}
              </div>
              {sessionStartTime && (
                <div>
                  Started: {sessionStartTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button 
                onClick={handleStart} 
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={timeLeft === 0}
              >
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button 
                onClick={handlePause} 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={handleStop} 
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!isRunning && timeLeft === initialTimeLeft}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="border-purple-400 text-purple-100 hover:bg-purple-700"
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <label className="text-sm text-purple-200 block mb-2">Problems solved this session:</label>
              <div className="flex justify-center gap-2">
                <Button 
                  onClick={() => setProblemsSolved(Math.max(0, problemsSolved - 1))}
                  variant="outline"
                  size="sm"
                  className="border-purple-400 text-purple-100 hover:bg-purple-700"
                >
                  -
                </Button>
                <span className="px-6 py-2 bg-purple-800 rounded-lg text-white font-bold text-lg min-w-[60px] flex items-center justify-center">
                  {problemsSolved}
                </span>
                <Button 
                  onClick={() => setProblemsSolved(problemsSolved + 1)}
                  variant="outline"
                  size="sm"
                  className="border-purple-400 text-purple-100 hover:bg-purple-700"
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Motivational Quote */}
            <div className="bg-purple-800/50 p-4 rounded-lg text-center">
              <p className="text-sm italic text-purple-100">
                💡 {motivationalQuote}
              </p>
            </div>
            
            {/* Email Notification Status */}
            <div className="flex items-center justify-center gap-2 text-xs text-purple-200">
              {emailNotifications ? (
                <><Mail className="h-3 w-3" /> Email notifications enabled</>
              ) : (
                <><Bell className="h-3 w-3" /> Browser notifications only</>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Session History */}
      {(isTracking || history.length > 0) && (
        <BrowserHistoryPanel 
          history={history} 
          onClear={clearHistory}
          title="Current Session History"
        />
      )}

      {/* Completed Sessions History */}
      {completedSessions.length > 0 && (
        <Card className="bg-gray-900 border-gray-700 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>🏆 Completed Study Sessions</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompletedSessions}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedSessions.slice(-5).reverse().map((session, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-200">{session.topicTitle}</h4>
                    <Badge variant="secondary" className="bg-green-800 text-green-200">
                      ✅ Completed
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Started:</p>
                      <p className="text-gray-300">{new Date(session.startTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Activity:</p>
                      <p className="text-gray-300">{session.history.length} pages visited</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};