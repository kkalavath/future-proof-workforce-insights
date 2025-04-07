
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ArrowUp, ChartBar } from 'lucide-react';

// Mock data - to be replaced with Supabase data
const trainingProgramStats = [
  { program: 'Digital Skills Fundamentals', completionRate: 82, satisfactionScore: 4.2, successRate: 76 },
  { program: 'Advanced Data Analysis', completionRate: 68, satisfactionScore: 4.5, successRate: 81 },
  { program: 'Project Management', completionRate: 91, satisfactionScore: 4.7, successRate: 88 },
  { program: 'Leadership Development', completionRate: 78, satisfactionScore: 4.0, successRate: 72 },
  { program: 'Technical Writing', completionRate: 85, satisfactionScore: 3.8, successRate: 69 },
  { program: 'Cybersecurity Basics', completionRate: 76, satisfactionScore: 4.3, successRate: 77 },
  { program: 'Customer Experience', completionRate: 93, satisfactionScore: 4.6, successRate: 85 },
];

const skillsGainedData = [
  { skill: 'Technical', beforeTraining: 45, afterTraining: 78 },
  { skill: 'Communication', beforeTraining: 58, afterTraining: 72 },
  { skill: 'Problem Solving', beforeTraining: 52, afterTraining: 81 },
  { skill: 'Project Management', beforeTraining: 40, afterTraining: 74 },
  { skill: 'Data Analysis', beforeTraining: 32, afterTraining: 65 },
];

const trainingMethodEffectiveness = [
  { method: 'In-person Workshop', effectiveness: 78 },
  { method: 'Online Course', effectiveness: 64 },
  { method: 'Blended Learning', effectiveness: 86 },
  { method: 'On-the-job Training', effectiveness: 81 },
  { method: 'Self-paced Learning', effectiveness: 59 },
];

const completionTrend = [
  { month: 'Jan', completion: 72 },
  { month: 'Feb', completion: 68 },
  { month: 'Mar', completion: 74 },
  { month: 'Apr', completion: 78 },
  { month: 'May', completion: 84 },
  { month: 'Jun', completion: 82 },
];

const TrainingEffectiveness = () => {
  // Calculate average rates
  const avgCompletionRate = Math.round(
    trainingProgramStats.reduce((sum, item) => sum + item.completionRate, 0) / trainingProgramStats.length
  );
  const avgSatisfactionScore = (
    trainingProgramStats.reduce((sum, item) => sum + item.satisfactionScore, 0) / trainingProgramStats.length
  ).toFixed(1);
  const avgSuccessRate = Math.round(
    trainingProgramStats.reduce((sum, item) => sum + item.successRate, 0) / trainingProgramStats.length
  );

  return (
    <DashboardLayout 
      title="Training Program Effectiveness" 
      subtitle="Evaluate success rates of existing training programs"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Average Completion Rate" 
          value={`${avgCompletionRate}%`} 
          icon={<Users size={24} className="text-dashboard-primary" />}
          change={6}
          description="Across all programs"
        />
        <StatCard 
          title="Average Satisfaction Score" 
          value={avgSatisfactionScore} 
          icon={<ArrowUp size={24} className="text-dashboard-accent" />}
          description="Out of 5.0"
        />
        <StatCard 
          title="Average Success Rate" 
          value={`${avgSuccessRate}%`} 
          icon={<ChartBar size={24} className="text-dashboard-secondary" />}
          change={4}
          description="Meeting post-training criteria"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Training Program Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Success Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingProgramStats.map((program, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{program.program}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{program.completionRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500"
                            style={{ width: `${program.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{program.satisfactionScore}/5</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{program.successRate}%</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500"
                            style={{ width: `${program.successRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <LineChart 
          title="Training Completion Rate Trend" 
          data={completionTrend}
          lines={[{dataKey: "completion", color: "#1E88E5", name: "Completion Rate"}]}
          xAxisDataKey="month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          title="Effectiveness of Training Methods" 
          data={trainingMethodEffectiveness}
          dataKey="effectiveness"
          nameKey="method"
          color="#4CAF50"
        />
        
        <BarChart 
          title="Skills Assessment: Before vs. After Training" 
          data={skillsGainedData}
          dataKey="afterTraining"
          nameKey="skill"
          color="#00ACC1"
        />
      </div>
    </DashboardLayout>
  );
};

export default TrainingEffectiveness;
