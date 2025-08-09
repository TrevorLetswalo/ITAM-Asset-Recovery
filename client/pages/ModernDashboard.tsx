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

// Glass Card Component for Charts
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}

// Clean Modern Glassmorphism KPI Card
interface CompactKpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  colorClass?: string;
}

function CompactKpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  colorClass = "text-recovery-accent"
}: CompactKpiCardProps) {
  const getIconColor = () => {
    if (colorClass.includes('blue')) return 'text-blue-600';
    if (colorClass.includes('red')) return 'text-red-600';
    if (colorClass.includes('green')) return 'text-green-600';
    return 'text-[#2C8780]';
  };

  const getSeaColor = () => {
    if (colorClass.includes('blue')) return '#85D1DB'; // Ocean blue
    if (colorClass.includes('red')) return '#FF6F61'; // Coral
    if (colorClass.includes('green')) return '#4CA1A3'; // Soft teal
    return '#4CA1A3'; // Default soft teal
  };

  return (
    <div className="seaside-kpi-card h-32 group relative overflow-hidden cursor-pointer">
      {/* Ocean Wave Top Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${getSeaColor()}, #85D1DB, ${getSeaColor()})`,
          boxShadow: '0 1px 2px rgba(5, 68, 94, 0.2)'
        }}
      ></div>

      {/* Trend Indicator Only */}
      <div className="flex justify-end mb-3 mt-2">
        {trend && trendValue && (
          <div className={`seaside-status flex items-center space-x-1 px-1.5 py-1 md:px-2 rounded-lg text-xs font-semibold transition-all duration-300 group-hover:scale-105 ${
            trend === 'up'
              ? 'seaside-status-coral'
              : 'seaside-status-coral'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">{trendValue}</span>
          </div>
        )}
      </div>

      {/* Clear Information Display */}
      <div>
        <p className="text-xs md:text-sm font-medium mb-1 truncate" style={{
          color: '#4A6A7B', // Muted teal-gray
          textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)'
        }}>{title}</p>
        <p className="text-xl md:text-2xl font-bold tracking-tight" style={{
          color: '#05445E', // Soft navy
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
        }}>
          <AnimatedCounter value={value} />
        </p>
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
    <GlassCard className="chart-container">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-[#2C8780]" />
            Recovery Progress
          </h3>
          <div className="text-xs text-[#2C8780] border border-white/30 bg-white/20 backdrop-blur-lg px-2 py-1 rounded-lg">
            Last 7 Days
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-end justify-between space-x-3 mb-4" style={{ minHeight: '180px' }}>
          {progressData.map((data, index) => (
            <div key={data.day} className="flex flex-col items-center flex-1 group">
              <div className="w-full flex flex-col items-center space-y-1 mb-3">
                {/* Recovered bar with seaside colors */}
                <div
                  className="w-7 rounded-t-xl transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(to top, #4CA1A3, #85D1DB)',
                    height: `${(data.recovered / maxValue) * 100}px`,
                    animationDelay: `${index * 150}ms`,
                    boxShadow: '0 4px 12px rgba(76, 161, 163, 0.3)',
                  }}
                />
                {/* Pending bar with seaside colors */}
                <div
                  className="w-7 rounded-b-xl transition-all duration-1000 ease-out hover:scale-105"
                  style={{
                    background: 'linear-gradient(to top, #F0E4D7, #EAF4F4)',
                    height: `${(data.pending / maxValue) * 60}px`,
                    animationDelay: `${index * 150}ms`,
                    boxShadow: '0 4px 12px rgba(240, 228, 215, 0.3)',
                  }}
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-medium" style={{ color: '#05445E' }}>{data.day}</span>
                <span className="block text-xs" style={{ color: '#4CA1A3' }}>{data.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 pt-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#4CA1A3] to-[#85D1DB] rounded-full mr-2" style={{
              boxShadow: '0 2px 8px rgba(76, 161, 163, 0.3)'
            }} />
            <span className="text-sm font-medium" style={{ color: '#05445E' }}>Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#F0E4D7] to-[#EAF4F4] rounded-full mr-2" style={{
              boxShadow: '0 2px 8px rgba(240, 228, 215, 0.3)'
            }} />
            <span className="text-sm font-medium" style={{ color: '#05445E' }}>Pending</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// Clean Asset Type Chart
function AssetTypeChart() {
  const data = getRecoveryByType();
  const total = data.exit + data.swap + data.loaner;

  const chartData = [
    { name: 'Exit', value: data.exit, color: 'from-[#2C8780] to-[#2C8780]', percentage: Math.round((data.exit / total) * 100) },
    { name: 'Swap', value: data.swap, color: 'from-[#72F1DC] to-[#72F1DC]', percentage: Math.round((data.swap / total) * 100) },
    { name: 'Loaner', value: data.loaner, color: 'from-[#1D1D2C] to-[#4A4A5A]', percentage: Math.round((data.loaner / total) * 100) },
  ];

  return (
    <GlassCard className="chart-container">
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
                  <span className="text-xs text-[#2C8780] bg-white/50 backdrop-blur-lg px-2 py-1 rounded-full border border-white/30">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/30 backdrop-blur-lg rounded-full h-4 overflow-hidden border border-white/20" style={{
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
              }}>
                <div
                  className={`h-4 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out group-hover:scale-x-105 transform-gpu`}
                  style={{
                    width: `${item.percentage}%`,
                    animationDelay: `${index * 200}ms`,
                    boxShadow: '0 2px 6px rgba(44, 135, 128, 0.3)'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// Enhanced SLA Compliance Donut Chart
function SlaComplianceDonut() {
  const compliance = getSlaComplianceRate();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (compliance / 100) * circumference;

  return (
    <VibrantCard variant="green" style={{ minHeight: '400px', height: '400px' }}>
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
                style={{ filter: 'drop-shadow(0 0 6px rgba(44, 135, 128, 0.3))' }}
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

          <div className="text-center bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/30" style={{
            boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}>
            <p className="text-sm text-[#1D1D2C] font-medium">
              {allMockAssets.filter(a => a.sla_stage !== 'Breach').length} of {allMockAssets.length} assets on track
            </p>
            <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" style={{
                  boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)'
                }} />
                <span className="text-[#1D1D2C]">On Track</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" style={{
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
                }} />
                <span className="text-[#1D1D2C]">Breach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VibrantCard>
  );
}

export function ModernDashboard() {
  const stats = getDashboardStats();
  const slaCompliance = getSlaComplianceRate();

  const handleDateRangeChange = () => {
    const options = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year'];
    const selectedOption = prompt(`Select date range:\n\n${options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}\n\nEnter number (1-4):`);

    if (selectedOption && selectedOption >= '1' && selectedOption <= '4') {
      const selected = options[parseInt(selectedOption) - 1];
      alert(`📅 Date range changed to: ${selected}\n\nDashboard data would be refreshed with the new time period.`);
    }
  };

  const handleRefreshDashboard = () => {
    alert('🔄 Refreshing dashboard data...\n\nThis would fetch the latest metrics from the backend and update all KPI cards and charts.');
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex justify-end items-center">
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleDateRangeChange} className="macos-button">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshDashboard} className="macos-button">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Clean Modern KPI Cards with Glassmorphism - Always 4 in a row */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        <CompactKpiCard
          title="Total Assets Pending"
          value={stats.totalPending}
          icon={FileText}
          trend="down"
          trendValue="5.2%"
          colorClass="text-blue-600"
        />
        <CompactKpiCard
          title="SLA Breach Count"
          value={stats.slaBreaches}
          icon={AlertTriangle}
          trend="up"
          trendValue="12.4%"
          colorClass="text-red-600"
        />
        <CompactKpiCard
          title="Recovered This Month"
          value={stats.recoveredThisMonth}
          icon={CheckCircle}
          trend="up"
          trendValue="8.1%"
          colorClass="text-green-600"
        />
        <CompactKpiCard
          title="Open Exit Tickets"
          value={stats.openExitTickets}
          icon={Activity}
          trend="down"
          trendValue="3.6%"
          colorClass="text-recovery-accent"
        />
      </div>

      {/* 2-Column Charts Layout with enhanced 3D effects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetTypeChart />
        <RecoveryProgressChart />
      </div>

      {/* Recent Activity and SLA Compliance Row - Fixed alignment and sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clean Recent Activity Section */}
        <GlassCard className="flex flex-col h-[420px]">
          <div className="flex-shrink-0 pb-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
              <Clock className="mr-2 h-5 w-5 text-[#2C8780]" />
              Recent Activity
            </h3>
          </div>
          <div className="flex-1 overflow-hidden pt-2">
            <div className="h-full overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-white/20 bg-white/10 backdrop-blur-lg">
                    <th className="text-left py-2 text-xs font-medium text-[#2C8780]">Asset</th>
                    <th className="text-left py-2 text-xs font-medium text-[#2C8780]">User</th>
                    <th className="text-left py-2 text-xs font-medium text-[#2C8780]">Status</th>
                    <th className="text-left py-2 text-xs font-medium text-[#2C8780]">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {allMockAssets.slice(0, 6).map((asset, index) => (
                    <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2.5">
                        <div>
                          <p className="text-sm font-medium text-[#1D1D2C] truncate">{asset.asset_tag}</p>
                          <p className="text-xs text-[#2C8780] truncate">{asset.asset_type}</p>
                        </div>
                      </td>
                      <td className="py-2.5 text-sm text-[#1D1D2C] truncate max-w-[80px]">{asset.user_name}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-lg border ${
                          asset.status === 'Completed' ? 'bg-green-100/50 text-green-700 border-green-200/30' :
                          asset.sla_stage === 'Breach' ? 'bg-red-100/50 text-red-700 border-red-200/30' :
                          'bg-blue-100/50 text-blue-700 border-blue-200/30'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-sm text-[#1D1D2C]">{asset.recovery_age}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>

        {/* SLA Compliance Card - Clean layout */}
        <GlassCard className="flex flex-col h-[420px]">
          <div className="flex-shrink-0 pb-4 border-b border-white/10">
            <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-[#2C8780]" />
              SLA Compliance
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center pt-4">
            {/* Main donut chart - centered */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative w-32 h-32 mb-3">
                <svg className="w-32 h-32 transform -rotate-90 drop-shadow-lg" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 - (slaCompliance / 100) * 2 * Math.PI * 40}
                    strokeLinecap="round"
                    className="transition-all duration-2000 ease-out drop-shadow-sm"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(44, 135, 128, 0.4))' }}
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
                    <span className="text-2xl font-light text-[#1D1D2C]">
                      <AnimatedCounter value={slaCompliance} suffix="%" />
                    </span>
                    <p className="text-xs text-[#2C8780] font-medium">Compliant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance stats - properly spaced */}
            <div className="w-full space-y-3 px-2">
              <div className="bg-white/50 backdrop-blur-lg rounded-xl p-3 border border-white/30" style={{
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}>
                <p className="text-xs text-[#1D1D2C] font-medium text-center mb-2">
                  {allMockAssets.filter(a => a.sla_stage !== 'Breach').length} of {allMockAssets.length} assets on track
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5" style={{
                      boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)'
                    }} />
                    <span className="text-[#1D1D2C] font-medium">On Track</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5" style={{
                      boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
                    }} />
                    <span className="text-[#1D1D2C] font-medium">Breach</span>
                  </div>
                </div>
              </div>

              {/* Additional SLA metrics - compact */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/30 backdrop-blur-lg rounded-lg p-2.5 border border-white/20 text-center">
                  <div className="text-base font-light text-[#1D1D2C]">
                    {Math.round((allMockAssets.filter(a => a.recovery_age <= 14).length / allMockAssets.length) * 100)}%
                  </div>
                  <div className="text-xs text-[#2C8780]">≤ 14 Days</div>
                </div>
                <div className="bg-white/30 backdrop-blur-lg rounded-lg p-2.5 border border-white/20 text-center">
                  <div className="text-base font-light text-[#1D1D2C]">
                    {allMockAssets.filter(a => a.sla_stage === 'Breach').length}
                  </div>
                  <div className="text-xs text-[#2C8780]">In Breach</div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
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
