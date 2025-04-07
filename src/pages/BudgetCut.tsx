
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ChartBar, Users, AlertTriangle } from 'lucide-react';

// Mock data - to be replaced with Supabase data
const currentVsReducedBudget = [
  { category: 'Digital Skills', current: 450000, reduced: 315000 },
  { category: 'Technical Training', current: 320000, reduced: 224000 },
  { category: 'Leadership', current: 250000, reduced: 175000 },
  { category: 'Soft Skills', current: 180000, reduced: 126000 },
  { category: 'Other', current: 100000, reduced: 70000 },
];

const impactedPrograms = [
  { program: 'Advanced Data Analytics', priority: 'High', impact: 'Moderate', employees: 87 },
  { program: 'Cloud Computing Basics', priority: 'Medium', impact: 'Significant', employees: 124 },
  { program: 'Agile Project Management', priority: 'High', impact: 'Minimal', employees: 156 },
  { program: 'Leadership for Managers', priority: 'Medium', impact: 'Moderate', employees: 63 },
  { program: 'Technical Writing', priority: 'Low', impact: 'Significant', employees: 42 },
  { program: 'Cybersecurity Fundamentals', priority: 'High', impact: 'Moderate', employees: 98 },
];

const riskOutcome = [
  { outcome: 'Reduced Training Quality', risk: 76 },
  { outcome: 'Slower Skill Acquisition', risk: 82 },
  { outcome: 'Lower Completion Rates', risk: 68 },
  { outcome: 'Decreased Job Readiness', risk: 73 },
  { outcome: 'Higher Turnover', risk: 64 },
];

const successRateProjection = [
  { month: 'Current', success: 73 },
  { month: 'Month 1', success: 71 },
  { month: 'Month 2', success: 68 },
  { month: 'Month 3', success: 65 },
  { month: 'Month 4', success: 63 },
  { month: 'Month 5', success: 62 },
  { month: 'Month 6', success: 62 },
];

const BudgetCut = () => {
  // Calculate budget reduction stats
  const totalCurrentBudget = currentVsReducedBudget.reduce((sum, item) => sum + item.current, 0);
  const totalReducedBudget = currentVsReducedBudget.reduce((sum, item) => sum + item.reduced, 0);
  const totalReduction = totalCurrentBudget - totalReducedBudget;
  const reductionPercentage = Math.round((totalReduction / totalCurrentBudget) * 100);
  const totalImpactedEmployees = impactedPrograms.reduce((sum, item) => sum + item.employees, 0);

  // Format for chart
  const budgetComparisonData = currentVsReducedBudget.map(item => ({
    category: item.category,
    Current: item.current / 1000,
    Reduced: item.reduced / 1000
  }));

  return (
    <DashboardLayout 
      title="Budget Cut Analysis" 
      subtitle="Impact assessment of a 30% budget reduction"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Budget Reduction" 
          value={`£${(totalReduction / 1000000).toFixed(1)}M`}
          icon={<ArrowDown size={24} className="text-dashboard-danger" />}
          change={-reductionPercentage}
          description={`From £${(totalCurrentBudget / 1000000).toFixed(1)}M to £${(totalReducedBudget / 1000000).toFixed(1)}M`}
        />
        <StatCard 
          title="Impacted Programs" 
          value="18" 
          icon={<AlertTriangle size={24} className="text-dashboard-warning" />}
          description="Programs requiring modification"
        />
        <StatCard 
          title="Affected Employees" 
          value={totalImpactedEmployees.toLocaleString()} 
          icon={<Users size={24} className="text-dashboard-primary" />}
          description="Currently enrolled in programs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Current vs. Reduced Budget by Category (£000s)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <BarChart 
              data={budgetComparisonData}
              title=""
              dataKey="Current"
              nameKey="category"
              color="#1E88E5"
              height={350}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Most Impacted Training Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Budget Impact</TableHead>
                  <TableHead>Employees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactedPrograms.map((program, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{program.program}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.priority === 'High' ? 'bg-green-100 text-green-800' : 
                        program.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.impact === 'Minimal' ? 'bg-green-100 text-green-800' : 
                        program.impact === 'Moderate' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.impact}
                      </span>
                    </TableCell>
                    <TableCell>{program.employees}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          title="Risk Assessment of Budget Cut Outcomes" 
          data={riskOutcome}
          dataKey="risk"
          nameKey="outcome"
          color="#F44336"
        />
        
        <LineChart 
          title="Projected Success Rate After Budget Cut" 
          data={successRateProjection}
          lines={[{dataKey: "success", color: "#FF9800", name: "Success Rate"}]}
          xAxisDataKey="month"
        />
      </div>
    </DashboardLayout>
  );
};

export default BudgetCut;
