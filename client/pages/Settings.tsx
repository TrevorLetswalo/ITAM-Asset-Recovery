import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Mail, 
  Shield, 
  Users, 
  Clock,
  Save,
  RefreshCw,
  Key,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Clean Container Component
interface CleanContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function CleanContainer({ children, className = "", style = {} }: CleanContainerProps) {
  return (
    <div
      className={`clean-card ${className}`}
      style={{
        ...style
      }}
    >
      {children}
    </div>
  );
}

function GeneralSettings() {
  const [settings, setSettings] = useState({
    organizationName: 'IT Asset Management',
    timezone: 'UTC-05:00 (Eastern Time)',
    language: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    autoRefresh: true,
    defaultView: 'Dashboard'
  });

  return (
    <div className="space-y-6">
      <CleanContainer>
        <h3 className="text-lg font-medium text-oxford-blue mb-4">Organization Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-hippie-blue mb-2">Organization Name</label>
            <input
              type="text"
              value={settings.organizationName}
              onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
              className="w-full px-4 py-2 bg-white text-oxford-blue border border-cornflower focus:ring-2 focus:ring-hippie-blue focus:border-transparent rounded-lg transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-hippie-blue mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 bg-white text-oxford-blue border border-cornflower focus:ring-2 focus:ring-hippie-blue focus:border-transparent rounded-lg transition-all duration-300"
              >
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time)</option>
                <option value="UTC-06:00 (Central Time)">UTC-06:00 (Central Time)</option>
                <option value="UTC-07:00 (Mountain Time)">UTC-07:00 (Mountain Time)</option>
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-hippie-blue mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="w-full px-4 py-2 bg-white text-oxford-blue border border-cornflower focus:ring-2 focus:ring-hippie-blue focus:border-transparent rounded-lg transition-all duration-300"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </div>
        </div>
      </CleanContainer>

      <CleanContainer>
        <h3 className="text-lg font-medium text-oxford-blue mb-4">Display Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-oxford-blue">Auto-refresh Dashboard</label>
              <p className="text-xs text-hippie-blue">Automatically refresh data every 5 minutes</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoRefresh: !settings.autoRefresh })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoRefresh ? 'bg-hippie-blue' : 'bg-white/30'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
                style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
              />
            </button>
          </div>
        </div>
      </CleanContainer>
    </div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    browserNotifications: true,
    slaBreach: true,
    escalationAlerts: true,
    weeklyReports: true
  });

  return (
    <div className="space-y-6">
      <CleanContainer>
        <h3 className="text-lg font-medium text-oxford-blue mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive email notifications for important events' },
            { key: 'smsAlerts', label: 'SMS Alerts', description: 'Receive text messages for critical alerts' },
            { key: 'browserNotifications', label: 'Browser Notifications', description: 'Show desktop notifications' },
            { key: 'slaBreach', label: 'SLA Breach Alerts', description: 'Immediate alerts when SLAs are breached' },
            { key: 'escalationAlerts', label: 'Escalation Notifications', description: 'Alerts when cases are escalated' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-oxford-blue">{item.label}</label>
                <p className="text-xs text-hippie-blue">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-hippie-blue' : 'bg-white/30'
                }`}
                style={{
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                  style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </CleanContainer>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <CleanContainer>
        <h3 className="text-lg font-medium text-oxford-blue mb-4">Authentication & Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-hippie-blue" />
              <div>
                <p className="text-sm font-medium text-oxford-blue">Two-Factor Authentication</p>
                <p className="text-xs text-hippie-blue">Add an extra layer of security</p>
              </div>
            </div>
            <Badge className="bg-green-100/50 text-green-700 border-green-200/50">Enabled</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-hippie-blue" />
              <div>
                <p className="text-sm font-medium text-[#1D1D2C]">API Access</p>
                <p className="text-xs text-[#2C8780]">Manage API keys and permissions</p>
              </div>
            </div>
            <Button size="sm" onClick={handleManageKeys} className="macos-button text-[#2C8780]">
              Manage Keys
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-[#2C8780]" />
              <div>
                <p className="text-sm font-medium text-[#1D1D2C]">User Permissions</p>
                <p className="text-xs text-[#2C8780]">Configure role-based access control</p>
              </div>
            </div>
            <Button size="sm" onClick={handleManageRoles} className="macos-button text-[#2C8780]">
              Manage Roles
            </Button>
          </div>
        </div>
      </CleanContainer>
    </div>
  );
}

export function Settings() {
  const handleResetToDefaults = () => {
    const confirmed = confirm('⚠️ Reset all settings to default values?\n\nThis action cannot be undone.');
    if (confirmed) {
      alert('✅ Settings reset to default values successfully!');
    }
  };

  const handleSaveChanges = () => {
    alert('✅ Settings saved successfully!\n\nAll configuration changes have been applied.');
  };

  const handleManageKeys = () => {
    alert('🔑 API Key Management\n\nThis would open the API key management interface with the following features:\n\n• View existing API keys\n• Generate new keys\n• Revoke access\n• Set permissions');
  };

  const handleManageRoles = () => {
    alert('👥 User Role Management\n\nThis would open the role-based access control interface with:\n\n• Create/edit user roles\n• Assign permissions\n• Manage access levels\n• View role assignments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">Settings</h1>
          <p className="text-[#2C8780]">Configure your IT Asset Recovery Console preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleResetToDefaults} className="macos-button text-[#1D1D2C]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveChanges} className="bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white hover:scale-105 transition-all duration-300" style={{
            boxShadow: '0 4px 12px rgba(44, 135, 128, 0.3)'
          }}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <CleanContainer className="p-0">
          <TabsList className="w-full p-1 grid grid-cols-3" style={{
            background: 'transparent',
            border: 'none'
          }}>
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-white/30 data-[state=active]:text-[#1D1D2C] text-[#2C8780] rounded-xl transition-all duration-300"
              style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-white/30 data-[state=active]:text-[#1D1D2C] text-[#2C8780] rounded-xl transition-all duration-300"
              style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-white/30 data-[state=active]:text-[#1D1D2C] text-[#2C8780] rounded-xl transition-all duration-300"
              style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>
        </CleanContainer>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
