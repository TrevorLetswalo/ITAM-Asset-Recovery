import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export function Reports() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Generate comprehensive reports and analytics for asset recovery operations"
      icon={BarChart3}
      features={[
        'Active Recoveries summary reports',
        'SLA Compliance analytics',
        'Total Assets Collected metrics',
        'CSV/PDF export functionality',
        'Custom date range filtering',
        'Department-wise breakdown',
        'Recovery time analysis',
        'Automated scheduled reports'
      ]}
    />
  );
}
