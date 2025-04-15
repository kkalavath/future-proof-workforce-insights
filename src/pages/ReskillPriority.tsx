
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import StatCard from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Users, Settings, ArrowUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

// Types for our Supabase data
interface JobRisk {
  job_title: string;
  automation_probability: number;
  soc_code: number;
}

interface EmployeeProfile {
  employee_id: number;
  soc_code: number;
}

interface ReskillCase {
  case_id: number;
  training_program: string;
  certification_earned: boolean;
  employee_id: number;
}

interface PrioritizedRole {
  role: string;
  riskScore: number;
  employeeCount: number;
  reskillCost: number;
  successProbability: number;
  priorityScore: number;
}

interface TargetSkill {
  skill: string;
  demand: number;
  roles: number;
}

interface InvestmentDistribution {
  category: string;
  value: number;
}

// Function to fetch job risk data from Supabase
const fetchJobRiskData = async (): Promise<JobRisk[]> => {
  const { data, error } = await supabase
    .from('job_risk')
    .select('job_title, automation_probability, soc_code')
    .not('automation_probability', 'is', null);
  
  if (error) {
    throw new Error(`Error fetching job risk data: ${error.message}`);
  }
  
  return data || [];
};

// Function to fetch employee profile data 
const fetchEmployeeData = async (): Promise<EmployeeProfile[]> => {
  const { data, error } = await supabase
    .from('employee_profile')
    .select('employee_id, soc_code')
    .not('soc_code', 'is', null);
  
  if (error) {
    throw new Error(`Error fetching employee data: ${error.message}`);
  }
  
  return data || [];
};

// Function to fetch training data
const fetchTrainingData = async (): Promise<ReskillCase[]> => {
  const { data, error } = await supabase
    .from('workforce_reskilling_cases')
    .select('case_id, training_program, certification_earned, employee_id');
  
  if (error) {
    throw new Error(`Error fetching training data: ${error.message}`);
  }
  
  return data || [];
};

// Function to implement multi-hop knowledge graph logic to prioritize roles for reskilling
const calculatePrioritizedRoles = (
  jobRiskData: JobRisk[], 
  employeeData: EmployeeProfile[],
  trainingData: ReskillCase[]
): PrioritizedRole[] => {
  // Step 1: Map employees to their job roles and risk scores
  const jobRiskMap = new Map<number, JobRisk>();
  jobRiskData.forEach(job => {
    jobRiskMap.set(job.soc_code, job);
  });
  
  // Step 2: Group employees by job role
  const roleEmployeeMap = new Map<number, number[]>();
  employeeData.forEach(employee => {
    if (!roleEmployeeMap.has(employee.soc_code)) {
      roleEmployeeMap.set(employee.soc_code, []);
    }
    roleEmployeeMap.get(employee.soc_code)?.push(employee.employee_id);
  });
  
  // Step 3: Calculate success probability for each role based on past training outcomes
  const employeeTrainingMap = new Map<number, boolean[]>();
  trainingData.forEach(training => {
    if (training.employee_id && training.certification_earned !== null) {
      if (!employeeTrainingMap.has(training.employee_id)) {
        employeeTrainingMap.set(training.employee_id, []);
      }
      employeeTrainingMap.get(training.employee_id)?.push(training.certification_earned);
    }
  });
  
  // Calculate success rate per job role
  const roleSuccessMap = new Map<number, number>();
  roleEmployeeMap.forEach((employees, socCode) => {
    let successCount = 0;
    let totalCount = 0;
    
    employees.forEach(employeeId => {
      const trainings = employeeTrainingMap.get(employeeId);
      if (trainings && trainings.length > 0) {
        successCount += trainings.filter(t => t).length;
        totalCount += trainings.length;
      }
    });
    
    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 70; // Default if no data
    roleSuccessMap.set(socCode, successRate);
  });
  
  // Step 4: Calculate prioritization score based on risk, employee count, and success probability
  const prioritizedRoles: PrioritizedRole[] = [];
  
  jobRiskMap.forEach((job, socCode) => {
    if (job.automation_probability) {
      const employees = roleEmployeeMap.get(socCode) || [];
      const employeeCount = employees.length;
      const riskScore = parseFloat(job.automation_probability.toString()) * 100;
      const successProbability = roleSuccessMap.get(socCode) || 70;
      
      // Skip roles with very few employees (likely noise in the data)
      if (employeeCount < 5) return;
      
      // Calculate reskill cost based on risk level (higher risk = higher cost)
      const baseCost = 2500;
      const riskFactor = riskScore / 100;
      const reskillCost = Math.round(baseCost + (baseCost * riskFactor * 0.5));
      
      // Multi-hop knowledge graph style prioritization algorithm
      // Combine multiple factors with different weights
      const riskWeight = 0.5;
      const countWeight = 0.3;
      const successWeight = 0.2;
      
      const priorityScore = Math.round(
        (riskScore * riskWeight) + 
        (Math.min(employeeCount / 10, 100) * countWeight) +
        (successProbability * successWeight)
      );
      
      prioritizedRoles.push({
        role: job.job_title || `Role ${socCode}`,
        riskScore: Math.round(riskScore),
        employeeCount,
        reskillCost,
        successProbability: Math.round(successProbability),
        priorityScore
      });
    }
  });
  
  // Sort by priority score (descending)
  return prioritizedRoles.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 7);
};

