import React, { useState, useMemo, useEffect } from "react";
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
  XCircle,
} from "lucide-react";
import { allMockAssets } from "@shared/mock-assets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { exportSLABreaches } from "@/lib/exportUtils";
import { sendReminderEmail, sendBulkEmails, initEmailJS } from "@/lib/emailjs";

// Minimal Container Component
interface MinimalContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function MinimalContainer({
  children,
  className = "",
  style = {},
}: MinimalContainerProps) {
  return (
    <div
      className={`minimal-card ${className}`}
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface BreachAlert {
  id: string;
  assetId: string;
  severity: "Critical" | "High" | "Medium";
  breachAge: number;
  estimatedValue: number;
  riskLevel: "Extreme" | "High" | "Medium" | "Low";
  lastAction: string;
  escalationLevel: number;
  managerNotified: boolean;
  securityNotified: boolean;
}

// Priority levels for breach categorization
const PRIORITY_LEVELS = {
  Extreme: {
    color: "bg-red-100/50 text-red-700 border-red-200/50",
    icon: AlertTriangle,
  },
  High: {
    color: "bg-orange-100/50 text-orange-700 border-orange-200/50",
    icon: AlertCircle,
  },
  Medium: {
    color: "bg-yellow-100/50 text-yellow-700 border-yellow-200/50",
    icon: Clock,
  },
  Low: {
    color: "bg-blue-100/50 text-blue-700 border-blue-200/50",
    icon: CheckCircle,
  },
};

// Generate breach alerts from mock data
const generateBreachAlerts = (): BreachAlert[] => {
  return allMockAssets
    .filter((asset) => asset.sla_stage === "Breach")
    .map((asset) => ({
      id: `breach-${asset.id}`,
      assetId: asset.id,
      severity: asset.priority as "Critical" | "High" | "Medium",
      breachAge: asset.recovery_age - 30,
      estimatedValue: Math.floor(Math.random() * 5000) + 1000,
      riskLevel:
        asset.recovery_age > 60
          ? "Extreme"
          : asset.recovery_age > 45
            ? "High"
            : asset.recovery_age > 35
              ? "Medium"
              : "Low",
      lastAction: Math.random() > 0.5 ? "Email Sent" : "Manager Escalated",
      escalationLevel: Math.floor(asset.recovery_age / 15),
      managerNotified: asset.recovery_age > 40,
      securityNotified: asset.recovery_age > 50,
    }));
};

// Historical breach trends (mock data)
const breachTrends = [
  { month: "Oct", breaches: 12, resolved: 8, pending: 4 },
  { month: "Nov", breaches: 18, resolved: 14, pending: 4 },
  { month: "Dec", breaches: 15, resolved: 11, pending: 4 },
  { month: "Jan", breaches: 22, resolved: 16, pending: 6 },
  { month: "Feb", breaches: 19, resolved: 13, pending: 6 },
  { month: "Mar", breaches: 25, resolved: 17, pending: 8 },
];

function BreachAlertCard({
  alert,
  asset,
  onSendReminder,
}: {
  alert: BreachAlert;
  asset: (typeof allMockAssets)[0];
  onSendReminder: (asset: any) => void;
}) {
  const handleCallUser = () => {
    window.alert(
      `📞 Calling ${asset.user_name}\n\nPhone: ${asset.user_name.toLowerCase().replace(" ", ".")}@company.com\nAsset: ${asset.asset_tag}\n\nThis would initiate a phone call or open the dialer application.`,
    );
  };

  const handleEscalate = () => {
    const confirmed = confirm(
      `⚠️ Escalate ${asset.asset_tag} to management?\n\nThis will:\n• Notify management team\n• Create high-priority ticket\n• Schedule follow-up actions\n\nContinue?`,
    );
    if (confirmed) {
      window.alert(
        `🚨 Asset ${asset.asset_tag} escalated successfully!\n\nManagement has been notified and a high-priority ticket has been created.`,
      );
    }
  };
  const priorityConfig = PRIORITY_LEVELS[alert.riskLevel];
  const Icon = priorityConfig.icon;

  return (
    <MinimalContainer className="border-l-4 border-l-red-400">
      <div className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="text-lg font-medium text-[#1D1D2C]">
                {asset.asset_tag}
              </h3>
              <p className="text-sm text-[#2C8780]">
                {asset.user_name} • {asset.location}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              className={`${priorityConfig.color} backdrop-blur-lg border`}
            >
              {alert.riskLevel} Risk
            </Badge>
            <Badge className="bg-red-100/50 text-red-700 border-red-200/50 backdrop-blur-lg border">
              {alert.breachAge}d overdue
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[#2C8780] font-medium">Asset Value</p>
            <p className="text-lg font-semibold text-[#1D1D2C]">
              R{(alert.estimatedValue * 18.5).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#2C8780] font-medium">
              Escalation Level
            </p>
            <p className="text-lg font-semibold text-[#1D1D2C]">
              Level {alert.escalationLevel}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#2C8780] font-medium">Last Action</p>
            <p className="text-sm text-[#1D1D2C]">{alert.lastAction}</p>
          </div>
          <div>
            <p className="text-xs text-[#2C8780] font-medium">Notifications</p>
            <div className="flex space-x-1">
              {alert.managerNotified && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              {alert.securityNotified && (
                <Bell className="h-4 w-4 text-orange-600" />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => onSendReminder(asset)}
              className="macos-button text-[#2C8780] text-xs"
            >
              <Mail className="mr-1 h-3 w-3" />
              Send Reminder
            </Button>
            <Button
              size="sm"
              onClick={handleCallUser}
              className="macos-button text-[#2C8780] text-xs"
            >
              <Phone className="mr-1 h-3 w-3" />
              Call User
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handleEscalate}
            className="text-red-600 hover:text-red-700 bg-red-100/50 hover:bg-red-100/70 border border-red-200/50 backdrop-blur-lg text-xs"
          >
            <Zap className="mr-1 h-3 w-3" />
            Escalate
          </Button>
        </div>
      </div>
    </MinimalContainer>
  );
}

function BreachTrendsChart() {
  const maxValue = Math.max(...breachTrends.map((d) => d.breaches));

  return (
    <MinimalContainer style={{ minHeight: "320px" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-[#1D1D2C] flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-[#2C8780]" />
          Breach Trends
        </h3>
        <Badge className="bg-white/50 text-[#2C8780] border-white/30">
          Last 6 Months
        </Badge>
      </div>

      <div
        className="flex items-end justify-between space-x-4 mb-4"
        style={{ minHeight: "200px" }}
      >
        {breachTrends.map((data, index) => (
          <div
            key={data.month}
            className="flex flex-col items-center flex-1 group"
          >
            <div className="w-full flex flex-col items-center space-y-1 mb-3">
              {/* Breach bar */}
              <div
                className="w-8 rounded-t-lg transition-all duration-1000 ease-out hover:scale-105 group-hover:shadow-lg"
                style={{
                  background: "linear-gradient(to top, #DC2626, #EF4444)",
                  height: `${(data.breaches / maxValue) * 120}px`,
                  animationDelay: `${index * 100}ms`,
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                }}
              />
              {/* Resolved bar */}
              <div
                className="w-8 rounded-b-lg transition-all duration-1000 ease-out hover:scale-105"
                style={{
                  background: "linear-gradient(to top, #059669, #10B981)",
                  height: `${(data.resolved / maxValue) * 80}px`,
                  animationDelay: `${index * 100}ms`,
                  boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
                }}
              />
            </div>
            <div className="text-center">
              <span className="text-xs text-[#1D1D2C] font-medium">
                {data.month}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-6 pt-4 border-t border-white/20">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-400 rounded-full mr-2" />
          <span className="text-sm text-[#1D1D2C] font-medium">Breaches</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-green-400 rounded-full mr-2" />
          <span className="text-sm text-[#1D1D2C] font-medium">Resolved</span>
        </div>
      </div>
    </MinimalContainer>
  );
}

export function SlaBreaches() {
  const [severityFilter, setSeverityFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Initialize EmailJS
  useEffect(() => {
    initEmailJS();
  }, []);

  const breachAlerts = useMemo(() => generateBreachAlerts(), []);
  const breachedAssets = useMemo(
    () =>
      allMockAssets.filter((asset) =>
        breachAlerts.some((alert) => alert.assetId === asset.id),
      ),
    [breachAlerts],
  );

  const filteredAlerts = useMemo(() => {
    return breachAlerts.filter((alert) => {
      const severityMatch =
        severityFilter === "all" || alert.severity === severityFilter;
      const riskMatch = riskFilter === "all" || alert.riskLevel === riskFilter;
      return severityMatch && riskMatch;
    });
  }, [breachAlerts, severityFilter, riskFilter]);

  const handleExportReport = () => {
    exportSLABreaches(breachedAssets);
  };

  const handleSendReminder = async (asset: any) => {
    try {
      await sendReminderEmail({
        name: asset.user_name,
        email: `${asset.user_name.toLowerCase().replace(" ", ".")}@company.com`,
        assetTag: asset.asset_tag,
        reason: "SLA Breach - Immediate action required",
        ticketId: `SLA-${asset.id}`,
      });
      alert(
        `✅ Reminder email sent to ${asset.user_name} (Check console for details)`,
      );
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Failed to send reminder email. Please try again.");
    }
  };

  const handleBulkEscalate = async () => {
    try {
      const recipients = breachedAssets.map((asset) => ({
        name: asset.user_name,
        email: `${asset.user_name.toLowerCase().replace(" ", ".")}@company.com`,
        assetTag: asset.asset_tag,
        reason: "SLA Breach Escalation - Management intervention required",
        ticketId: `ESC-${asset.id}`,
      }));

      await sendBulkEmails(recipients);
      alert(
        `✅ Escalation emails sent to ${recipients.length} users (Check console for details)`,
      );
    } catch (error) {
      console.error("Error sending bulk escalation:", error);
      alert("Failed to send escalation emails. Please try again.");
    }
  };

  const stats = useMemo(() => {
    const total = breachAlerts.length;
    const extreme = breachAlerts.filter(
      (a) => a.riskLevel === "Extreme",
    ).length;
    const critical = breachAlerts.filter(
      (a) => a.severity === "Critical",
    ).length;
    const avgAge =
      breachAlerts.reduce((sum, a) => sum + a.breachAge, 0) / total || 0;
    const totalValue = breachAlerts.reduce(
      (sum, a) => sum + a.estimatedValue,
      0,
    );

    return { total, extreme, critical, avgAge: Math.round(avgAge), totalValue };
  }, [breachAlerts]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">
            SLA Breaches
          </h1>
          <p className="text-[#2C8780]">
            Critical alerts and breach management dashboard
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleExportReport}
            className="macos-button text-[#1D1D2C]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button
            onClick={handleBulkEscalate}
            className="bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white hover:scale-105 transition-all duration-300"
            style={{
              boxShadow: "0 4px 12px rgba(44, 135, 128, 0.3)",
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            Bulk Escalate
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MinimalContainer className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="text-xs text-[#2C8780] font-medium">
                Total Breaches
              </p>
              <p className="text-xl font-light text-[#1D1D2C]">
                {stats.total}
              </p>
            </div>
          </div>
        </MinimalContainer>

        <MinimalContainer className="p-4">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-700 mr-3" />
            <div>
              <p className="text-xs text-[#2C8780] font-medium">Extreme Risk</p>
              <p className="text-xl font-light text-[#1D1D2C]">
                {stats.extreme}
              </p>
            </div>
          </div>
        </MinimalContainer>

        <MinimalContainer className="p-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-orange-600 mr-3" />
            <div>
              <p className="text-xs text-[#2C8780] font-medium">
                Avg Days Overdue
              </p>
              <p className="text-xl font-light text-[#1D1D2C]">
                {stats.avgAge}
              </p>
            </div>
          </div>
        </MinimalContainer>

        <MinimalContainer className="p-4">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-[#2C8780] font-medium">
                Asset Value at Risk
              </p>
              <p className="text-xl font-light text-[#1D1D2C]">
                R{((stats.totalValue * 18.5) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </MinimalContainer>
      </div>

      {/* Filters and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Filters */}
        <MinimalContainer>
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-4">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C8780] mb-2">
                Severity Level
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 2px 8px rgba(114, 241, 220, 0.1)",
                }}
              >
                <option value="all">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C8780] mb-2">
                Risk Level
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full px-3 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 2px 8px rgba(114, 241, 220, 0.1)",
                }}
              >
                <option value="all">All Risk Levels</option>
                <option value="Extreme">Extreme</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </MinimalContainer>

        {/* Breach Trends Chart */}
        <div className="lg:col-span-2">
          <BreachTrendsChart />
        </div>
      </div>

      {/* Breach Alerts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-[#1D1D2C]">
            Active Breach Alerts
          </h2>
          <p className="text-[#2C8780]">
            Showing {filteredAlerts.length} of {breachAlerts.length} breaches
          </p>
        </div>

        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const asset = breachedAssets.find((a) => a.id === alert.assetId);
            return asset ? (
              <BreachAlertCard
                key={alert.id}
                alert={alert}
                asset={asset}
                onSendReminder={handleSendReminder}
              />
            ) : null;
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <MinimalContainer className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-[#1D1D2C] mb-2">
              No Breaches Found
            </h3>
            <p className="text-[#2C8780]">
              All assets are within SLA compliance for the selected filters.
            </p>
          </MinimalContainer>
        )}
      </div>
    </div>
  );
}
