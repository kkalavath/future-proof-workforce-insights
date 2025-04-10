import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import BarChart from '@/components/charts/BarChart';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import { ChartBar, Users, Briefcase, ArrowDown, Settings } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const trainingCompletionData = [
  { program: 'Digital Skills', completed: 76, target: 85 },
  { program: 'Data Analysis', completed: 64, target: 80 },
  { program: 'Project Management', completed: 82, target: 75 },
  { program: 'Leadership', completed: 89, target: 90 },
  { program: 'Technical Writing', completed: 71, target: 75 },
];

const reskillSuccessData = [
  { month: 'Jan', success: 65 },
  { month: 'Feb', success: 68 },
  { month: 'Mar', success: 72 },
  { month: 'Apr', success: 75 },
  { month: 'May', success: 79 },
  { month: 'Jun', success: 82 },
];

const budgetDistribution = [
  { category: 'Digital Skills', value: 35 },
  { category: 'Technical Training', value: 25 },
  { category: 'Leadership', value: 20 },
  { category: 'Soft Skills', value: 15 },
  { category: 'Other', value: 5 },
];

const Dashboard = () => {
  const [automationRiskData, setAutomationRiskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchAutomationRiskData() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('occupations')
          .select('occupation_name, "Probability of automation"')
          .not('Probability of automation', 'is', null)
          .order('Probability of automation', { ascending: false })
          .limit(5);

        if (error) {
          throw error;
        }

        const formattedData = data.map(item => ({
          role: item.occupation_name,
          risk: parseFloat(item["Probability of automation"])
        }));

        setAutomationRiskData(formattedData);
      } catch (error) {
        console.error('Error fetching automation risk data:', error);
        toast({
          title: "Failed to load automation risk data",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAutomationRiskData();
  }, [toast]);

  return (
    <DashboardLayout 
      title="Workforce Analytics Dashboard" 
      subtitle="Monitor automation risk and reskilling effectiveness"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="High Risk Roles" 
          value="42" 
          icon={<Settings size={24} className="text-dashboard-primary" />}
          change={8}
          description="Roles with >75% automation risk"
        />
        <StatCard 
          title="Training Completion" 
          value="78%" 
          icon={<Users size={24} className="text-dashboard-secondary" />}
          change={5}
          description="Average completion rate"
        />
        <StatCard 
          title="Reskill Success Rate" 
          value="72%" 
          icon={<Briefcase size={24} className="text-dashboard-accent" />}
          change={-3}
          description="Employees meeting criteria"
        />
        <StatCard 
          title="Training Budget" 
          value="£1.3M" 
          icon={<ArrowDown size={24} className="text-dashboard-warning" />}
          change={-12}
          description="10% under last year"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {isLoading ? (
          <div className="bg-white rounded-lg p-6 shadow-sm flex items-center justify-center h-[300px]">
            <p className="text-dashboard-muted">Loading automation risk data...</p>
          </div>
        ) : (
          <BarChart 
            title="Top 5 Roles at Risk of Automation" 
            data={automationRiskData}
            dataKey="risk"
            nameKey="role"
            color="#F44336"
          />
        )}
        <PieChart 
          title="Training Budget Distribution" 
          data={budgetDistribution}
          dataKey="value"
          nameKey="category"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          title="Training Program Completion vs Target" 
          data={trainingCompletionData}
          dataKey="completed"
          nameKey="program"
          color="#1E88E5"
        />
        <LineChart 
          title="Reskilling Success Rate Trend" 
          data={reskillSuccessData}
          lines={[{dataKey: "success", color: "#4CAF50", name: "Success Rate"}]}
          xAxisDataKey="month"
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
