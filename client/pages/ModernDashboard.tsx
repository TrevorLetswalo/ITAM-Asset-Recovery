import React, { useEffect, useState } from "react";
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
  Upload,
} from "lucide-react";
import {
  getDashboardStats,
  getRecoveryByType,
  getSlaComplianceRate,
  allMockAssets,
} from "@shared/mock-assets";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { SubmitRecoveryRequest } from "@/components/SubmitRecoveryRequest";
import SelfServiceReturnCenter from "@/components/SelfServiceReturnCenter";
import { cn } from "@/lib/utils";

// Enhanced Animated counter component
function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
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

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// Minimal Card Component for Charts
function MinimalCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`minimal-card ${className}`}>{children}</div>;
}

// Clean Modern Glassmorphism KPI Card
interface CompactKpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
  colorClass?: string;
}

function CompactKpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  colorClass = "text-recovery-accent",
}: CompactKpiCardProps) {
  const getIconColor = () => {
    if (colorClass.includes("blue")) return "text-blue-600";
    if (colorClass.includes("red")) return "text-red-600";
    if (colorClass.includes("green")) return "text-green-600";
    return "text-[#2C8780]";
  };

  const getSeaColor = () => {
    if (colorClass.includes("blue")) return "#85D1DB"; // Ocean blue
    if (colorClass.includes("red")) return "#FF6F61"; // Coral
    if (colorClass.includes("green")) return "#4CA1A3"; // Soft teal
    return "#4CA1A3"; // Default soft teal
  };

  return (
    <div className="minimal-kpi-card h-32 group relative overflow-hidden cursor-pointer">
      {/* Minimal Top Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          backgroundColor: "var(--color-3)", // Shuttle Gray
        }}
      ></div>

      {/* Content Container */}
      <div className="ml-4 mr-2 mt-4 mb-3">
        {/* Title */}
        <p
          className="text-xs md:text-sm font-medium truncate mb-3"
          style={{
            color: "var(--color-3)", // Shuttle Gray
          }}
        >
          {title}
        </p>

        {/* Number and Percentage Row */}
        <div className="flex items-baseline space-x-3">
          <p
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{
              color: "var(--color-1)", // Shark
            }}
          >
            <AnimatedCounter value={value} />
          </p>

          {/* Percentage next to number */}
          {trend && trendValue && (
            <div
              className="flex items-center space-x-1 text-sm font-semibold transition-all duration-300 group-hover:scale-105"
              style={{
                color: "var(--color-2)", // Mako
              }}
            >
              {trend === "up" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Grouped Bar Chart for Recovery Progress
function RecoveryProgressChart() {
  const progressData = [
    { day: "Mon", recovered: 8, pending: 42, date: "Mar 18" },
    { day: "Tue", recovered: 12, pending: 38, date: "Mar 19" },
    { day: "Wed", recovered: 15, pending: 35, date: "Mar 20" },
    { day: "Thu", recovered: 18, pending: 32, date: "Mar 21" },
    { day: "Fri", recovered: 22, pending: 28, date: "Mar 22" },
    { day: "Sat", recovered: 25, pending: 25, date: "Mar 23" },
    { day: "Sun", recovered: 28, pending: 22, date: "Mar 24" },
  ];

  const maxValue = Math.max(
    ...progressData.map((d) => Math.max(d.recovered, d.pending)),
  );

  return (
    <div className="chart-container-compact">
      <div className="pb-2">
        <div className="flex items-center justify-between">
          <h3
            className="text-base font-medium flex items-center"
            style={{ color: "var(--color-1)" }}
          >
            <BarChart3 className="mr-2 h-4 w-4" style={{ color: "var(--color-3)" }} />
            Recovery Progress
          </h3>
          <div
            className="text-xs border px-2 py-1 rounded"
            style={{
              color: "var(--color-2)",
              borderColor: "var(--color-4)",
              backgroundColor: "var(--color-5)"
            }}
          >
            Last 7 Days
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {/* Bar Chart */}
        <div className="relative mb-3" style={{ height: "120px" }}>
          <div className="flex items-end justify-center space-x-1 h-full">
            {progressData.map((data, index) => (
              <div key={data.day} className="flex flex-col items-center group">
                {/* Value labels */}
                <div className="flex space-x-0.5 mb-1 text-xs font-medium">
                  <div
                    className="text-center text-xs"
                    style={{ color: "var(--color-1)" }}
                  >
                    {data.recovered}
                  </div>
                  <div
                    className="text-center text-xs"
                    style={{ color: "var(--color-2)" }}
                  >
                    {data.pending}
                  </div>
                </div>

                {/* Bars */}
                <div className="flex space-x-0.5 items-end">
                  {/* Recovered bar */}
                  <div
                    className="w-3 rounded-t transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--color-3)", // Shuttle Gray
                      height: `${(data.recovered / maxValue) * 80}px`,
                      animationDelay: `${index * 100}ms`,
                      boxShadow: "0 2px 6px rgba(96, 109, 128, 0.3)",
                    }}
                  />
                  {/* Pending bar */}
                  <div
                    className="w-3 rounded-t transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                    style={{
                      backgroundColor: "var(--color-2)", // Mako
                      height: `${(data.pending / maxValue) * 80}px`,
                      animationDelay: `${index * 100 + 50}ms`,
                      boxShadow: "0 2px 6px rgba(63, 71, 80, 0.3)",
                    }}
                  />
                </div>

                {/* Day label */}
                <div
                  className="text-xs text-center mt-1.5 font-medium"
                  style={{ color: "var(--color-3)" }}
                >
                  {data.day}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-4 pt-2 border-t" style={{ borderTopColor: "var(--color-4)" }}>
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: "var(--color-3)" }}
            />
            <span className="text-xs font-medium" style={{ color: "var(--color-1)" }}>
              Recovered
            </span>
          </div>
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: "var(--color-2)" }}
            />
            <span className="text-xs font-medium" style={{ color: "var(--color-1)" }}>
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Clustered Column Chart for Assets by Type
function AssetTypeChart() {
  const data = getRecoveryByType();
  const total = data.exit + data.swap + data.loaner;

  const chartData = [
    {
      name: "Exit",
      value: data.exit,
      color: "#4CA1A3",
      percentage: Math.round((data.exit / total) * 100),
    },
    {
      name: "Swap",
      value: data.swap,
      color: "#85D1DB",
      percentage: Math.round((data.swap / total) * 100),
    },
    {
      name: "Loaner",
      value: data.loaner,
      color: "#FF6F61",
      percentage: Math.round((data.loaner / total) * 100),
    },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="chart-container-compact">
      <div className="pb-2">
        <h3
          className="text-base font-medium flex items-center"
          style={{ color: "#05445E" }}
        >
          <BarChart3 className="mr-2 h-4 w-4" style={{ color: "#4CA1A3" }} />
          Assets by Type
        </h3>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        {/* Column Chart */}
        <div
          className="flex items-end justify-center space-x-4 mb-4"
          style={{ minHeight: "120px" }}
        >
          {chartData.map((item, index) => (
            <div key={item.name} className="flex flex-col items-center group">
              <div className="text-center mb-1">
                <span
                  className="text-sm font-bold"
                  style={{ color: "#05445E" }}
                >
                  {item.value}
                </span>
                <span className="block text-xs" style={{ color: "#4A6A7B" }}>
                  {item.percentage}%
                </span>
              </div>
              <div
                className="w-12 rounded-t-lg transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                style={{
                  backgroundColor: item.color,
                  height: `${(item.value / maxValue) * 80}px`,
                  animationDelay: `${index * 200}ms`,
                  boxShadow: `0 3px 8px ${item.color}40`,
                }}
              />
              <div className="text-center mt-1">
                <span
                  className="text-xs font-medium"
                  style={{ color: "#05445E" }}
                >
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-3 pt-2 border-t border-white/20">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 1px 4px ${item.color}40`,
                }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "#05445E" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced SLA Compliance Donut Chart
function SlaComplianceDonut() {
  const compliance = getSlaComplianceRate();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (compliance / 100) * circumference;

  return (
    <VibrantCard
      variant="green"
      style={{ minHeight: "400px", height: "400px" }}
    >
      <div className="pb-4">
        <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-[#2C8780]" />
          SLA Compliance
        </h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="relative w-36 h-36 mb-4">
            <svg
              className="w-36 h-36 transform -rotate-90 drop-shadow-lg"
              viewBox="0 0 100 100"
            >
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
                style={{
                  filter: "drop-shadow(0 0 6px rgba(44, 135, 128, 0.3))",
                }}
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

          <div
            className="text-center bg-white/50 backdrop-blur-lg rounded-2xl p-4 border border-white/30"
            style={{
              boxShadow:
                "0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <p className="text-sm text-[#1D1D2C] font-medium">
              {allMockAssets.filter((a) => a.sla_stage !== "Breach").length} of{" "}
              {allMockAssets.length} assets on track
            </p>
            <div className="flex items-center justify-center mt-2 space-x-4 text-xs">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full mr-1"
                  style={{
                    boxShadow: "0 0 4px rgba(34, 197, 94, 0.5)",
                  }}
                />
                <span className="text-[#1D1D2C]">On Track</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-2 h-2 bg-red-500 rounded-full mr-1"
                  style={{
                    boxShadow: "0 0 4px rgba(239, 68, 68, 0.5)",
                  }}
                />
                <span className="text-[#1D1D2C]">Breach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VibrantCard>
  );
}

// Compact SLA Compliance Chart
function SlaComplianceChart() {
  const compliance = getSlaComplianceRate();
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (compliance / 100) * circumference;

  return (
    <div className="chart-container-compact">
      <div className="pb-2">
        <h3
          className="text-base font-medium flex items-center"
          style={{ color: "#05445E" }}
        >
          <CheckCircle className="mr-2 h-4 w-4" style={{ color: "#4CA1A3" }} />
          SLA Compliance
        </h3>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Main donut chart */}
        <div className="flex flex-col items-center justify-center mb-2">
          <div className="relative w-20 h-20 mb-1">
            <svg
              className="w-20 h-20 transform -rotate-90 drop-shadow-lg"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#4CA1A3"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-2000 ease-out drop-shadow-sm"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(76, 161, 163, 0.4))",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: "#05445E" }}
                >
                  <AnimatedCounter value={compliance} suffix="%" />
                </span>
                <p className="text-xs font-medium" style={{ color: "#4A6A7B" }}>
                  Compliant
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance stats */}
        <div className="w-full space-y-1">
          <div className="bg-white/50 backdrop-blur-lg rounded-lg p-1.5 border border-white/30">
            <p
              className="text-xs font-medium text-center mb-1"
              style={{ color: "#05445E" }}
            >
              {allMockAssets.filter((a) => a.sla_stage !== "Breach").length}/
              {allMockAssets.length} on track
            </p>
            <div className="flex items-center justify-center space-x-3 text-xs">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                <span style={{ color: "#05445E" }}>Track</span>
              </div>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1" />
                <span style={{ color: "#05445E" }}>Breach</span>
              </div>
            </div>
          </div>

          {/* Additional metrics */}
          <div className="grid grid-cols-2 gap-1">
            <div className="bg-white/30 backdrop-blur-lg rounded p-1.5 border border-white/20 text-center">
              <div className="text-xs font-bold" style={{ color: "#05445E" }}>
                {Math.round(
                  (allMockAssets.filter((a) => a.recovery_age <= 14).length /
                    allMockAssets.length) *
                    100,
                )}
                %
              </div>
              <div className="text-xs" style={{ color: "#4A6A7B" }}>
                ≤14d
              </div>
            </div>
            <div className="bg-white/30 backdrop-blur-lg rounded p-1.5 border border-white/20 text-center">
              <div className="text-xs font-bold" style={{ color: "#05445E" }}>
                {allMockAssets.filter((a) => a.sla_stage === "Breach").length}
              </div>
              <div className="text-xs" style={{ color: "#4A6A7B" }}>
                Breach
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

  const handleDateRangeChange = () => {
    const options = [
      "Last 7 Days",
      "Last 30 Days",
      "Last 90 Days",
      "Last Year",
    ];
    const selectedOption = prompt(
      `Select date range:\n\n${options.map((opt, idx) => `${idx + 1}. ${opt}`).join("\n")}\n\nEnter number (1-4):`,
    );

    if (selectedOption && selectedOption >= "1" && selectedOption <= "4") {
      const selected = options[parseInt(selectedOption) - 1];
      alert(
        `📅 Date range changed to: ${selected}\n\nDashboard data would be refreshed with the new time period.`,
      );
    }
  };

  const handleRefreshDashboard = () => {
    alert(
      "🔄 Refreshing dashboard data...\n\nThis would fetch the latest metrics from the backend and update all KPI cards and charts.",
    );
  };

  return (
    <div className="space-y-4">
      {/* Clean Modern KPI Cards with Glassmorphism - Always 4 in a row */}
      <div className="grid grid-cols-4 gap-3">
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

      {/* Charts Section - Optimized Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset Type Chart */}
        <div className="lg:col-span-1">
          <AssetTypeChart />
        </div>

        {/* SLA Compliance Chart */}
        <div className="lg:col-span-1">
          <SlaComplianceChart />
        </div>

        {/* Recovery Progress Chart */}
        <div className="lg:col-span-1">
          <RecoveryProgressChart />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div>
        {/* Clean Recent Activity Section */}
        <div className="minimal-table flex flex-col h-[350px]">
          <div className="flex-shrink-0 pb-3 border-b" style={{ borderBottomColor: "var(--color-4)" }}>
            <h3 className="text-base font-medium flex items-center" style={{ color: "var(--color-1)" }}>
              <Clock className="mr-2 h-4 w-4" style={{ color: "var(--color-3)" }} />
              Recent Activity
            </h3>
          </div>
          <div className="flex-1 overflow-hidden pt-2">
            <div className="h-full overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr style={{ borderBottomColor: "var(--color-4)", backgroundColor: "var(--color-5)" }}>
                    <th className="text-left py-1.5 text-xs font-medium" style={{ color: "var(--color-2)" }}>
                      Asset
                    </th>
                    <th className="text-left py-1.5 text-xs font-medium" style={{ color: "var(--color-2)" }}>
                      User
                    </th>
                    <th className="text-left py-1.5 text-xs font-medium" style={{ color: "var(--color-2)" }}>
                      Status
                    </th>
                    <th className="text-left py-1.5 text-xs font-medium" style={{ color: "var(--color-2)" }}>
                      Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allMockAssets.slice(0, 8).map((asset, index) => (
                    <tr
                      key={asset.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-2">
                        <div>
                          <p className="text-xs font-medium text-[#1D1D2C] truncate">
                            {asset.asset_tag}
                          </p>
                          <p className="text-xs text-[#2C8780] truncate">
                            {asset.asset_type}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 text-xs text-[#1D1D2C] truncate max-w-[80px]">
                        {asset.user_name}
                      </td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-lg border ${
                            asset.status === "Completed"
                              ? "bg-green-100/50 text-green-700 border-green-200/30"
                              : asset.sla_stage === "Breach"
                                ? "bg-red-100/50 text-red-700 border-red-200/30"
                                : "bg-blue-100/50 text-blue-700 border-blue-200/30"
                          }`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-2 text-xs text-[#1D1D2C]">
                        {asset.recovery_age}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Self-Service Return Center */}
      <SelfServiceReturnCenter />

      {/* Submit Recovery Request Section */}
      <div>
        <SubmitRecoveryRequest />
      </div>
    </div>
  );
}
