import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  FileText,
  Eye,
  RefreshCw,
  Users,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Enhanced 3D Glass Container Component
interface Glass3DContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Glass3DContainer({ children, className = "", style = {} }: Glass3DContainerProps) {
  return (
    <div 
      className={`p-6 rounded-2xl transition-all duration-500 ease-out cursor-pointer ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.6)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(114, 241, 220, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(114, 241, 220, 0.2), 0 4px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(114, 241, 220, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
      }}
    >
      {children}
    </div>
  );
}

interface ReportCard {
  id: string;
  title: string;
  description: string;
  type: 'chart' | 'table' | 'summary';
  category: 'Operations' | 'Compliance' | 'Financial' | 'Performance';
  icon: React.ElementType;
  lastUpdated: string;
  downloadFormats: string[];
}

const mockReports: ReportCard[] = [
  {
    id: 'rpt-001',
    title: 'Asset Recovery Performance',
    description: 'Comprehensive analysis of recovery timelines, success rates, and bottlenecks',
    type: 'chart',
    category: 'Performance',
    icon: BarChart3,
    lastUpdated: '2024-03-20',
    downloadFormats: ['PDF', 'Excel', 'CSV']
  },
  {
    id: 'rpt-002',
    title: 'SLA Compliance Report',
    description: 'Detailed breakdown of SLA performance across all recovery types',
    type: 'table',
    category: 'Compliance',
    icon: Clock,
    lastUpdated: '2024-03-19',
    downloadFormats: ['PDF', 'Excel']
  },
  {
    id: 'rpt-003',
    title: 'Financial Impact Analysis',
    description: 'Cost analysis of recovery operations and asset value tracking',
    type: 'chart',
    category: 'Financial',
    icon: TrendingUp,
    lastUpdated: '2024-03-18',
    downloadFormats: ['PDF', 'Excel']
  },
  {
    id: 'rpt-004',
    title: 'User Compliance Summary',
    description: 'User-level compliance metrics and return behavior patterns',
    type: 'summary',
    category: 'Operations',
    icon: Users,
    lastUpdated: '2024-03-17',
    downloadFormats: ['PDF', 'CSV']
  },
  {
    id: 'rpt-005',
    title: 'Breach Risk Assessment',
    description: 'Analysis of potential SLA breaches and risk mitigation strategies',
    type: 'chart',
    category: 'Compliance',
    icon: AlertTriangle,
    lastUpdated: '2024-03-16',
    downloadFormats: ['PDF', 'Excel']
  },
  {
    id: 'rpt-006',
    title: 'Asset Distribution Report',
    description: 'Geographic and departmental distribution of assets under recovery',
    type: 'chart',
    category: 'Operations',
    icon: PieChart,
    lastUpdated: '2024-03-15',
    downloadFormats: ['PDF', 'Excel', 'CSV']
  }
];

function ReportCard({ report }: { report: ReportCard }) {
  const Icon = report.icon;

  const handleViewReport = () => {
    alert(`📊 Opening report: "${report.name}"\n\nThis would display the full report data in a detailed view.`);
  };

  const handleExportReport = () => {
    // Mock report data export
    const reportContent = {
      'Report Name': report.name,
      'Category': report.category,
      'Generated': new Date().toLocaleString(),
      'Data': 'Sample report data would be exported here...'
    };

    const csvRows = [];
    const headers = Object.keys(reportContent);
    csvRows.push(headers.join(","));
    const values = headers.map(header => `"${(reportContent as any)[header] ?? ''}"`);
    csvRows.push(values.join(","));

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Operations':
        return 'bg-blue-100/50 text-blue-700 border-blue-200/50';
      case 'Compliance':
        return 'bg-green-100/50 text-green-700 border-green-200/50';
      case 'Financial':
        return 'bg-purple-100/50 text-purple-700 border-purple-200/50';
      case 'Performance':
        return 'bg-orange-100/50 text-orange-700 border-orange-200/50';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200/50';
    }
  };

  return (
    <Glass3DContainer>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, rgba(44, 135, 128, 0.2) 0%, rgba(114, 241, 220, 0.2) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
          }}>
            <Icon className="h-5 w-5 text-[#2C8780]" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1D1D2C]">{report.title}</h3>
            <Badge className={`${getCategoryColor(report.category)} backdrop-blur-lg border`}>
              {report.category}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" className="macos-button text-[#2C8780]">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button size="sm" className="macos-button text-[#2C8780]">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      <p className="text-sm text-[#2C8780] mb-4">{report.description}</p>

      <div className="flex justify-between items-center pt-4 border-t border-white/20">
        <div className="text-xs text-[#2C8780]">
          Last updated: {report.lastUpdated}
        </div>
        <div className="flex space-x-1">
          {report.downloadFormats.map((format) => (
            <Badge key={format} className="bg-white/50 text-[#1D1D2C] border-white/30 text-xs">
              {format}
            </Badge>
          ))}
        </div>
      </div>
    </Glass3DContainer>
  );
}

export function Reports() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleRefreshAll = () => {
    alert('🔄 Refreshing all reports...\n\nThis would trigger data refresh from the backend in a full application.');
  };

  const handleBulkExport = () => {
    const filteredReports = selectedCategory === 'all'
      ? mockReports
      : mockReports.filter(report => report.category === selectedCategory);

    const reportData = filteredReports.map(report => ({
      'Report Name': report.name,
      'Category': report.category,
      'Type': report.type,
      'Description': report.description,
      'Last Updated': report.lastUpdated,
      'Download Formats': report.downloadFormats.join(', ')
    }));

    const csvRows = [];
    const headers = Object.keys(reportData[0]);
    csvRows.push(headers.join(","));

    for (const row of reportData) {
      const values = headers.map(header => `"${(row as any)[header] ?? ''}"`);
      csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `reports_bulk_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const [dateRange, setDateRange] = useState('30d');

  const filteredReports = mockReports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">Reports & Analytics</h1>
          <p className="text-[#2C8780]">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleRefreshAll} className="macos-button text-[#1D1D2C]">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
          <Button onClick={handleBulkExport} className="bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white hover:scale-105 transition-all duration-300" style={{
            boxShadow: '0 4px 12px rgba(44, 135, 128, 0.3)'
          }}>
            <Download className="mr-2 h-4 w-4" />
            Bulk Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Glass3DContainer>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <option value="all">All Categories</option>
              <option value="Operations">Operations</option>
              <option value="Compliance">Compliance</option>
              <option value="Financial">Financial</option>
              <option value="Performance">Performance</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-[#2C8780]">
            <Calendar className="h-4 w-4 mr-2" />
            Showing data for: {dateRange === '7d' ? 'Last 7 Days' : dateRange === '30d' ? 'Last 30 Days' : dateRange === '90d' ? 'Last 90 Days' : 'Last Year'}
          </div>
        </div>
      </Glass3DContainer>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Glass3DContainer className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-[#2C8780] mb-4" />
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-2">No Reports Found</h3>
          <p className="text-[#2C8780]">No reports match the selected category.</p>
        </Glass3DContainer>
      )}
    </div>
  );
}
