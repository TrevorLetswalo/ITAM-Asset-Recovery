import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle, 
  FileText,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  BarChart3,
  PieChart,
  Zap,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { getDashboardStats, getRecoveryByType, getSlaComplianceRate, allMockAssets } from '@shared/mock-assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Enhanced Animated counter component
function AnimatedCounter({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}: { 
  value: number; 
  duration?: number; 
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{prefix}{count}{suffix}</span>;
}

// Modern Compact KPI Card component with Sparkline
interface CompactKpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  colorClass?: string;
  description?: string;
  sparklineData?: number[];
  statusTag?: string;
}

function CompactKpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  colorClass = "text-recovery-accent",
  description,
  sparklineData = [20, 25, 18, 30, 28, 35, 32],
  statusTag
}: CompactKpiCardProps) {
  const getIconBg = () => {
    if (colorClass.includes('blue')) return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600';
    if (colorClass.includes('red')) return 'bg-gradient-to-br from-red-50 to-red-100 text-red-600';
    if (colorClass.includes('green')) return 'bg-gradient-to-br from-green-50 to-green-100 text-green-600';
    return 'bg-gradient-to-br from-recovery-accent/10 to-recovery-accent/20 text-recovery-accent';
  };

  return (
    <Card className="compact-kpi group relative overflow-hidden">
      <CardContent className="p-6">
        {/* Header with Icon and Trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-soft",
            getIconBg()
          )}>
            <Icon className="h-6 w-6" />
          </div>

          {trend && trendValue && (
            <div className={cn(
              "flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-soft",
              trend === 'up'
                ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200'
                : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Title and Value */}
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold font-poppins text-gray-900 tracking-tight">
            <AnimatedCounter value={value} />
          </p>
        </div>

        {/* Sparkline and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {sparklineData && sparklineData.length > 1 && (
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                <Sparkline data={sparklineData} trend={trend} />
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>

          {statusTag && (
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-medium",
              statusTag === 'Improving' ? 'bg-green-100 text-green-700' :
              statusTag === 'In Breach' ? 'bg-red-100 text-red-700' :
              statusTag === 'Stable' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            )}>
              {statusTag}
            </div>
          )}
        </div>

        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <Icon className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Recovery Progress Chart (7 days)
function RecoveryProgressChart() {
  const progressData = [
    { day: 'Mon', recovered: 8, pending: 42, date: 'Mar 18' },
    { day: 'Tue', recovered: 12, pending: 38, date: 'Mar 19' },
    { day: 'Wed', recovered: 15, pending: 35, date: 'Mar 20' },
    { day: 'Thu', recovered: 18, pending: 32, date: 'Mar 21' },
    { day: 'Fri', recovered: 22, pending: 28, date: 'Mar 22' },
    { day: 'Sat', recovered: 25, pending: 25, date: 'Mar 23' },
    { day: 'Sun', recovered: 28, pending: 22, date: 'Mar 24' },
  ];

  const maxValue = Math.max(...progressData.map(d => d.recovered + d.pending));

  return (
    <Card className="glass-card shadow-medium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-poppins font-semibold text-gray-900 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-recovery-accent" />
            Recovery Progress
          </CardTitle>
          <Badge variant="outline" className="text-xs">Last 7 Days</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end justify-between space-x-3">
          {progressData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center space-y-1 mb-3">
                {/* Recovered bar */}
                <div
                  className="w-8 bg-gradient-to-t from-recovery-accent to-recovery-highlight rounded-t-lg transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-medium"
                  style={{
                    height: `${(data.recovered / maxValue) * 120}px`,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
                {/* Pending bar */}
                <div
                  className="w-8 bg-gradient-to-t from-recovery-secondary to-recovery-secondary/70 rounded-b-lg transition-all duration-1000 ease-out hover:scale-105"
                  style={{
                    height: `${(data.pending / maxValue) * 80}px`,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-600 font-medium">{data.day}</span>
                <span className="block text-xs text-gray-400">{data.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-recovery-accent to-recovery-highlight rounded mr-2" />
            <span className="text-sm text-gray-600 font-medium">Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-recovery-secondary rounded mr-2" />
            <span className="text-sm text-gray-600 font-medium">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Horizontal Bar Chart for Asset Types
function AssetTypeChart() {
  const data = getRecoveryByType();
  const total = data.exit + data.swap + data.loaner;

  const chartData = [
    { name: 'Exit', value: data.exit, color: 'bg-gradient-to-r from-recovery-accent to-recovery-highlight', percentage: Math.round((data.exit / total) * 100) },
    { name: 'Swap', value: data.swap, color: 'bg-gradient-to-r from-blue-500 to-blue-400', percentage: Math.round((data.swap / total) * 100) },
    { name: 'Loaner', value: data.loaner, color: 'bg-gradient-to-r from-recovery-secondary to-recovery-secondary/80', percentage: Math.round((data.loaner / total) * 100) },
  ];

  return (
    <Card className="glass-card shadow-medium">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-poppins font-semibold text-gray-900 flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-recovery-accent" />
          Assets by Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {chartData.map((item, index) => (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out group-hover:scale-x-105 transform-gpu`}
                  style={{
                    width: `${item.percentage}%`,
                    animationDelay: `${index * 200}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// SLA Compliance Donut Chart
function SlaComplianceDonut() {
  const compliance = getSlaComplianceRate();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (compliance / 100) * circumference;

  return (
    <Card className="glass-card shadow-medium">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-poppins font-semibold text-gray-900 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-recovery-accent" />
          SLA Compliance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-2000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2C8780" />
                  <stop offset="100%" stopColor="#72F1DC" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold font-poppins text-gray-900">
                  <AnimatedCounter value={compliance} suffix="%" />
                </span>
                <p className="text-xs text-gray-500">Compliant</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {allMockAssets.filter(a => a.sla_stage !== 'Breach').length} of {allMockAssets.length} assets on track
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Self-Service Quick Actions
function SelfServiceActions() {
  const quickActions = [
    { title: 'Submit Return', icon: Zap, color: 'bg-green-500', description: 'Report asset return' },
    { title: 'Track Status', icon: Activity, color: 'bg-blue-500', description: 'Check return progress' },
    { title: 'Get Help', icon: Users, color: 'bg-purple-500', description: 'Contact support' },
  ];

  return (
    <Card className="glass-card shadow-medium">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-poppins font-semibold text-gray-900 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-recovery-accent" />
          Self-Service Portal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className="p-4 h-auto flex items-center space-x-3 hover:shadow-medium transition-all duration-200 border-gray-200 hover:border-recovery-accent/30"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white shadow-soft`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function ModernDashboard() {
  const stats = getDashboardStats();
  const slaCompliance = getSlaComplianceRate();

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            IT Asset Recovery Dashboard
          </h1>
          <p className="text-gray-600">Monitor and manage asset recovery operations with real-time insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="shadow-soft">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="shadow-soft">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Compact KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CompactKpiCard
          title="Total Assets Pending"
          value={stats.totalPending}
          icon={FileText}
          trend="down"
          trendValue="5.2%"
          colorClass="text-blue-600"
          description="Assets in recovery process"
        />
        <CompactKpiCard
          title="SLA Breach Count"
          value={stats.slaBreaches}
          icon={AlertTriangle}
          trend="up"
          trendValue="12.4%"
          colorClass="text-red-600"
          description="Critical attention required"
        />
        <CompactKpiCard
          title="Recovered This Month"
          value={stats.recoveredThisMonth}
          icon={CheckCircle}
          trend="up"
          trendValue="8.1%"
          colorClass="text-green-600"
          description="Successfully recovered"
        />
        <CompactKpiCard
          title="Open Exit Tickets"
          value={stats.openExitTickets}
          icon={TrendingUp}
          trend="down"
          trendValue="3.6%"
          colorClass="text-recovery-accent"
          description="Exit process pending"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecoveryProgressChart />
        </div>
        <div className="space-y-6">
          <AssetTypeChart />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SlaComplianceDonut />
        <SelfServiceActions />
        
        {/* Recent Activity Timeline */}
        <Card className="glass-card shadow-medium">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-poppins font-semibold text-gray-900 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-recovery-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allMockAssets.slice(0, 4).map((asset, index) => (
                <div key={asset.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    asset.status === 'Completed' ? 'bg-green-500' :
                    asset.sla_stage === 'Breach' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{asset.asset_tag}</p>
                    <p className="text-xs text-gray-500">{asset.user_name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {asset.recovery_age}d
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
