import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export function Settings() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Configure system settings and preferences for the Asset Recovery Console"
      icon={SettingsIcon}
      features={[
        'Recovery Email Cadence configuration (3, 7, 10 days)',
        'Auto-Escalation toggle controls',
        'Asset Age Threshold settings',
        'Custom Email Editor with rich text',
        'SLA timeline customization',
        'Notification preferences',
        'User role and permission management',
        'Integration settings'
      ]}
    />
  );
}
