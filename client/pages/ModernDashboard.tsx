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

// Vibrant Pastel Card Component
interface VibrantCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: 'pink' | 'blue' | 'green' | 'orange' | 'purple' | 'default';
}

function VibrantCard({ children, className = "", style = {}, variant = 'default' }: VibrantCardProps) {
  const getVariantStyles = () => {
    const baseStyle = {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      borderTop: '2px solid rgba(255, 255, 255, 0.95)',
      borderLeft: '2px solid rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      boxShadow: '0 25px 80px rgba(99, 102, 241, 0.12), 0 10px 40px rgba(236, 72, 153, 0.08), 0 5px 20px rgba(34, 197, 94, 0.06), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
    };

    const variantStyles = {
      pink: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.15) 0%, rgba(255, 240, 245, 0.8) 100%)',
        borderLeftColor: '#FF6B9D',
        borderLeftWidth: '4px',
        boxShadow: '0 25px 80px rgba(255, 107, 157, 0.15), 0 10px 40px rgba(255, 107, 157, 0.1), 0 5px 20px rgba(255, 107, 157, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
      },
      blue: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(235, 248, 255, 0.8) 100%)',
        borderLeftColor: '#4299E1',
        borderLeftWidth: '4px',
        boxShadow: '0 25px 80px rgba(66, 153, 225, 0.15), 0 10px 40px rgba(66, 153, 225, 0.1), 0 5px 20px rgba(66, 153, 225, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
      },
      green: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.15) 0%, rgba(240, 253, 244, 0.8) 100%)',
        borderLeftColor: '#48BB78',
        borderLeftWidth: '4px',
        boxShadow: '0 25px 80px rgba(72, 187, 120, 0.15), 0 10px 40px rgba(72, 187, 120, 0.1), 0 5px 20px rgba(72, 187, 120, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
      },
      orange: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(246, 173, 85, 0.15) 0%, rgba(255, 250, 240, 0.8) 100%)',
        borderLeftColor: '#F6AD55',
        borderLeftWidth: '4px',
        boxShadow: '0 25px 80px rgba(246, 173, 85, 0.15), 0 10px 40px rgba(246, 173, 85, 0.1), 0 5px 20px rgba(246, 173, 85, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
      },
      purple: {
        ...baseStyle,
        background: 'linear-gradient(135deg, rgba(159, 122, 234, 0.15) 0%, rgba(250, 245, 255, 0.8) 100%)',
        borderLeftColor: '#9F7AEA',
        borderLeftWidth: '4px',
        boxShadow: '0 25px 80px rgba(159, 122, 234, 0.15), 0 10px 40px rgba(159, 122, 234, 0.1), 0 5px 20px rgba(159, 122, 234, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.6)',
      },
      default: baseStyle,
    };

    return variantStyles[variant];
  };

  return (
    <div
      className={`p-8 rounded-2xl transition-all duration-500 ease-out cursor-pointer ${className}`}
      style={{
        ...getVariantStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 35px 100px rgba(99, 102, 241, 0.18), 0 15px 50px rgba(236, 72, 153, 0.12), 0 8px 30px rgba(34, 197, 94, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.7)';
        e.currentTarget.style.border = '2px solid rgba(255, 255, 255, 0.9)';
        e.currentTarget.style.borderTop = '2px solid rgba(255, 255, 255, 1)';
        e.currentTarget.style.borderLeft = '2px solid rgba(255, 255, 255, 1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        const originalStyles = getVariantStyles();
        e.currentTarget.style.boxShadow = originalStyles.boxShadow;
        e.currentTarget.style.border = originalStyles.border;
        e.currentTarget.style.borderTop = originalStyles.borderTop;
        e.currentTarget.style.borderLeft = originalStyles.borderLeft;
      }}
    >
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

  return (
    <div className="glass-card h-32 group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-strong">
      {/* Clean Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor()} bg-white/50 backdrop-blur-sm border border-white/60 shadow-soft transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Minimalist Trend Indicator */}
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trend === 'up'
              ? 'text-green-700 bg-green-50/80'
              : 'text-red-700 bg-red-50/80'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Essential Information Only */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-light text-[#1D1D2C] tracking-tight">
          <AnimatedCounter value={value} />
        </p>
      </div>

      {/* Subtle Glass Border Effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/40 pointer-events-none"></div>

      {/* Minimal Background Pattern */}
      <div className="absolute bottom-2 right-2 opacity-[0.08] pointer-events-none">
        <Icon className="h-8 w-8 text-gray-400" />
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
    <VibrantCard variant="green" style={{ minHeight: '400px', height: '400px' }}>
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
                {/* Recovered bar with enhanced 3D effect */}
                <div
                  className="w-7 rounded-t-xl transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(to top, #2C8780, #72F1DC)',
                    height: `${(data.recovered / maxValue) * 100}px`,
                    animationDelay: `${index * 150}ms`,
                    boxShadow: '0 4px 12px rgba(44, 135, 128, 0.3)',
                  }}
                />
                {/* Pending bar with enhanced 3D effect */}
                <div
                  className="w-7 rounded-b-xl transition-all duration-1000 ease-out hover:scale-105"
                  style={{
                    background: 'linear-gradient(to top, #B2CAC9, #E8F2FD)',
                    height: `${(data.pending / maxValue) * 60}px`,
                    animationDelay: `${index * 150}ms`,
                    boxShadow: '0 4px 12px rgba(178, 202, 201, 0.3)',
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
            <div className="w-3 h-3 bg-gradient-to-r from-[#2C8780] to-[#72F1DC] rounded-full mr-2" style={{
              boxShadow: '0 2px 8px rgba(44, 135, 128, 0.3)'
            }} />
            <span className="text-sm text-[#1D1D2C] font-medium">Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-r from-[#B2CAC9] to-[#E8F2FD] rounded-full mr-2" style={{
              boxShadow: '0 2px 8px rgba(178, 202, 201, 0.3)'
            }} />
            <span className="text-sm text-[#1D1D2C] font-medium">Pending</span>
          </div>
        </div>
      </div>
    </VibrantCard>
  );
}

