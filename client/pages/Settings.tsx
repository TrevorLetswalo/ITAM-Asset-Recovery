import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Mail, 
  Clock, 
  AlertTriangle,
  Users,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SettingsState {
  emailCadence: {
    initial: number;
    followUp: number;
    escalation: number;
    finalWarning: number;
  };
  autoEscalation: {
    enabled: boolean;
    thresholdDays: number;
    skipWeekends: boolean;
  };
  assetThresholds: {
    highValue: number;
    criticalAge: number;
    riskAlertAge: number;
  };
  notifications: {
    emailNotifications: boolean;
    slackIntegration: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
    weeklyReport: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    ipWhitelist: string[];
    auditLogging: boolean;
  };
  integrations: {
    activeDirectory: boolean;
    serviceNow: boolean;
    jira: boolean;
    slack: boolean;
  };
  system: {
    timezone: string;
    dateFormat: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

function SettingsSection({ 
  title, 
  description, 
  icon: Icon, 
  children 
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-recovery-accent" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}

function FormField({ 
  label, 
  description, 
  children 
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    emailCadence: {
      initial: 0,
      followUp: 7,
      escalation: 14,
      finalWarning: 21
    },
    autoEscalation: {
      enabled: true,
      thresholdDays: 30,
      skipWeekends: true
    },
    assetThresholds: {
      highValue: 2500,
      criticalAge: 45,
      riskAlertAge: 60
    },
    notifications: {
      emailNotifications: true,
      slackIntegration: false,
      pushNotifications: true,
      dailyDigest: true,
      weeklyReport: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 480,
      ipWhitelist: [],
      auditLogging: true
    },
    integrations: {
      activeDirectory: true,
      serviceNow: false,
      jira: false,
      slack: true
    },
    system: {
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      language: 'en-US',
      theme: 'light'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (section: keyof SettingsState, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    // Add success notification here
  };

  const resetSettings = () => {
    // Reset to defaults or reload from server
    setHasChanges(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure system settings and preferences for the Asset Recovery Console</p>
          </div>
          <div className="flex space-x-3">
            {hasChanges && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                Unsaved Changes
              </Badge>
            )}
            <Button variant="outline" onClick={resetSettings}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button 
              onClick={saveSettings}
              disabled={!hasChanges}
              className="bg-recovery-accent hover:bg-recovery-accent/90"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="recovery" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="recovery" className="space-y-6">
          {/* Email Cadence Settings */}
          <SettingsSection
            title="Recovery Email Cadence"
            description="Configure the timing intervals for automated recovery emails"
            icon={Mail}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField 
                label="Initial Email"
                description="Days after asset becomes recoverable"
              >
                <input
                  type="number"
                  value={settings.emailCadence.initial}
                  onChange={(e) => updateSetting('emailCadence', 'initial', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="0"
                  max="30"
                />
              </FormField>
              
              <FormField 
                label="Follow-Up Email"
                description="Days after initial email"
              >
                <input
                  type="number"
                  value={settings.emailCadence.followUp}
                  onChange={(e) => updateSetting('emailCadence', 'followUp', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="1"
                  max="30"
                />
              </FormField>
              
              <FormField 
                label="Escalation Email"
                description="Days after follow-up email"
              >
                <input
                  type="number"
                  value={settings.emailCadence.escalation}
                  onChange={(e) => updateSetting('emailCadence', 'escalation', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="1"
                  max="60"
                />
              </FormField>
              
              <FormField 
                label="Final Warning"
                description="Days after escalation email"
              >
                <input
                  type="number"
                  value={settings.emailCadence.finalWarning}
                  onChange={(e) => updateSetting('emailCadence', 'finalWarning', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="1"
                  max="90"
                />
              </FormField>
            </div>
          </SettingsSection>

          {/* Auto-Escalation Settings */}
          <SettingsSection
            title="Auto-Escalation Controls"
            description="Configure automatic escalation rules and thresholds"
            icon={AlertTriangle}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormField 
                  label="Enable Auto-Escalation"
                  description="Automatically escalate overdue recoveries"
                >
                  <div></div>
                </FormField>
                <Switch
                  checked={settings.autoEscalation.enabled}
                  onCheckedChange={(checked) => updateSetting('autoEscalation', 'enabled', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Escalation Threshold"
                  description="Days before auto-escalation triggers"
                >
                  <input
                    type="number"
                    value={settings.autoEscalation.thresholdDays}
                    onChange={(e) => updateSetting('autoEscalation', 'thresholdDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                    min="1"
                    max="180"
                    disabled={!settings.autoEscalation.enabled}
                  />
                </FormField>
                
                <FormField 
                  label="Skip Weekends"
                  description="Don't count weekends in escalation timing"
                >
                  <Switch
                    checked={settings.autoEscalation.skipWeekends}
                    onCheckedChange={(checked) => updateSetting('autoEscalation', 'skipWeekends', checked)}
                    disabled={!settings.autoEscalation.enabled}
                  />
                </FormField>
              </div>
            </div>
          </SettingsSection>

          {/* Asset Thresholds */}
          <SettingsSection
            title="Asset Age & Value Thresholds"
            description="Set thresholds for asset categorization and risk alerts"
            icon={Clock}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField 
                label="High-Value Asset Threshold"
                description="Dollar amount to classify as high-value"
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={settings.assetThresholds.highValue}
                    onChange={(e) => updateSetting('assetThresholds', 'highValue', parseInt(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                    min="0"
                  />
                </div>
              </FormField>
              
              <FormField 
                label="Critical Age Threshold"
                description="Days to mark as critical recovery"
              >
                <input
                  type="number"
                  value={settings.assetThresholds.criticalAge}
                  onChange={(e) => updateSetting('assetThresholds', 'criticalAge', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="1"
                  max="365"
                />
              </FormField>
              
              <FormField 
                label="Risk Alert Threshold"
                description="Days to trigger security risk alert"
              >
                <input
                  type="number"
                  value={settings.assetThresholds.riskAlertAge}
                  onChange={(e) => updateSetting('assetThresholds', 'riskAlertAge', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                  min="1"
                  max="365"
                />
              </FormField>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <SettingsSection
            title="Notification Preferences"
            description="Configure how and when you receive notifications"
            icon={Bell}
          >
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <FormField 
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    description={
                      key === 'emailNotifications' ? 'Receive email notifications for important events' :
                      key === 'slackIntegration' ? 'Send notifications to configured Slack channels' :
                      key === 'pushNotifications' ? 'Browser push notifications for urgent alerts' :
                      key === 'dailyDigest' ? 'Daily summary of recovery activities' :
                      'Weekly comprehensive recovery report'
                    }
                  >
                    <div></div>
                  </FormField>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                  />
                </div>
              ))}
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SettingsSection
            title="Security Settings"
            description="Configure security policies and access controls"
            icon={Shield}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <FormField 
                  label="Two-Factor Authentication"
                  description="Require 2FA for all user accounts"
                >
                  <div></div>
                </FormField>
                <Switch
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                />
              </div>
              
              <Separator />
              
              <FormField 
                label="Session Timeout"
                description="Minutes of inactivity before auto-logout"
              >
                <select
                  value={settings.security.sessionTimeout}
                  onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value={60}>1 hour</option>
                  <option value={240}>4 hours</option>
                  <option value={480}>8 hours</option>
                  <option value={720}>12 hours</option>
                  <option value={1440}>24 hours</option>
                </select>
              </FormField>
              
              <div className="flex items-center justify-between">
                <FormField 
                  label="Audit Logging"
                  description="Log all user actions for security auditing"
                >
                  <div></div>
                </FormField>
                <Switch
                  checked={settings.security.auditLogging}
                  onCheckedChange={(checked) => updateSetting('security', 'auditLogging', checked)}
                />
              </div>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <SettingsSection
            title="System Integrations"
            description="Connect with external systems and services"
            icon={Zap}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(settings.integrations).map(([key, value]) => (
                <Card key={key} className={`p-4 ${value ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${value ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {value ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Database className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {value ? 'Connected' : 'Not Connected'}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateSetting('integrations', key, checked)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SettingsSection
            title="System Preferences"
            description="Configure regional and display preferences"
            icon={Globe}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField 
                label="Timezone"
                description="System timezone for all dates and times"
              >
                <select
                  value={settings.system.timezone}
                  onChange={(e) => updateSetting('system', 'timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="America/New_York">Eastern Time (EST/EDT)</option>
                  <option value="America/Chicago">Central Time (CST/CDT)</option>
                  <option value="America/Denver">Mountain Time (MST/MDT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </FormField>
              
              <FormField 
                label="Date Format"
                description="How dates are displayed throughout the system"
              >
                <select
                  value={settings.system.dateFormat}
                  onChange={(e) => updateSetting('system', 'dateFormat', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </FormField>
              
              <FormField 
                label="Language"
                description="System display language"
              >
                <select
                  value={settings.system.language}
                  onChange={(e) => updateSetting('system', 'language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                </select>
              </FormField>
              
              <FormField 
                label="Theme"
                description="Visual appearance preference"
              >
                <select
                  value={settings.system.theme}
                  onChange={(e) => updateSetting('system', 'theme', e.target.value as 'light' | 'dark' | 'auto')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </FormField>
            </div>
          </SettingsSection>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <SettingsSection
            title="User Management"
            description="Manage user roles and permissions"
            icon={Users}
          >
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 mb-6">
                User role and permission management would be implemented here with features like:
              </p>
              <div className="max-w-md mx-auto text-left space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  Role-based access control (Admin, Manager, Analyst)
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  Department-based asset visibility
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  User invitation and onboarding
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  Permission granularity controls
                </div>
              </div>
            </div>
          </SettingsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
