
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  description?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  description,
  className = '',
}) => {
  return (
    <Card className={`h-full ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-dashboard-muted mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-dashboard-text">{value}</h3>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                {change > 0 ? (
                  <ArrowUp size={16} className="text-dashboard-accent mr-1" />
                ) : (
                  <ArrowDown size={16} className="text-dashboard-danger mr-1" />
                )}
                <span className={`text-sm font-medium ${change > 0 ? 'text-dashboard-accent' : 'text-dashboard-danger'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-dashboard-muted mt-2">{description}</p>
            )}
          </div>
          
          {icon && (
            <div className="bg-dashboard-primary bg-opacity-10 p-3 rounded-full">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
