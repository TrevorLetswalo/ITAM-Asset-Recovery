import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import {
  getDashboardStats,
  getRecoveryByType,
  getSlaComplianceRate,
  allMockAssets,
} from "@shared/mock-assets";
import { SubmitRecoveryRequest } from "@/components/SubmitRecoveryRequest";
import SelfServiceReturnCenter from "@/components/SelfServiceReturnCenter";

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

// 90s Cool Toned Minimalism Palette
const COLORS = ["#a6c6ed", "#5b90b3", "#3d4c5c", "#b4d9d9", "#f8b98b"];

export function ModernDashboard() {
  const stats = getDashboardStats();
  const recoveryData = getRecoveryByType();
  const slaCompliance = getSlaComplianceRate();

  // Chart data
  const barData = [
    { name: "Laptop", value: recoveryData.exit || 45 },
    { name: "Desktop", value: Math.floor(recoveryData.swap * 0.8) || 35 },
    { name: "Monitor", value: recoveryData.loaner || 28 },
    { name: "Docking", value: Math.floor(recoveryData.exit * 0.4) || 18 }
  ];

  const pieData = [
    { name: "Compliant", value: slaCompliance },
    { name: "Breached", value: 100 - slaCompliance }
  ];

  const lineData = [
    { name: "Week 1", value: 20 },
    { name: "Week 2", value: 35 },
    { name: "Week 3", value: 50 },
    { name: "Week 4", value: stats.recoveredThisMonth || 70 }
  ];

  const kpiData = [
    { title: "Total Assets Pending", value: stats.totalPending },
    { title: "SLA Breach Count", value: stats.slaBreaches },
    { title: "Recovered This Month", value: stats.recoveredThisMonth },
    { title: "Open Exit Tickets", value: stats.openExitTickets },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="retro-kpi-card">
            <CardContent className="p-4">
              <p className="text-sm font-medium" style={{ color: "#5b90b3" }}>
                {kpi.title}
              </p>
              <h2 className="text-2xl font-bold" style={{ color: "#3d4c5c" }}>
                <AnimatedCounter value={kpi.value} />
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Assets by Type - Bar Chart */}
        <Card className="retro-chart-container">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3d4c5c" }}>
            Assets by Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#3d4c5c" fontSize={12} />
              <YAxis stroke="#3d4c5c" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #a6c6ed',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* SLA Compliance - Pie Chart */}
        <Card className="retro-chart-container">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3d4c5c" }}>
            SLA Compliance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie 
                data={pieData} 
                dataKey="value" 
                outerRadius={80} 
                label
                labelStyle={{ fontSize: '12px', fill: '#3d4c5c' }}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#3d4c5c' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Recovery Progress - Line Chart */}
        <Card className="retro-chart-container">
          <h3 className="text-lg font-semibold mb-4" style={{ color: "#3d4c5c" }}>
            Recovery Progress
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a6c6ed" />
              <XAxis dataKey="name" stroke="#3d4c5c" fontSize={12} />
              <YAxis stroke="#3d4c5c" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #a6c6ed',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={COLORS[1]} 
                strokeWidth={3}
                dot={{ fill: COLORS[1], strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activities Table */}
      <Card className="retro-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: "#3d4c5c" }}>
          Recent Activities
        </h3>
        <table className="retro-table">
          <thead style={{ backgroundColor: "#a6c6ed" }}>
            <tr>
              <th className="p-2">Asset</th>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {allMockAssets.slice(0, 6).map((asset, index) => (
              <tr key={asset.id} className="hover:bg-light-blue hover:bg-opacity-10">
                <td className="p-2">
                  <div>
                    <p className="font-medium" style={{ color: "#3d4c5c" }}>
                      {asset.asset_tag}
                    </p>
                    <p className="text-xs" style={{ color: "#5b90b3" }}>
                      {asset.asset_type}
                    </p>
                  </div>
                </td>
                <td className="p-2" style={{ color: "#3d4c5c" }}>
                  {asset.user_name}
                </td>
                <td className="p-2">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      asset.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : asset.sla_stage === "Breach"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>
                <td className="p-2" style={{ color: "#5b90b3" }}>
                  {new Date().toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Self-Service & Requests */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="retro-card retro-card-teal">
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4c5c" }}>
            Self-Service Return Center
          </h3>
          <p className="mb-4" style={{ color: "#3d4c5c" }}>
            Easily return your assigned assets using our guided process.
          </p>
          <Button className="retro-btn">
            Start Return
          </Button>
        </Card>

        <Card className="retro-card retro-card-peach">
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#3d4c5c" }}>
            Submit Recovery Request
          </h3>
          <p className="mb-4" style={{ color: "#3d4c5c" }}>
            Log a request to recover an asset quickly and efficiently.
          </p>
          <Button className="retro-btn">
            Submit Request
          </Button>
        </Card>
      </div>
    </div>
  );
}
