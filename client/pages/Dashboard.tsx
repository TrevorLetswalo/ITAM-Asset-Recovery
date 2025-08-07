import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { getDashboardStats, getRecoveryByType, getSlaComplianceRate, allMockAssets } from '@shared/mock-assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
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

  return <span>{count}</span>;
}

// KPI Card component
interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  colorClass?: string;
}

function KpiCard({ title, value, icon: Icon, trend, trendValue, colorClass = "text-recovery-accent" }: KpiCardProps) {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          <AnimatedCounter value={value} />
        </div>
        {trend && trendValue && (
          <div className="flex items-center text-sm">
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
              {trendValue}
            </span>
            <span className="text-gray-500 ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Simple Bar Chart Component
function RecoveryTypeChart() {
  const data = getRecoveryByType();
  const maxValue = Math.max(data.exit, data.swap, data.loaner);

  const chartData = [
    { name: 'Exit', value: data.exit, color: 'bg-recovery-accent' },
    { name: 'Swap', value: data.swap, color: 'bg-recovery-soft' },
    { name: 'Loaner', value: data.loaner, color: 'bg-recovery-secondary' },
  ];

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Assets by Recovery Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-20 text-sm font-medium text-gray-600">
                {item.name}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="w-8 text-sm font-semibold text-gray-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Progress Over Time Chart (Mock line chart with visual representation)
function ProgressChart() {
  // Mock data for last 7 days
  const progressData = [
    { day: 'Mon', recovered: 8, pending: 42 },
    { day: 'Tue', recovered: 12, pending: 38 },
    { day: 'Wed', recovered: 15, pending: 35 },
    { day: 'Thu', recovered: 18, pending: 32 },
    { day: 'Fri', recovered: 22, pending: 28 },
    { day: 'Sat', recovered: 25, pending: 25 },
    { day: 'Sun', recovered: 28, pending: 22 },
  ];

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recovery Progress (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {progressData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                {/* Recovered bar */}
                <div
                  className="w-8 bg-recovery-accent rounded-t transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.recovered / 30) * 100}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                {/* Pending bar */}
                <div
                  className="w-8 bg-recovery-secondary rounded-b transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.pending / 50) * 80}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-recovery-accent rounded mr-2" />
            <span className="text-sm text-gray-600">Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-recovery-secondary rounded mr-2" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
function RecentActivity() {
  const recentAssets = allMockAssets
    .filter(asset => asset.recovery_age <= 7)
    .sort((a, b) => a.recovery_age - b.recovery_age)
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Breach':
        return 'text-red-600 bg-red-100';
      case 'Escalated':
        return 'text-orange-600 bg-orange-100';
      case 'In Progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="mr-2 h-5 w-5 text-recovery-accent" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAssets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{asset.asset_tag}</div>
                <div className="text-sm text-gray-600">{asset.user_name} • {asset.asset_type}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
                <span className="text-sm text-gray-500">{asset.recovery_age}d</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const stats = getDashboardStats();
  const slaCompliance = getSlaComplianceRate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">IT Asset Recovery Dashboard</h1>
        <p className="text-gray-600">Monitor and manage asset recovery operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Assets Pending"
          value={stats.totalPending}
          icon={FileText}
          trend="down"
          trendValue="5.2%"
          colorClass="text-blue-600"
        />
        <KpiCard
          title="SLA Breach Count"
          value={stats.slaBreaches}
          icon={AlertTriangle}
          trend="up"
          trendValue="12.4%"
          colorClass="text-red-600"
        />
        <KpiCard
          title="Recovered This Month"
          value={stats.recoveredThisMonth}
          icon={CheckCircle}
          trend="up"
          trendValue="8.1%"
          colorClass="text-green-600"
        />
        <KpiCard
          title="Open Exit Tickets"
          value={stats.openExitTickets}
          icon={TrendingUp}
          trend="down"
          trendValue="3.6%"
          colorClass="text-orange-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecoveryTypeChart />
        <ProgressChart />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">SLA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-recovery-accent mb-2">
                <AnimatedCounter value={slaCompliance} />%
              </div>
              <p className="text-gray-600 mb-4">Overall compliance rate</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-recovery-accent h-2 rounded-full transition-all duration-2000 ease-out"
                  style={{ width: `${slaCompliance}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
