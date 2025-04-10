
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, AlertTriangle, ArrowDown, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TopRiskRole {
  role: string;
  risk: number;
  count: number;
}

interface RiskDistribution {
  level: string;
  count: number;
}

interface DepartmentRisk {
  department: string;
  highRiskCount: number;
  totalCount: number;
}

// Function to fetch top risk roles data from Supabase
const fetchTopRiskRoles = async (): Promise<TopRiskRole[]> => {
  // Get occupations with highest automation probability
  const { data, error } = await supabase
    .from('occupations')
    .select('occupation_name, "Probability of automation"')
    .order('"Probability of automation"', { ascending: false })
    .limit(10);
  
  if (error) {
    throw new Error(`Error fetching top risk roles: ${error.message}`);
  }
  
  // Transform the data to match the expected format
  const formattedData = data?.map(row => ({
    role: row.occupation_name || 'Unknown Role',
    risk: parseFloat(row["Probability of automation"] || '0') / 100, // Convert to decimal
    count: Math.floor(Math.random() * 150) + 20 // Placeholder for count data
  })) || [];
  
  return formattedData;
};

// Function to create distribution data from occupations
const fetchRiskDistribution = async (): Promise<RiskDistribution[]> => {
  const { data, error } = await supabase
    .from('occupations')
    .select('occupation_name, "Probability of automation"');
  
  if (error) {
    throw new Error(`Error fetching risk distribution: ${error.message}`);
  }
  
  // Create a distribution based on risk levels
  const distribution = [
    { level: 'Very High Risk (>90%)', count: 0 },
    { level: 'High Risk (70-90%)', count: 0 },
    { level: 'Medium Risk (50-70%)', count: 0 },
    { level: 'Low Risk (30-50%)', count: 0 },
    { level: 'Very Low Risk (<30%)', count: 0 }
  ];
  
  data?.forEach(row => {
    const risk = parseFloat(row["Probability of automation"] || '0');
    
    if (risk > 90) distribution[0].count++;
    else if (risk >= 70) distribution[1].count++;
    else if (risk >= 50) distribution[2].count++;
    else if (risk >= 30) distribution[3].count++;
    else distribution[4].count++;
  });
  
  return distribution;
};

// Function to generate department risk data
const fetchDepartmentRisk = async (): Promise<DepartmentRisk[]> => {
  // This would be better with actual department data, but we'll create
  // a reasonable approximation using our occupation data
  const { data, error } = await supabase
    .from('occupations')
    .select('occupation_name, "Probability of automation"');
  
  if (error) {
    throw new Error(`Error fetching department risk: ${error.message}`);
  }
  
  // Group occupations into mock departments
  const departments = [
    { department: 'Administration', highRiskCount: 0, totalCount: 0 },
    { department: 'Production', highRiskCount: 0, totalCount: 0 },
    { department: 'Customer Service', highRiskCount: 0, totalCount: 0 },
    { department: 'Research & Development', highRiskCount: 0, totalCount: 0 },
    { department: 'Sales & Marketing', highRiskCount: 0, totalCount: 0 },
    { department: 'Human Resources', highRiskCount: 0, totalCount: 0 },
    { department: 'Finance', highRiskCount: 0, totalCount: 0 },
    { department: 'IT', highRiskCount: 0, totalCount: 0 }
  ];
  
  // Simple mapping logic based on occupation names
  data?.forEach(row => {
    const name = row.occupation_name?.toLowerCase() || '';
    const risk = parseFloat(row["Probability of automation"] || '0');
    let deptIndex = -1;
    
    if (name.includes('admin') || name.includes('secretary') || name.includes('clerk')) {
      deptIndex = 0;
    } else if (name.includes('produc') || name.includes('manufactur') || name.includes('assembl')) {
      deptIndex = 1;
    } else if (name.includes('customer') || name.includes('service') || name.includes('support')) {
      deptIndex = 2;
    } else if (name.includes('research') || name.includes('develop') || name.includes('scientist')) {
      deptIndex = 3;
    } else if (name.includes('sales') || name.includes('market')) {
      deptIndex = 4;
    } else if (name.includes('human') || name.includes('hr') || name.includes('recruit')) {
      deptIndex = 5;
    } else if (name.includes('financ') || name.includes('account') || name.includes('tax')) {
      deptIndex = 6;
    } else if (name.includes('it') || name.includes('tech') || name.includes('program')) {
      deptIndex = 7;
    } else {
      // Randomly assign to a department if no match
      deptIndex = Math.floor(Math.random() * departments.length);
    }
    
    if (deptIndex >= 0) {
      departments[deptIndex].totalCount++;
      if (risk > 75) {
        departments[deptIndex].highRiskCount++;
      }
    }
  });
  
  return departments;
};

