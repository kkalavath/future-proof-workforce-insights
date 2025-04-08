
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
import { createClient } from '@/lib/supabase-client';

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
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('automation_risk_roles')
    .select('*')
    .order('risk', { ascending: false })
    .limit(10);
  
  if (error) {
    throw new Error(`Error fetching top risk roles: ${error.message}`);
  }
  
  return data || [];
};

// Function to fetch risk distribution data from Supabase
const fetchRiskDistribution = async (): Promise<RiskDistribution[]> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('risk_distribution')
    .select('*');
  
  if (error) {
    throw new Error(`Error fetching risk distribution: ${error.message}`);
  }
  
  return data || [];
};

// Function to fetch department risk data from Supabase
const fetchDepartmentRisk = async (): Promise<DepartmentRisk[]> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('department_risk')
    .select('*');
  
  if (error) {
    throw new Error(`Error fetching department risk: ${error.message}`);
  }
  
  return data || [];
};

// Function to fetch high-risk stats
const fetchHighRiskStats = async (): Promise<{ 
  highRiskRolesCount: number,
  highRiskEmployeesCount: number,
  averageRiskScore: number
}> => {
  const supabase = createClient();
  
  // Get high risk roles count
  const { data: highRiskRoles, error: rolesError } = await supabase
    .from('automation_risk_roles')
    .select('count')
    .gte('risk', 0.75);
  
  if (rolesError) {
    throw new Error(`Error fetching high risk roles: ${rolesError.message}`);
  }
  
  // Get employees in high risk roles count
  const { data: employeeCountData, error: employeeError } = await supabase
    .from('automation_risk_roles')
    .select('count')
    .gte('risk', 0.75);
  
  if (employeeError) {
    throw new Error(`Error fetching high risk employees: ${employeeError.message}`);
  }
  
  // Get average risk score
  const { data: avgRiskData, error: avgRiskError } = await supabase
    .from('automation_risk_roles')
    .select('risk');
  
  if (avgRiskError) {
    throw new Error(`Error fetching average risk: ${avgRiskError.message}`);
  }
  
  // Calculate high risk roles count
  const highRiskRolesCount = highRiskRoles?.length || 0;
  
  // Calculate employees in high risk roles
  const highRiskEmployeesCount = employeeCountData ? 
    employeeCountData.reduce((sum, role) => sum + (role.count || 0), 0) : 0;
  
  // Calculate average risk score
  const avgRiskScore = avgRiskData && avgRiskData.length > 0 ? 
    avgRiskData.reduce((sum, role) => sum + (role.risk || 0), 0) / avgRiskData.length : 0;
  
  return {
    highRiskRolesCount,
    highRiskEmployeesCount,
    averageRiskScore: Math.round(avgRiskScore * 100)
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