// Enhanced Asset Type Chart
function AssetTypeChart() {
  const data = getRecoveryByType();
  const total = data.exit + data.swap + data.loaner;

  const chartData = [
    { name: 'Exit', value: data.exit, color: 'from-[#2C8780] to-[#2C8780]', percentage: Math.round((data.exit / total) * 100) },
    { name: 'Swap', value: data.swap, color: 'from-[#72F1DC] to-[#72F1DC]', percentage: Math.round((data.swap / total) * 100) },
    { name: 'Loaner', value: data.loaner, color: 'from-[#1D1D2C] to-[#4A4A5A]', percentage: Math.round((data.loaner / total) * 100) },
  ];

  return (
    <VibrantCard variant="green" style={{ minHeight: '400px', height: '400px' }}>
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
    </VibrantCard>
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
      {/* Enhanced Header without background */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">
            IT Asset Recovery Dashboard
          </h1>
          <p className="text-[#2C8780]">Monitor and manage asset recovery operations with real-time insights</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleDateRangeChange} className="macos-button text-[#1D1D2C]">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefreshDashboard} className="macos-button text-[#1D1D2C]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards with 3D effects - New Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary KPI Row */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Secondary KPI Row */}
        <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* 2-Column Charts Layout with enhanced 3D effects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AssetTypeChart />
        <RecoveryProgressChart />
      </div>

      {/* Recent Activity and SLA Compliance Row - Fixed alignment and sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Recent Activity Section */}
        <VibrantCard variant="purple" className="flex flex-col h-[420px]">
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
        </VibrantCard>

        {/* SLA Compliance Card - Fixed layout */}
        <VibrantCard variant="purple" className="flex flex-col h-[420px]">
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
        </VibrantCard>
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
