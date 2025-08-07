import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Mail, 
  User, 
  Calendar,
  Filter,
  Download,
  Send,
  Bell,
  Zap,
  BarChart3,
  Eye,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { allMockAssets } from '@shared/mock-assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface BreachAlert {
  id: string;
  assetId: string;
  severity: 'Critical' | 'High' | 'Medium';
  breachAge: number;
  estimatedValue: number;
  riskLevel: 'Extreme' | 'High' | 'Medium' | 'Low';
  lastAction: string;
  escalationLevel: number;
  managerNotified: boolean;
  securityNotified: boolean;
}

// Priority levels for breach categorization
const PRIORITY_LEVELS = {
  'Extreme': { color: 'bg-red-600 text-white', icon: AlertTriangle },
  'High': { color: 'bg-orange-500 text-white', icon: AlertCircle },
  'Medium': { color: 'bg-yellow-500 text-white', icon: Clock },
  'Low': { color: 'bg-blue-500 text-white', icon: CheckCircle }
};

// Generate breach alerts from mock data
const generateBreachAlerts = (): BreachAlert[] => {
  return allMockAssets
    .filter(asset => asset.sla_stage === 'Breach')
    .map(asset => ({
      id: `breach-${asset.id}`,
      assetId: asset.id,
      severity: asset.priority as 'Critical' | 'High' | 'Medium',
      breachAge: asset.recovery_age - 30, // Days since SLA breach
      estimatedValue: Math.floor(Math.random() * 5000) + 1000,
      riskLevel: asset.recovery_age > 60 ? 'Extreme' : 
                 asset.recovery_age > 45 ? 'High' : 
                 asset.recovery_age > 35 ? 'Medium' : 'Low',
      lastAction: Math.random() > 0.5 ? 'Email Sent' : 'Manager Escalated',
      escalationLevel: Math.floor(asset.recovery_age / 15),
      managerNotified: asset.recovery_age > 40,
      securityNotified: asset.recovery_age > 50
    }));
};

// Historical breach trends (mock data)
const breachTrends = [
  { month: 'Oct', breaches: 12, resolved: 8, pending: 4 },
  { month: 'Nov', breaches: 18, resolved: 14, pending: 4 },
  { month: 'Dec', breaches: 15, resolved: 11, pending: 4 },
  { month: 'Jan', breaches: 22, resolved: 16, pending: 6 },
  { month: 'Feb', breaches: 19, resolved: 13, pending: 6 },
  { month: 'Mar', breaches: 25, resolved: 17, pending: 8 },
];

