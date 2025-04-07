
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChartBar, Users, Briefcase, ArrowDown, Settings } from 'lucide-react';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Overview Dashboard",
      path: "/",
      icon: ChartBar,
    },
    {
      title: "Automation Risk",
      path: "/automation-risk",
      icon: Settings,
    },
    {
      title: "Training Effectiveness",
      path: "/training-effectiveness",
      icon: Users,
    },
    {
      title: "Reskill Success",
      path: "/reskill-success",
      icon: Briefcase,
    },
    {
      title: "Budget Cut Analysis",
      path: "/budget-cut",
      icon: ArrowDown,
    },
    {
      title: "Reskill Priority",
      path: "/reskill-priority",
      icon: ChartBar,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6">
        <h1 className="text-xl font-bold text-dashboard-primary">Workforce Insights</h1>
        <p className="text-sm text-dashboard-muted">Future-Proof Analytics</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboards</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    className={location.pathname === item.path ? "bg-sidebar-accent" : ""}
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center cursor-pointer">
                      <item.icon className="mr-2" size={18} />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
