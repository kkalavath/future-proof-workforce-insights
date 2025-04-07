
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, AlertTriangle, ArrowDown } from 'lucide-react';

// Mock data - to be replaced with Supabase data
const topRiskRoles = [
  { role: 'Administrative Assistant', risk: 0.89, count: 145 },
  { role: 'Data Entry Clerk', risk: 0.92, count: 73 },
  { role: 'Customer Service Rep', risk: 0.76, count: 211 },
  { role: 'Accounting Clerk', risk: 0.85, count: 67 },
  { role: 'Mail Sorter', risk: 0.94, count: 39 },
  { role: 'Bank Teller', risk: 0.91, count: 41 },
  { role: 'File Clerk', risk: 0.95, count: 28 },
  { role: 'Receptionist', risk: 0.83, count: 82 },
  { role: 'Bookkeeper', risk: 0.88, count: 49 },
  { role: 'Courier', risk: 0.86, count: 36 },
];

const riskDistribution = [
  { level: 'Very High Risk (>90%)', count: 183 },
  { level: 'High Risk (75-90%)', count: 467 },
  { level: 'Medium Risk (50-75%)', count: 642 },
  { level: 'Low Risk (25-50%)', count: 518 },
  { level: 'Very Low Risk (<25%)', count: 374 },
];

const departmentRisk = [
  { department: 'Administration', highRiskCount: 231, totalCount: 300 },
  { department: 'Finance', highRiskCount: 178, totalCount: 250 },
  { department: 'Customer Support', highRiskCount: 145, totalCount: 220 },
  { department: 'Operations', highRiskCount: 98, totalCount: 175 },
  { department: 'IT', highRiskCount: 52, totalCount: 280 },
];

const AutomationRisk = () => {
  // Calculate percentage of high risk roles for each department
  const departmentRiskData = departmentRisk.map(dept => ({
    department: dept.department,
    riskPercentage: Math.round((dept.highRiskCount / dept.totalCount) * 100)
  }));

  return (
    <DashboardLayout 
      title="Automation Risk Analysis" 
      subtitle="Identifying roles most vulnerable to automation"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="High Risk Roles Identified" 
          value="650" 
          icon={<AlertTriangle size={24} className="text-dashboard-danger" />}
          description="Roles with >75% automation risk"
        />
        <StatCard 
          title="Employees in High Risk Roles" 
          value="1,287" 
          icon={<Users size={24} className="text-dashboard-warning" />}
          change={12}
          description="Increased 12% from last year"
        />
        <StatCard 
          title="Average Risk Score" 
          value="66%" 
          icon={<Settings size={24} className="text-dashboard-primary" />}
          change={5}
          description="Across all departments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top 10 Roles at Highest Risk of Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Employee Count</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRiskRoles.map((role, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{role.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{(role.risk * 100).toFixed(0)}%</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${role.risk > 0.9 ? 'bg-dashboard-danger' : 'bg-dashboard-warning'}`}
                            style={{ width: `${role.risk * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{role.count}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        index < 3 ? 'bg-red-100 text-red-800' : 
                        index < 6 ? 'bg-orange-100 text-orange-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {index < 3 ? 'Critical' : index < 6 ? 'High' : 'Medium'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PieChart 
          title="Distribution of Automation Risk Across Workforce" 
          data={riskDistribution}
          dataKey="count"
          nameKey="level"
          colors={["#F44336", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3"]}
        />
      </div>

      <div className="mb-6">
        <BarChart 
          title="Percentage of High Risk Roles by Department" 
          data={departmentRiskData}
          dataKey="riskPercentage"
          nameKey="department"
          color="#1E88E5"
          height={350}
        />
      </div>
    </DashboardLayout>
  );
};

export default AutomationRisk;