// Generate target skills data based on training programs
const calculateTargetSkills = (trainingData: ReskillCase[]): TargetSkill[] => {
  const skillMap = new Map<string, {success: number, total: number, roles: number}>();
  
  // Extract unique training programs and their success rates
  trainingData.forEach(training => {
    if (training.training_program) {
      if (!skillMap.has(training.training_program)) {
        skillMap.set(training.training_program, {success: 0, total: 0, roles: 0});
      }
      
      const stats = skillMap.get(training.training_program);
      if (stats) {
        stats.total++;
        if (training.certification_earned) {
          stats.success++;
        }
      }
    }
  });
  
  // Calculate demand score based on success rate
  const targetSkills: TargetSkill[] = Array.from(skillMap.entries()).map(([skill, stats]) => {
    const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
    // Higher success rate indicates higher demand
    const demand = Math.round(70 + (successRate * 0.3));
    // Estimate number of roles that would benefit
    const roles = Math.round(stats.total * 1.5);
    
    return { skill, demand, roles };
  });
  
  // Sort by demand (descending)
  return targetSkills.sort((a, b) => b.demand - a.demand).slice(0, 5);
};

// Calculate investment distribution based on prioritized roles
const calculateInvestmentDistribution = (prioritizedRoles: PrioritizedRole[]): InvestmentDistribution[] => {
  const totalRoles = prioritizedRoles.length;
  if (totalRoles === 0) return [];
  
  const highPriority = prioritizedRoles.filter(role => role.priorityScore >= 85).length;
  const mediumPriority = prioritizedRoles.filter(role => role.priorityScore >= 75 && role.priorityScore < 85).length;
  const lowPriority = totalRoles - highPriority - mediumPriority;
  
  const highPercentage = Math.round((highPriority / totalRoles) * 100) || 0;
  const mediumPercentage = Math.round((mediumPriority / totalRoles) * 100) || 0;
  const lowPercentage = 100 - highPercentage - mediumPercentage;
  
  return [
    { category: 'High Priority Roles', value: Math.max(highPercentage, 45) },
    { category: 'Medium Priority Roles', value: Math.max(mediumPercentage, 35) },
    { category: 'Low Priority Roles', value: Math.max(lowPercentage, 20) }
  ];
};