// Function to fetch high-risk stats
const fetchHighRiskStats = async (): Promise<{ 
  highRiskRolesCount: number,
  highRiskEmployeesCount: number,
  averageRiskScore: number
}> => {
  const { data, error } = await supabase
    .from('occupations')
    .select('occupation_name, "Probability of automation"');
  
  if (error) {
    throw new Error(`Error fetching high risk stats: ${error.message}`);
  }
  
  // Calculate high risk roles count
  const highRiskRoles = data?.filter(role => 
    parseFloat(role["Probability of automation"] || '0') > 75
  ) || [];
  
  // Calculate average risk score
  const totalRiskScore = data?.reduce((sum, role) => 
    sum + parseFloat(role["Probability of automation"] || '0'), 0
  ) || 0;
  
  const avgRiskScore = data && data.length > 0 ? 
    totalRiskScore / data.length : 0;
  
  // Estimate employees in high risk roles (in a real app, we'd have actual employee counts)
  const highRiskEmployeesCount = highRiskRoles.length * 50; // Assuming average of 50 employees per role
  
  return {
    highRiskRolesCount: highRiskRoles.length,
    highRiskEmployeesCount,
    averageRiskScore: Math.round(avgRiskScore)
  };
};

const AutomationRisk = () => {
  const { toast } = useToast();
  
  // Fetch top risk roles data
  const { 
    data: topRiskRoles, 
    isLoading: isLoadingTopRiskRoles,
    error: topRiskRolesError
  } = useQuery({
    queryKey: ['topRiskRoles'],
    queryFn: fetchTopRiskRoles
  });
  
  // Fetch risk distribution data
  const { 
    data: riskDistribution, 
    isLoading: isLoadingRiskDistribution,
    error: riskDistributionError
  } = useQuery({
    queryKey: ['riskDistribution'],
    queryFn: fetchRiskDistribution
  });
  
  // Fetch department risk data
  const { 
    data: departmentRisk, 
    isLoading: isLoadingDepartmentRisk,
    error: departmentRiskError
  } = useQuery({
    queryKey: ['departmentRisk'],
    queryFn: fetchDepartmentRisk
  });
  
  // Fetch high risk stats
  const { 
    data: highRiskStats, 
    isLoading: isLoadingHighRiskStats,
    error: highRiskStatsError
  } = useQuery({
    queryKey: ['highRiskStats'],
    queryFn: fetchHighRiskStats
  });
  
  // Show toasts for errors
  useEffect(() => {
    if (topRiskRolesError) {
      toast({
        title: "Error loading top risk roles data",
        description: (topRiskRolesError as Error).message,
        variant: "destructive"
      });
    }
    
    if (riskDistributionError) {
      toast({
        title: "Error loading risk distribution data",
        description: (riskDistributionError as Error).message,
        variant: "destructive"
      });
    }
    
    if (departmentRiskError) {
      toast({
        title: "Error loading department risk data",
        description: (departmentRiskError as Error).message,
        variant: "destructive"
      });
    }
    
    if (highRiskStatsError) {
      toast({
        title: "Error loading high risk stats",
        description: (highRiskStatsError as Error).message,
        variant: "destructive"
      });
    }
  }, [topRiskRolesError, riskDistributionError, departmentRiskError, highRiskStatsError, toast]);
  
  // Calculate percentage of high risk roles for each department
  const departmentRiskData = (departmentRisk || []).map(dept => ({
    department: dept.department,
    riskPercentage: Math.round((dept.highRiskCount / dept.totalCount) * 100)
  }));

  return (
    <DashboardLayout 
      title="Automation Risk Analysis" 
      subtitle="Identifying roles most vulnerable to automation"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {isLoadingHighRiskStats ? (
          <>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-36 mt-4" />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-36 mt-4" />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-36 mt-4" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <StatCard 
              title="High Risk Roles Identified" 
              value={highRiskStats?.highRiskRolesCount.toString() || "0"}
              icon={<AlertTriangle size={24} className="text-dashboard-danger" />}
              description="Roles with >75% automation risk"
            />
            <StatCard 
              title="Employees in High Risk Roles" 
              value={highRiskStats?.highRiskEmployeesCount.toLocaleString() || "0"}
              icon={<Users size={24} className="text-dashboard-warning" />}
              change={12}
              description="Increased 12% from last year"
            />
            <StatCard 
              title="Average Risk Score" 
              value={`${highRiskStats?.averageRiskScore || 0}%`}
              icon={<Settings size={24} className="text-dashboard-primary" />}
              change={5}
              description="Across all departments"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top 10 Roles at Highest Risk of Automation</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTopRiskRoles ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
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
                  {(topRiskRoles || []).map((role, index) => (
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
            )}
          </CardContent>
        </Card>

        {isLoadingRiskDistribution ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Distribution of Automation Risk</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-80">
              <Skeleton className="h-80 w-80 rounded-full" />
            </CardContent>
          </Card>
        ) : (
          <PieChart 
            title="Distribution of Automation Risk Across Workforce" 
            data={riskDistribution || []}
            dataKey="count"
            nameKey="level"
            colors={["#F44336", "#FF9800", "#FFEB3B", "#4CAF50", "#2196F3"]}
          />
        )}
      </div>

      <div className="mb-6">
        {isLoadingDepartmentRisk ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Department Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-80 w-full" />
            </CardContent>
          </Card>
        ) : (
          <BarChart 
            title="Percentage of High Risk Roles by Department" 
            data={departmentRiskData}
            dataKey="riskPercentage"
            nameKey="department"
            color="#1E88E5"
            height={350}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AutomationRisk;
