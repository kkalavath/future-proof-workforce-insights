
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Briefcase, Settings, ArrowUp } from 'lucide-react';

// Mock data - to be replaced with Supabase data
const successFactors = [
  { factor: 'Prior Education Level', correlation: 0.72 },
  { factor: 'Years of Experience', correlation: 0.58 },
  { factor: 'Age', correlation: -0.31 },
  { factor: 'Prior Technical Skills', correlation: 0.65 },
  { factor: 'Learning Motivation Score', correlation: 0.83 },
];

const successRateByProgram = [
  { program: 'Digital Skills', successRate: 78 },
  { program: 'Data Analysis', successRate: 81 },
  { program: 'Project Management', successRate: 88 },
  { program: 'Leadership', successRate: 72 },
  { program: 'Technical Writing', successRate: 69 },
];

const successPredictionAccuracy = [
  { month: 'Jan', accuracy: 68 },
  { month: 'Feb', accuracy: 71 },
  { month: 'Mar', accuracy: 75 },
  { month: 'Apr', accuracy: 79 },
  { month: 'May', accuracy: 84 },
  { month: 'Jun', accuracy: 86 },
];

const employeeSuccessData = [
  { group: 'Highly Successful', percentage: 42 },
  { group: 'Moderately Successful', percentage: 31 },
  { group: 'Slightly Successful', percentage: 18 },
  { group: 'Unsuccessful', percentage: 9 },
];

const ReskillSuccess = () => {
  return (
    <DashboardLayout 
      title="Predict Reskilling Success" 
      subtitle="Analyze factors influencing successful reskilling outcomes"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Overall Success Rate" 
          value="73%" 
          icon={<ArrowUp size={24} className="text-dashboard-accent" />}
          change={5}
          description="Employees meeting criteria"
        />
        <StatCard 
          title="Prediction Accuracy" 
          value="84%" 
          icon={<Settings size={24} className="text-dashboard-primary" />}
          change={8}
          description="Current model accuracy"
        />
        <StatCard 
          title="High Success Potential" 
          value="412" 
          icon={<Users size={24} className="text-dashboard-secondary" />}
          description="Employees identified"
        />
        <StatCard 
          title="Low Success Risk" 
          value="178" 
          icon={<Briefcase size={24} className="text-dashboard-warning" />}
          description="Needs additional support"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BarChart 
          title="Key Success Factors (Correlation Coefficient)" 
          data={successFactors}
          dataKey="correlation"
          nameKey="factor"
          color="#4CAF50"
        />
        
        <PieChart 
          title="Employee Success Distribution" 
          data={employeeSuccessData}
          dataKey="percentage"
          nameKey="group"
          colors={["#4CAF50", "#8BC34A", "#FFC107", "#F44336"]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Success Rate by Training Program</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Effectiveness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {successRateByProgram.map((program, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{program.program}</TableCell>
                    <TableCell>{program.successRate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              program.successRate >= 80 ? 'bg-green-500' : 
                              program.successRate >= 70 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${program.successRate}%` }}
                          ></div>
                        </div>
                        <span className={`ml-2 text-xs font-medium ${
                          program.successRate >= 80 ? 'text-green-600' : 
                          program.successRate >= 70 ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {program.successRate >= 80 ? 'High' : 
                           program.successRate >= 70 ? 'Medium' : 
                           'Low'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <LineChart 
          title="Prediction Model Accuracy Over Time" 
          data={successPredictionAccuracy}
          lines={[{dataKey: "accuracy", color: "#1E88E5", name: "Model Accuracy"}]}
          xAxisDataKey="month"
        />
      </div>
    </DashboardLayout>
  );
};

export default ReskillSuccess;