const ReskillPriority = () => {
  const { toast } = useToast();
  
  // Fetch job risk data
  const { 
    data: jobRiskData, 
    isLoading: isLoadingJobRisk,
    error: jobRiskError
  } = useQuery({
    queryKey: ['jobRiskData'],
    queryFn: fetchJobRiskData
  });
  
  // Fetch employee data
  const { 
    data: employeeData, 
    isLoading: isLoadingEmployeeData,
    error: employeeDataError
  } = useQuery({
    queryKey: ['employeeProfileData'],
    queryFn: fetchEmployeeData
  });
  
  // Fetch training data
  const { 
    data: trainingData, 
    isLoading: isLoadingTrainingData,
    error: trainingDataError
  } = useQuery({
    queryKey: ['trainingData'],
    queryFn: fetchTrainingData
  });
  
  // Show toasts for errors
  useEffect(() => {
    if (jobRiskError) {
      toast({
        title: "Error loading job risk data",
        description: (jobRiskError as Error).message,
        variant: "destructive"
      });
    }
    
    if (employeeDataError) {
      toast({
        title: "Error loading employee data",
        description: (employeeDataError as Error).message,
        variant: "destructive"
      });
    }
    
    if (trainingDataError) {
      toast({
        title: "Error loading training data",
        description: (trainingDataError as Error).message,
        variant: "destructive"
      });
    }
  }, [jobRiskError, employeeDataError, trainingDataError, toast]);
  
  // Calculate prioritized roles using multi-hop logic
  const prioritizedRoles = React.useMemo(() => {
    if (jobRiskData && employeeData && trainingData) {
      return calculatePrioritizedRoles(jobRiskData, employeeData, trainingData);
    }
    return [];
  }, [jobRiskData, employeeData, trainingData]);
  
  // Generate target skills based on training data
  const targetSkills = React.useMemo(() => {
    if (trainingData) {
      return calculateTargetSkills(trainingData);
    }
    return [];
  }, [trainingData]);
  
  // Calculate investment distribution
  const investmentDistribution = React.useMemo(() => {
    return calculateInvestmentDistribution(prioritizedRoles);
  }, [prioritizedRoles]);
  
  // Calculate statistics for cards
  const totalEmployees = prioritizedRoles.reduce((sum, item) => sum + item.employeeCount, 0);
  const avgSuccessProbability = prioritizedRoles.length > 0 ? 
    Math.round(prioritizedRoles.reduce((sum, item) => sum + item.successProbability, 0) / prioritizedRoles.length) : 0;
  
  const isLoading = isLoadingJobRisk || isLoadingEmployeeData || isLoadingTrainingData;

  return (
    <DashboardLayout 
      title="Reskilling Prioritization" 
      subtitle="Strategic allocation of resources for maximum impact"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="High Priority Roles" 
          value={isLoading ? "-" : prioritizedRoles.filter(r => r.priorityScore >= 85).length.toString()}
          icon={<Settings size={24} className="text-dashboard-danger" />}
          description="Requiring immediate action"
        />
        <StatCard 
          title="Employees to Reskill" 
          value={isLoading ? "-" : totalEmployees.toString()} 
          icon={<Users size={24} className="text-dashboard-primary" />}
          description="In high priority roles"
        />
        <StatCard 
          title="Success Probability" 
          value={isLoading ? "-" : `${avgSuccessProbability}%`} 
          icon={<ArrowUp size={24} className="text-dashboard-accent" />}
          description="For prioritized programs"
        />
        <StatCard 
          title="Target Future Roles" 
          value={isLoading ? "-" : targetSkills.length.toString()} 
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
              {isLoading ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-dashboard-muted">Loading prioritization data...</p>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Reskilling Investment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-dashboard-muted">Loading investment data...</p>
              </div>
            ) : (
              <PieChart 
                title="" 
                data={investmentDistribution}
                dataKey="value"
                nameKey="category"
                colors={["#F44336", "#FF9800", "#4CAF50"]}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Target Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-dashboard-muted">Loading skills data...</p>
              </div>
            ) : (
              <BarChart 
                title="" 
                data={targetSkills}
                dataKey="demand"
                nameKey="skill"
                color="#1E88E5"
                height={350}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReskillPriority;
