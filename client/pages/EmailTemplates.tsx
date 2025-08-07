import React from 'react';
import { Mail } from 'lucide-react';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export function EmailTemplates() {
  return (
    <PlaceholderPage
      title="Email Templates"
      description="Manage and customize automated email templates for asset recovery communications"
      icon={Mail}
      features={[
        'Initial Email template editor',
        'Follow-Up email customization',
        'Escalation Notice templates',
        'Final Warning email design',
        'Risk Alert email configuration',
        'Template preview and testing',
        'Dynamic variable insertion',
        'Multi-language support'
      ]}
    />
  );
}
