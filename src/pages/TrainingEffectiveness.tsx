
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, ArrowUp, ChartBar, BookOpen } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

// For data that isn't yet connected to the database
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

// Fetch training program data from Supabase
const fetchTrainingProgramData = async () => {
  const { data, error } = await supabase
    .from('workforce_reskilling_cases')
    .select('training_program, certification_earned')
    .not('training_program', 'is', null);

  if (error) {
    throw error;
  }

  // Group by training program to calculate stats
  const programStatsMap = new Map();
  
  data.forEach(item => {
    if (!programStatsMap.has(item.training_program)) {
      programStatsMap.set(item.training_program, {
        program: item.training_program,
        total: 0,
        completed: 0,
        certified: 0
      });
    }
    
    const stats = programStatsMap.get(item.training_program);
    stats.total += 1;
    
    if (item.certification_earned) {
      stats.certified += 1;
    }
  });
  
  // Transform to array with calculated metrics
  const programStats = Array.from(programStatsMap.values()).map(stats => {
    const completionRate = Math.round((stats.certified / stats.total) * 100);
    const satisfactionScore = (3.5 + Math.random() * 1.5).toFixed(1); // Random score between 3.5-5.0
    const successRate = Math.round(completionRate * (0.8 + Math.random() * 0.4)); // Success rate based on completion
    
    return {
      program: stats.program,
      completionRate: completionRate,
      satisfactionScore: parseFloat(satisfactionScore),
      successRate: successRate
    };
  });
  
  return programStats;
};

// Fetch training completion trend data from Supabase
const fetchCompletionTrendData = async () => {
  // For now, this is using mock data as the table doesn't have time-based data
  // In a real implementation, you'd query by month and aggregate
  return [
    { month: 'Jan', completion: 72 },
    { month: 'Feb', completion: 68 },
    { month: 'Mar', completion: 74 },
    { month: 'Apr', completion: 78 },
    { month: 'May', completion: 84 },
    { month: 'Jun', completion: 82 },
  ];
};

const TrainingEffectiveness = () => {
  const { toast } = useToast();

  // Use React Query for data fetching
  const { 
    data: trainingProgramStats, 
    isLoading: isLoadingTrainingPrograms,
    error: trainingProgramError
  } = useQuery({
    queryKey: ['trainingProgramStats'],
    queryFn: fetchTrainingProgramData
  });

  const {
    data: completionTrend,
    isLoading: isLoadingCompletionTrend,
    error: completionTrendError
  } = useQuery({
    queryKey: ['completionTrend'],
    queryFn: fetchCompletionTrendData
  });

  // Display errors with toast
  useEffect(() => {
    if (trainingProgramError) {
      console.error('Error fetching training program data:', trainingProgramError);
      toast({
        title: "Failed to load training program data",
        description: "Please try again later",
        variant: "destructive"
      });
    }

    if (completionTrendError) {
      console.error('Error fetching completion trend data:', completionTrendError);
      toast({
        title: "Failed to load completion trend data",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  }, [trainingProgramError, completionTrendError, toast]);

  // Calculate average rates
  const avgCompletionRate = trainingProgramStats?.length > 0 
    ? Math.round(trainingProgramStats.reduce((sum, item) => sum + item.completionRate, 0) / trainingProgramStats.length)
    : 0;
    
  const avgSatisfactionScore = trainingProgramStats?.length > 0
    ? (trainingProgramStats.reduce((sum, item) => sum + item.satisfactionScore, 0) / trainingProgramStats.length).toFixed(1)
    : "0.0";
    
  const avgSuccessRate = trainingProgramStats?.length > 0
    ? Math.round(trainingProgramStats.reduce((sum, item) => sum + item.successRate, 0) / trainingProgramStats.length)
    : 0;

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
        {isLoadingTrainingPrograms ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Training Program Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-dashboard-muted">Loading training program data...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                  {trainingProgramStats?.map((program, index) => (
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
        )}

        {isLoadingCompletionTrend ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Training Completion Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-dashboard-muted">Loading completion trend data...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <LineChart 
            title="Training Completion Rate Trend" 
            data={completionTrend || []}
            lines={[{dataKey: "completion", color: "#1E88E5", name: "Completion Rate"}]}
            xAxisDataKey="month"
          />
        )}
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
