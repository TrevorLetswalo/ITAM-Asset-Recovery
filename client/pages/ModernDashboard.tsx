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
  RefreshCw,
  Upload
} from 'lucide-react';
import { getDashboardStats, getRecoveryByType, getSlaComplianceRate, allMockAssets } from '@shared/mock-assets';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/ui/sparkline';
import { SubmitRecoveryRequest } from '@/components/SubmitRecoveryRequest';
import SelfServiceReturnCenter from '@/components/SelfServiceReturnCenter';
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
    return 'bg-gradient-to-br from-[#2C8780]/10 to-[#2C8780]/20 text-[#2C8780]';
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 group relative overflow-hidden hover:shadow-[0_8px_40px_rgba(114,241,220,0.4)] transition-all duration-300" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
      <div>
        {/* Header with Icon and Trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
            getIconBg()
          )} style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}>
            <Icon className="h-6 w-6" />
          </div>

          {trend && trendValue && (
            <div className={cn(
              "flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-lg",
              trend === 'up'
                ? 'bg-green-100/50 text-green-700 border border-green-200/50'
                : 'bg-red-100/50 text-red-700 border border-red-200/50'
            )} style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}>
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
          <p className="text-sm font-medium text-[#2C8780]">{title}</p>
          <p className="text-3xl font-light text-[#1D1D2C] tracking-tight">
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
              <p className="text-xs text-[#2C8780]">{description}</p>
            )}
          </div>

          {statusTag && (
            <div className={cn(
              "px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-lg",
              statusTag === 'Improving' ? 'bg-green-100/50 text-green-700' :
              statusTag === 'In Breach' ? 'bg-red-100/50 text-red-700' :
              statusTag === 'Stable' ? 'bg-blue-100/50 text-blue-700' :
              'bg-gray-100/50 text-gray-700'
            )}>
              {statusTag}
            </div>
          )}
        </div>

        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <Icon className="w-full h-full" />
        </div>
      </div>
    </div>
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
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 hover:shadow-[0_8px_40px_rgba(114,241,220,0.4)] transition-all duration-300" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)', minHeight: '320px', height: '320px'}}>
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-[#2C8780]" />
            Recovery Progress
          </h3>
          <div className="text-xs text-[#2C8780] border border-white/30 bg-white/20 backdrop-blur-lg px-2 py-1 rounded-lg">Last 7 Days</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-between space-x-3 mb-4" style={{ minHeight: '180px' }}>
          {progressData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center space-y-1 mb-3">
                {/* Recovered bar */}
                <div
                  className="w-7 bg-gradient-to-t from-[#2C8780] to-[#72F1DC] rounded-t-xl transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-medium"
                  style={{
                    height: `${(data.recovered / maxValue) * 100}px`,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
                {/* Pending bar */}
                <div
                  className="w-7 bg-gradient-to-t from-[#B2CAC9] to-[#E8F2FD] rounded-b-xl transition-all duration-1000 ease-out hover:scale-105"
                  style={{
                    height: `${(data.pending / maxValue) * 60}px`,
                    animationDelay: `${index * 150}ms`,
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs text-[#1D1D2C] font-medium">{data.day}</span>
                <span className="block text-xs text-[#2C8780]">{data.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 pt-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#2C8780] to-[#72F1DC] rounded-full mr-2" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}} />
            <span className="text-sm text-[#1D1D2C] font-medium">Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#B2CAC9] to-[#E8F2FD] rounded-full mr-2" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}} />
            <span className="text-sm text-[#1D1D2C] font-medium">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Horizontal Bar Chart for Asset Types
function AssetTypeChart() {
  const data = getRecoveryByType();
  const total = data.exit + data.swap + data.loaner;

  const chartData = [
    { name: 'Exit', value: data.exit, color: 'bg-gradient-to-r from-[#2C8780] to-[#2C8780]', percentage: Math.round((data.exit / total) * 100) },
    { name: 'Swap', value: data.swap, color: 'bg-gradient-to-r from-[#72F1DC] to-[#72F1DC]', percentage: Math.round((data.swap / total) * 100) },
    { name: 'Loaner', value: data.loaner, color: 'bg-gradient-to-r from-[#1D1D2C] to-[#4A4A5A]', percentage: Math.round((data.loaner / total) * 100) },
  ];

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 hover:shadow-[0_8px_40px_rgba(114,241,220,0.4)] transition-all duration-300" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)', minHeight: '320px', height: '320px'}}>
      <div className="pb-4">
        <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
          <PieChart className="mr-2 h-5 w-5 text-[#2C8780]" />
          Assets by Type
        </h3>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-6">
          {chartData.map((item, index) => (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#1D1D2C]">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-[#1D1D2C]">{item.value}</span>
                  <span className="text-xs text-[#2C8780] bg-white/50 backdrop-blur-lg px-2 py-1 rounded-full">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/30 backdrop-blur-lg rounded-full h-4 overflow-hidden" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}>
                <div
                  className={`h-4 rounded-full ${item.color} transition-all duration-1000 ease-out group-hover:scale-x-105 transform-gpu`}
                  style={{
                    width: `${item.percentage}%`,
                    animationDelay: `${index * 200}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// SLA Compliance Donut Chart
function SlaComplianceDonut() {
  const compliance = getSlaComplianceRate();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (compliance / 100) * circumference;

  return (
    <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 hover:shadow-[0_8px_40px_rgba(114,241,220,0.4)] transition-all duration-300" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)', minHeight: '320px', height: '320px'}}>
      <div className="pb-4">
        <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-[#2C8780]" />
          SLA Compliance
        </h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-36 h-36 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-white/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-2000 ease-out drop-shadow-sm"
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
                <span className="text-3xl font-light text-[#1D1D2C]">
                  <AnimatedCounter value={compliance} suffix="%" />
                </span>
                <p className="text-xs text-[#2C8780] font-medium">Compliant</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/30" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}>
            <p className="text-sm text-[#1D1D2C] font-medium">
              {allMockAssets.filter(a => a.sla_stage !== 'Breach').length} of {allMockAssets.length} assets on track
            </p>
            <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                <span className="text-[#1D1D2C]">On Track</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                <span className="text-[#1D1D2C]">Breach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export function ModernDashboard() {
  const stats = getDashboardStats();
  const slaCompliance = getSlaComplianceRate();

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">
            IT Asset Recovery Dashboard
          </h1>
          <p className="text-[#2C8780]">Monitor and manage asset recovery operations with real-time insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-lg border border-white/30 text-[#1D1D2C] hover:bg-white/30" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-lg border border-white/30 text-[#1D1D2C] hover:bg-white/30" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
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
          description="Recovery in progress"
          sparklineData={[45, 42, 48, 44, 40, 38, 35]}
          statusTag="Improving"
        />
        <CompactKpiCard
          title="SLA Breach Count"
          value={stats.slaBreaches}
          icon={AlertTriangle}
          trend="up"
          trendValue="12.4%"
          colorClass="text-red-600"
          description="Needs attention"
          sparklineData={[2, 3, 4, 5, 6, 8, 10]}
          statusTag="In Breach"
        />
        <CompactKpiCard
          title="Recovered This Month"
          value={stats.recoveredThisMonth}
          icon={CheckCircle}
          trend="up"
          trendValue="8.1%"
          colorClass="text-green-600"
          description="Successfully returned"
          sparklineData={[10, 12, 15, 18, 22, 25, 28]}
          statusTag="Improving"
        />
        <CompactKpiCard
          title="Open Exit Tickets"
          value={stats.openExitTickets}
          icon={Activity}
          trend="down"
          trendValue="3.6%"
          colorClass="text-recovery-accent"
          description="Exit processing"
          sparklineData={[20, 18, 16, 15, 14, 13, 12]}
          statusTag="Stable"
        />
      </div>

      {/* 2-Column Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetTypeChart />
        <RecoveryProgressChart />
      </div>

      {/* Recent Activity and SLA Compliance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Section */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6 lg:col-span-2 hover:shadow-[0_8px_40px_rgba(114,241,220,0.4)] transition-all duration-300" style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
          <div className="pb-4">
            <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#2C8780]" />
              Recent Activity
            </h3>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 text-sm font-medium text-[#2C8780]">Asset</th>
                    <th className="text-left py-3 text-sm font-medium text-[#2C8780]">User</th>
                    <th className="text-left py-3 text-sm font-medium text-[#2C8780]">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-[#2C8780]">Days</th>
                    <th className="text-left py-3 text-sm font-medium text-[#2C8780]">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {allMockAssets.slice(0, 5).map((asset, index) => (
                    <tr key={asset.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                      <td className="py-3">
                        <div>
                          <p className="text-sm font-medium text-[#1D1D2C]">{asset.asset_tag}</p>
                          <p className="text-xs text-[#2C8780]">{asset.asset_type}</p>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-[#1D1D2C]">{asset.user_name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-lg ${
                          asset.status === 'Completed' ? 'bg-green-100/50 text-green-700' :
                          asset.sla_stage === 'Breach' ? 'bg-red-100/50 text-red-700' :
                          'bg-blue-100/50 text-blue-700'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-[#1D1D2C]">{asset.recovery_age}d</td>
                      <td className="py-3">
                        {asset.recovery_age > 30 ? (
                          <TrendingUp className="h-4 w-4 text-red-400" />
                        ) : asset.recovery_age > 14 ? (
                          <TrendingDown className="h-4 w-4 text-yellow-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SLA Compliance Card */}
        <SlaComplianceDonut />
      </div>

      {/* Self-Service Return Center */}
      <SelfServiceReturnCenter />

      {/* Submit Recovery Request Section */}
      <div className="mt-8">
        <SubmitRecoveryRequest />
      </div>
    </div>
  );
}