function BreachAlertCard({ 
  alert, 
  asset 
}: { 
  alert: BreachAlert; 
  asset: typeof allMockAssets[0];
}) {
  const priorityConfig = PRIORITY_LEVELS[alert.riskLevel];
  const Icon = priorityConfig.icon;

  return (
    <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-lg">{asset.asset_tag}</CardTitle>
              <p className="text-sm text-gray-600">{asset.user_name} • {asset.location}</p>
            </div>
          </div>
          <Badge className={priorityConfig.color}>
            {alert.riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Breach Age:</span>
            <p className="font-semibold text-red-600">{alert.breachAge} days</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Asset Value:</span>
            <p className="font-semibold">${alert.estimatedValue.toLocaleString()}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Escalation Level:</span>
            <p className="font-semibold">{alert.escalationLevel}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Last Action:</span>
            <p className="text-sm">{alert.lastAction}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div className={`flex items-center ${alert.managerNotified ? 'text-green-600' : 'text-gray-400'}`}>
            <User className="mr-1 h-3 w-3" />
            Manager {alert.managerNotified ? 'Notified' : 'Pending'}
          </div>
          <div className={`flex items-center ${alert.securityNotified ? 'text-green-600' : 'text-gray-400'}`}>
            <AlertTriangle className="mr-1 h-3 w-3" />
            Security {alert.securityNotified ? 'Alerted' : 'Pending'}
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Send Alert
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="mr-2 h-4 w-4" />
            Call User
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Breach Details - {asset.asset_tag}</DialogTitle>
              </DialogHeader>
              <BreachDetailView alert={alert} asset={asset} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function BreachDetailView({ 
  alert, 
  asset 
}: { 
  alert: BreachAlert; 
  asset: typeof allMockAssets[0];
}) {
  const escalationHistory = [
    { date: '2024-03-01', action: 'Initial SLA breach detected', level: 'System' },
    { date: '2024-03-03', action: 'Automated email reminder sent', level: 'System' },
    { date: '2024-03-08', action: 'Manager notification sent', level: 'Escalation' },
    { date: '2024-03-15', action: 'Security team alerted', level: 'Critical' },
    { date: '2024-03-20', action: 'HR escalation initiated', level: 'Critical' },
  ];

  return (
    <div className="space-y-6">
      {/* Asset Information */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Asset Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Asset Tag:</strong> {asset.asset_tag}</div>
            <div><strong>Serial Number:</strong> {asset.serial_number}</div>
            <div><strong>Type:</strong> {asset.asset_type}</div>
            <div><strong>Value:</strong> ${alert.estimatedValue.toLocaleString()}</div>
            <div><strong>Location:</strong> {asset.location}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Breach Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Breach Age:</strong> {alert.breachAge} days</div>
            <div><strong>Risk Level:</strong> 
              <Badge className={`ml-2 ${PRIORITY_LEVELS[alert.riskLevel].color}`}>
                {alert.riskLevel}
              </Badge>
            </div>
            <div><strong>SLA Due Date:</strong> {asset.sla_due_date}</div>
            <div><strong>Recovery Age:</strong> {asset.recovery_age} days</div>
            <div><strong>Escalation Level:</strong> {alert.escalationLevel}</div>
          </CardContent>
        </Card>
      </div>

      {/* Escalation History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Escalation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalationHistory.map((event, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  event.level === 'Critical' ? 'bg-red-500' :
                  event.level === 'Escalation' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.action}</p>
                  <p className="text-xs text-gray-500">{event.date}</p>
                </div>
                <Badge variant="outline" className="text-xs">{event.level}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button className="flex-1 bg-recovery-accent hover:bg-recovery-accent/90">
          <Send className="mr-2 h-4 w-4" />
          Send Urgent Notice
        </Button>
        <Button variant="outline" className="flex-1">
          <Phone className="mr-2 h-4 w-4" />
          Initiate Call
        </Button>
        <Button variant="outline" className="flex-1">
          <Zap className="mr-2 h-4 w-4" />
          Escalate to Legal
        </Button>
      </div>
    </div>
  );
}

function BreachTrendsChart() {
  const maxValue = Math.max(...breachTrends.map(d => Math.max(d.breaches, d.resolved, d.pending)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          6-Month Breach Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {breachTrends.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                {/* Resolved bar */}
                <div
                  className="w-8 bg-green-500 rounded-t transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.resolved / maxValue) * 120}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                {/* Pending bar */}
                <div
                  className="w-8 bg-orange-500 transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.pending / maxValue) * 80}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                {/* New breaches bar */}
                <div
                  className="w-8 bg-red-500 rounded-b transition-all duration-1000 ease-out"
                  style={{
                    height: `${((data.breaches - data.resolved) / maxValue) * 60}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{data.month}</span>
              <span className="text-xs text-gray-500">{data.breaches}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Resolved</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-sm text-gray-600">New Breaches</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SeverityDistribution({ alerts }: { alerts: BreachAlert[] }) {
  const distribution = alerts.reduce((acc, alert) => {
    acc[alert.riskLevel] = (acc[alert.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Risk Level Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(PRIORITY_LEVELS).map(([level, config]) => {
            const count = distribution[level] || 0;
            const percentage = alerts.length > 0 ? Math.round((count / alerts.length) * 100) : 0;
            return (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded ${config.color} mr-3`} />
                  <span className="font-medium">{level} Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{percentage}%</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function SlaBreaches() {
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  
  const breachAlerts = generateBreachAlerts();
  const breachAssets = allMockAssets.filter(asset => 
    breachAlerts.some(alert => alert.assetId === asset.id)
  );

  const filteredAlerts = useMemo(() => {
    return breachAlerts.filter(alert => {
      const matchesRisk = filterRisk === 'all' || alert.riskLevel === filterRisk;
      const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
      return matchesRisk && matchesSeverity;
    });
  }, [breachAlerts, filterRisk, filterSeverity]);

  const filteredAssets = breachAssets.filter(asset =>
    filteredAlerts.some(alert => alert.assetId === asset.id)
  );

  const exportBreachReport = () => {
    const reportData = filteredAlerts.map(alert => {
      const asset = breachAssets.find(a => a.id === alert.assetId);
      return {
        asset_tag: asset?.asset_tag,
        user_name: asset?.user_name,
        breach_age: alert.breachAge,
        risk_level: alert.riskLevel,
        estimated_value: alert.estimatedValue,
        escalation_level: alert.escalationLevel,
        manager_notified: alert.managerNotified ? 'Yes' : 'No',
        security_notified: alert.securityNotified ? 'Yes' : 'No',
        location: asset?.location
      };
    });

    const headers = Object.keys(reportData[0] || {}).join(',');
    const csvContent = [
      headers,
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sla-breach-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const totalValue = filteredAlerts.reduce((sum, alert) => sum + alert.estimatedValue, 0);
  const criticalBreaches = filteredAlerts.filter(alert => alert.riskLevel === 'Extreme' || alert.riskLevel === 'High').length;
  const avgBreachAge = filteredAlerts.length > 0 
    ? Math.round(filteredAlerts.reduce((sum, alert) => sum + alert.breachAge, 0) / filteredAlerts.length)
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="mr-3 h-8 w-8 text-red-600" />
              SLA Breaches
            </h1>
            <p className="text-gray-600">Monitor and manage assets that have exceeded their recovery SLA thresholds</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportBreachReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Bell className="mr-2 h-4 w-4" />
              Send All Alerts
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Breaches</p>
                <p className="text-3xl font-bold text-red-600">{filteredAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical/High Risk</p>
                <p className="text-3xl font-bold text-orange-600">{criticalBreaches}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Breach Age</p>
                <p className="text-3xl font-bold text-blue-600">{avgBreachAge}</p>
                <p className="text-sm text-gray-500">days</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value at Risk</p>
                <p className="text-3xl font-bold text-green-600">${(totalValue / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Breaches</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="escalation">Escalation Workflows</TabsTrigger>
          <TabsTrigger value="reports">Automated Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="Extreme">Extreme Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
                
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>

                <div className="flex-1" />
                
                <Badge variant="outline">
                  {filteredAlerts.length} breach{filteredAlerts.length !== 1 ? 'es' : ''} found
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Breach Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAlerts.map((alert) => {
              const asset = filteredAssets.find(a => a.id === alert.assetId);
              return asset ? (
                <BreachAlertCard key={alert.id} alert={alert} asset={asset} />
              ) : null;
            })}
          </div>

          {filteredAlerts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No SLA Breaches Found</h3>
                <p className="text-gray-600">All assets are within their SLA thresholds for the selected filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BreachTrendsChart />
            <SeverityDistribution alerts={breachAlerts} />
          </div>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Escalation Workflow Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-blue-500" />
                    Level 1: Email Alerts
                  </h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Immediate notification to user</li>
                    <li>• Manager CC'd on reminder</li>
                    <li>• Daily digest to IT team</li>
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-orange-500" />
                    Level 2: Manager Escalation
                  </h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Direct manager notification</li>
                    <li>• Phone call attempted</li>
                    <li>• HR involvement triggered</li>
                  </ul>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                    Level 3: Security Alert
                  </h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Security team activated</li>
                    <li>• Asset access disabled</li>
                    <li>• Legal team consulted</li>
                  </ul>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automated Breach Reporting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Daily Reports</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Morning Breach Summary</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Critical Alert Digest</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Weekly Reports</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Executive Summary</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span>Department Breakdown</span>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
