import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyLog } from '@/hooks/useUserData';

interface DailyLogsChartProps {
  dailyLogs: DailyLog[];
}

export const DailyLogsChart = ({ dailyLogs }: DailyLogsChartProps) => {
  const chartData = dailyLogs
    .slice(0, 7)
    .reverse()
    .map(log => ({
      date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      problems: log.problems_solved,
      time: log.study_time_minutes
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Problems Solved (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="problems" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Study Time (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="time" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};