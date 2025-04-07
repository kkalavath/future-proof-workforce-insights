
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Users, Settings, ArrowUp } from 'lucide-react';

// Mock data - to be replaced with Supabase data
const prioritizedRoles = [
  { 
    role: 'Administrative Assistant', 
    riskScore: 89, 
    employeeCount: 145, 
    reskillCost: 3200, 
    successProbability: 76,
    priorityScore: 92 
  },
  { 
    role: 'Data Entry Clerk', 
    riskScore: 92, 
    employeeCount: 73, 
    reskillCost: 2800, 
    successProbability: 82,
    priorityScore: 88 
  },
  { 
    role: 'Customer Service Rep', 
    riskScore: 76, 
    employeeCount: 211, 
    reskillCost: 3500, 
    successProbability: 79,
    priorityScore: 85 
  },
  { 
    role: 'Accounting Clerk', 
    riskScore: 85, 
    employeeCount: 67, 
    reskillCost: 4100, 
    successProbability: 73,
    priorityScore: 81 
  },
  { 
    role: 'Mail Sorter', 
    riskScore: 94, 
    employeeCount: 39, 
    reskillCost: 2200, 
    successProbability: 85,
    priorityScore: 78 
  },
  { 
    role: 'Bank Teller', 
    riskScore: 91, 
    employeeCount: 41, 
    reskillCost: 3800, 
    successProbability: 77,
    priorityScore: 76 
  },
  { 
    role: 'File Clerk', 
    riskScore: 95, 
    employeeCount: 28, 
    reskillCost: 2500, 
    successProbability: 80,
    priorityScore: 74 
  },
];

const targetSkills = [
  { skill: 'Data Analysis', demand: 87, roles: 156 },
  { skill: 'Digital Literacy', demand: 92, roles: 278 },
  { skill: 'Programming', demand: 78, roles: 124 },
  { skill: 'Project Management', demand: 81, roles: 189 },
  { skill: 'UX Design', demand: 73, roles: 67 },
];

const investmentDistribution = [
  { category: 'High Priority Roles', value: 45 },
  { category: 'Medium Priority Roles', value: 35 },
  { category: 'Low Priority Roles', value: 20 },
];

const ReskillPriority = () => {
  // Calculate prioritization stats
  const totalEmployees = prioritizedRoles.reduce((sum, item) => sum + item.employeeCount, 0);
  const avgSuccessProbability = Math.round(
    prioritizedRoles.reduce((sum, item) => sum + item.successProbability, 0) / prioritizedRoles.length
  );
  
  // Get high priority skills
  const topTargetSkills = [...targetSkills].sort((a, b) => b.demand - a.demand);

  return (
    <DashboardLayout 
      title="Reskilling Prioritization" 
      subtitle="Strategic allocation of resources for maximum impact"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="High Priority Roles" 
          value="7" 
          icon={<Settings size={24} className="text-dashboard-danger" />}
          description="Requiring immediate action"
        />
        <StatCard 
          title="Employees to Reskill" 
          value={totalEmployees} 
          icon={<Users size={24} className="text-dashboard-primary" />}
          description="In high priority roles"
        />
        <StatCard 
          title="Success Probability" 
          value={`${avgSuccessProbability}%`} 
          icon={<ArrowUp size={24} className="text-dashboard-accent" />}
          description="For prioritized programs"
        />
        <StatCard 
          title="Target Future Roles" 
          value="12" 
          icon={<Briefcase size={24} className="text-dashboard-secondary" />}
          description="High growth potential"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader>
              <CardTitle>Prioritized Roles for Reskilling</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Success Prob.</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prioritizedRoles.map((role, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell>{role.riskScore}%</TableCell>
                      <TableCell>{role.employeeCount}</TableCell>
                      <TableCell>£{role.reskillCost}</TableCell>
                      <TableCell>{role.successProbability}%</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                role.priorityScore >= 85 ? 'bg-red-500' : 
                                role.priorityScore >= 75 ? 'bg-orange-500' : 
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${role.priorityScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2">{role.priorityScore}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <PieChart 
          title="Reskilling Investment Distribution" 
          data={investmentDistribution}
          dataKey="value"
          nameKey="category"
          colors={["#F44336", "#FF9800", "#4CAF50"]}
        />
      </div>

      <div className="mb-6">
        <BarChart 
          title="Target Skills in Demand" 
          data={topTargetSkills}
          dataKey="demand"
          nameKey="skill"
          color="#1E88E5"
          height={350}
        />
      </div>
    </DashboardLayout>
  );
};

export default ReskillPriority;
