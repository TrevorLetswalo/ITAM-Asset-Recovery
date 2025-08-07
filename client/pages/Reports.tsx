import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw,
  PieChart,
  Activity
} from 'lucide-react';
import { allMockAssets, getDashboardStats, getRecoveryByType, getSlaComplianceRate } from '@shared/mock-assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Date range component
function DateRangeSelector({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange 
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Date Range:</span>
      </div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
      />
    </div>
  );
}

// KPI Summary Card
function SummaryCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  color = "text-recovery-accent" 
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

// Recovery Time Analysis Chart
function RecoveryTimeChart() {
  const recoveryTimeData = useMemo(() => {
    const timeRanges = {
      '0-7 days': 0,
      '8-14 days': 0,
      '15-30 days': 0,
      '31-60 days': 0,
      '60+ days': 0
    };

    allMockAssets.forEach(asset => {
      if (asset.recovery_age <= 7) timeRanges['0-7 days']++;
      else if (asset.recovery_age <= 14) timeRanges['8-14 days']++;
      else if (asset.recovery_age <= 30) timeRanges['15-30 days']++;
      else if (asset.recovery_age <= 60) timeRanges['31-60 days']++;
      else timeRanges['60+ days']++;
    });

    return Object.entries(timeRanges).map(([range, count]) => ({
      range,
      count,
      percentage: Math.round((count / allMockAssets.length) * 100)
    }));
  }, []);

  const maxCount = Math.max(...recoveryTimeData.map(d => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Recovery Time Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recoveryTimeData.map((item) => (
            <div key={item.range} className="flex items-center">
              <div className="w-24 text-sm font-medium text-gray-600">
                {item.range}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                      item.range.includes('60+') ? 'bg-red-500' :
                      item.range.includes('31-60') ? 'bg-orange-500' :
                      item.range.includes('15-30') ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm font-semibold text-gray-900 text-right">
                {item.count} ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Department Breakdown
function DepartmentBreakdown() {
  const departmentData = useMemo(() => {
    const departments: Record<string, { active: number; completed: number; breach: number }> = {};
    
    allMockAssets.forEach(asset => {
      const dept = asset.location.replace(' Office', '');
      if (!departments[dept]) {
        departments[dept] = { active: 0, completed: 0, breach: 0 };
      }
      
      if (asset.status === 'Completed') departments[dept].completed++;
      else if (asset.sla_stage === 'Breach') departments[dept].breach++;
      else departments[dept].active++;
    });

    return Object.entries(departments).map(([dept, stats]) => ({
      department: dept,
      ...stats,
      total: stats.active + stats.completed + stats.breach
    }));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Department Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium text-gray-900">Department</th>
                <th className="text-right py-2 font-medium text-gray-900">Active</th>
                <th className="text-right py-2 font-medium text-gray-900">Completed</th>
                <th className="text-right py-2 font-medium text-gray-900">Breaches</th>
                <th className="text-right py-2 font-medium text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept) => (
                <tr key={dept.department} className="border-b last:border-b-0">
                  <td className="py-2 font-medium">{dept.department}</td>
                  <td className="text-right py-2">
                    <Badge variant="outline">{dept.active}</Badge>
                  </td>
                  <td className="text-right py-2">
                    <Badge className="bg-green-100 text-green-800">{dept.completed}</Badge>
                  </td>
                  <td className="text-right py-2">
                    <Badge className="bg-red-100 text-red-800">{dept.breach}</Badge>
                  </td>
                  <td className="text-right py-2 font-semibold">{dept.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// SLA Performance Chart
function SlaPerformanceChart() {
  const slaData = useMemo(() => {
    const stages = ['Initial', 'Follow-Up', 'Escalation', 'Final Warning', 'Breach'];
    return stages.map(stage => ({
      stage,
      count: allMockAssets.filter(asset => asset.sla_stage === stage).length,
      color: stage === 'Initial' ? 'bg-green-500' :
             stage === 'Follow-Up' ? 'bg-blue-500' :
             stage === 'Escalation' ? 'bg-yellow-500' :
             stage === 'Final Warning' ? 'bg-orange-500' : 'bg-red-500'
    }));
  }, []);

  const maxCount = Math.max(...slaData.map(d => d.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          SLA Stage Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {slaData.map((item) => (
            <div key={item.stage} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-600">
                {item.stage}
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-8 text-sm font-semibold text-gray-900 text-right">
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Historical Trends (Mock data for demonstration)
function HistoricalTrends() {
  const trendsData = [
    { month: 'Jan', recovered: 45, pending: 28, breach: 5 },
    { month: 'Feb', recovered: 52, pending: 32, breach: 8 },
    { month: 'Mar', recovered: 38, pending: 41, breach: 12 },
    { month: 'Apr', recovered: 47, pending: 35, breach: 6 },
    { month: 'May', recovered: 55, pending: 29, breach: 4 },
    { month: 'Jun', recovered: 42, pending: 38, breach: 9 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          6-Month Historical Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {trendsData.map((data, index) => (
            <div key={data.month} className="flex flex-col items-center flex-1">
              <div className="w-full flex flex-col items-center space-y-1 mb-2">
                {/* Recovered bar */}
                <div
                  className="w-8 bg-green-500 rounded-t transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.recovered / 60) * 120}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                {/* Pending bar */}
                <div
                  className="w-8 bg-blue-500 transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.pending / 60) * 80}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
                {/* Breach bar */}
                <div
                  className="w-8 bg-red-500 rounded-b transition-all duration-1000 ease-out"
                  style={{
                    height: `${(data.breach / 60) * 40}px`,
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Recovered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Breaches</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Reports() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-03-31');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const stats = getDashboardStats();
  const recoveryByType = getRecoveryByType();
  const slaCompliance = getSlaComplianceRate();

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real implementation, you'd use a library like jsPDF
    alert('PDF export functionality would be implemented here using a library like jsPDF');
  };

  const exportSummaryReport = () => {
    const summaryData = [
      { metric: 'Total Assets Pending', value: stats.totalPending },
      { metric: 'SLA Breaches', value: stats.slaBreaches },
      { metric: 'Recovered This Month', value: stats.recoveredThisMonth },
      { metric: 'Open Exit Tickets', value: stats.openExitTickets },
      { metric: 'SLA Compliance Rate', value: `${slaCompliance}%` },
      { metric: 'Exit Recovery Count', value: recoveryByType.exit },
      { metric: 'Swap Recovery Count', value: recoveryByType.swap },
      { metric: 'Loaner Recovery Count', value: recoveryByType.loaner },
    ];
    exportToCSV(summaryData, 'recovery-summary-report');
  };

  const exportDetailedReport = () => {
    const detailedData = allMockAssets.map(asset => ({
      asset_tag: asset.asset_tag,
      serial_number: asset.serial_number,
      user_name: asset.user_name,
      asset_type: asset.asset_type,
      recovery_type: asset.recovery_type,
      sla_stage: asset.sla_stage,
      recovery_age: asset.recovery_age,
      status: asset.status,
      location: asset.location,
      assigned_to: asset.assigned_to,
      priority: asset.priority,
      created_date: asset.created_date,
      sla_due_date: asset.sla_due_date
    }));
    exportToCSV(detailedData, 'detailed-recovery-report');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive reports and analytics for asset recovery operations</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={exportSummaryReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Summary CSV
            </Button>
            <Button variant="outline" onClick={exportDetailedReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Detailed CSV
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <div className="flex items-center space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Austin">Austin</option>
                <option value="Chicago">Chicago</option>
                <option value="Boston">Boston</option>
              </select>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="Active Recoveries"
              value={stats.totalPending}
              change="+5.2%"
              changeType="positive"
              icon={Activity}
              color="text-blue-600"
            />
            <SummaryCard
              title="SLA Compliance Rate"
              value={`${slaCompliance}%`}
              change="-2.1%"
              changeType="negative"
              icon={CheckCircle}
              color="text-green-600"
            />
            <SummaryCard
              title="Assets in Breach"
              value={stats.slaBreaches}
              change="+12.4%"
              changeType="negative"
              icon={AlertTriangle}
              color="text-red-600"
            />
            <SummaryCard
              title="Total Collected"
              value={stats.recoveredThisMonth}
              change="+8.1%"
              changeType="positive"
              icon={TrendingUp}
              color="text-recovery-accent"
            />
          </div>

          {/* Recovery Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Recovery Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-recovery-accent rounded mr-3" />
                      <span>Exit Recoveries</span>
                    </div>
                    <span className="font-semibold">{recoveryByType.exit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-recovery-soft rounded mr-3" />
                      <span>Swap Recoveries</span>
                    </div>
                    <span className="font-semibold">{recoveryByType.swap}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-recovery-secondary rounded mr-3" />
                      <span>Loaner Recoveries</span>
                    </div>
                    <span className="font-semibold">{recoveryByType.loaner}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SlaPerformanceChart />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecoveryTimeChart />
            <SlaPerformanceChart />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <HistoricalTrends />
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <DepartmentBreakdown />
        </TabsContent>
      </Tabs>
    </div>
  );
}
