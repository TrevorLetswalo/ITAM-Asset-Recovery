import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Eye, Mail, AlertCircle } from 'lucide-react';
import { allMockAssets, type AssetRecord } from '@shared/mock-assets';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { exportRecoveryQueue } from '@/lib/exportUtils';
import { sendReminderEmail, initEmailJS } from '@/lib/emailjs';

// Clean Container Component
interface CleanContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function CleanContainer({ children, className = "", style = {} }: CleanContainerProps) {
  return (
    <div
      className={`clean-card ${className}`}
      style={{
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Asset Detail Modal Component
function AssetDetailModal({ asset }: { asset: AssetRecord }) {
  const getSlaStageColor = (stage: string) => {
    switch (stage) {
      case 'Initial':
        return 'bg-green-100/50 text-green-700 border-green-200/50';
      case 'Follow-Up':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50';
      case 'Escalation':
        return 'bg-orange-100/50 text-orange-700 border-orange-200/50';
      case 'Final Warning':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      case 'Breach':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200/50';
    }
  };

  const mockEmailHistory = [
    { date: '2024-02-28', type: 'Follow-Up', subject: 'Asset Return Reminder', status: 'Sent' },
    { date: '2024-02-25', type: 'Initial', subject: 'Asset Recovery Required', status: 'Delivered' },
    { date: '2024-02-20', type: 'Initial', subject: 'Exit Process Started', status: 'Opened' },
  ];

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 12px 40px rgba(114, 241, 220, 0.2)'
    }}>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-[#1D1D2C]">Asset Details - {asset.asset_tag}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Information */}
        <CleanContainer>
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-4">Asset Information</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Asset Tag</label>
                <p className="font-semibold text-[#1D1D2C]">{asset.asset_tag}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Serial Number</label>
                <p className="font-semibold text-[#1D1D2C]">{asset.serial_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Asset Type</label>
                <p className="text-[#1D1D2C]">{asset.asset_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Location</label>
                <p className="text-[#1D1D2C]">{asset.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Recovery Type</label>
                <p className="text-[#1D1D2C]">{asset.recovery_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Priority</label>
                <Badge className="bg-white/50 text-[#1D1D2C] border-white/30">{asset.priority}</Badge>
              </div>
            </div>
          </div>
        </CleanContainer>

        {/* User & Status Information */}
        <CleanContainer>
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-4">User & Status</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-[#2C8780]">User</label>
                <p className="font-semibold text-[#1D1D2C]">{asset.user_name}</p>
                <p className="text-sm text-[#2C8780]">{asset.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Assigned To</label>
                <p className="text-[#1D1D2C]">{asset.assigned_to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">SLA Stage</label>
                <Badge className={`${getSlaStageColor(asset.sla_stage)} backdrop-blur-lg border`}>{asset.sla_stage}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C8780]">Days in Recovery</label>
                <p className="font-semibold text-lg text-[#1D1D2C]">{asset.recovery_age} days</p>
              </div>
            </div>
          </div>
        </CleanContainer>

        {/* Email History */}
        <CleanContainer className="lg:col-span-2">
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-4">Email Communication History</h3>
          <div className="space-y-3">
            {mockEmailHistory.map((email, index) => (
              <div key={index} className="p-3 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[#1D1D2C]">{email.subject}</p>
                    <p className="text-sm text-[#2C8780]">{email.type} • {email.date}</p>
                  </div>
                  <Badge className="bg-green-100/50 text-green-700 border-green-200/50">{email.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CleanContainer>
      </div>
    </DialogContent>
  );
}

export function RecoveryQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSlaStage, setFilterSlaStage] = useState('all');
  const [filterRecoveryType, setFilterRecoveryType] = useState('all');

  const getSlaStageColor = (stage: string) => {
    switch (stage) {
      case 'Initial':
        return 'bg-green-100/50 text-green-700 border-green-200/50';
      case 'Follow-Up':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50';
      case 'Escalation':
        return 'bg-orange-100/50 text-orange-700 border-orange-200/50';
      case 'Final Warning':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      case 'Breach':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100/50 text-green-700 border-green-200/50';
      case 'In Progress':
        return 'bg-blue-100/50 text-blue-700 border-blue-200/50';
      case 'Pending':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50';
      case 'Escalated':
        return 'bg-orange-100/50 text-orange-700 border-orange-200/50';
      case 'Breach':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200/50';
    }
  };

  const filteredAssets = useMemo(() => {
    return allMockAssets.filter(asset => {
      const matchesSearch = searchTerm === '' || 
        asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.user_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
      const matchesSlaStage = filterSlaStage === 'all' || asset.sla_stage === filterSlaStage;
      const matchesRecoveryType = filterRecoveryType === 'all' || asset.recovery_type === filterRecoveryType;

      return matchesSearch && matchesStatus && matchesSlaStage && matchesRecoveryType;
    });
  }, [searchTerm, filterStatus, filterSlaStage, filterRecoveryType]);

  // Initialize EmailJS
  useEffect(() => {
    initEmailJS();
  }, []);

  const handleExportCSV = () => {
    exportRecoveryQueue(filteredAssets);
  };

  const handleSendEmail = async (asset: AssetRecord) => {
    try {
      await sendReminderEmail({
        name: asset.user_name,
        email: `${asset.user_name.toLowerCase().replace(' ', '.')}@company.com`,
        assetTag: asset.asset_tag,
        reason: `Asset recovery reminder - ${asset.recovery_type}`,
        ticketId: `REM-${asset.id}`
      });
      alert(`✅ Reminder email sent to ${asset.user_name} (Check console for details)`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send reminder email. Please try again.');
    }
  };

  return (
    <div className="main-container space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-hippie-blue mb-2">Recovery Queue</h1>
        <p className="text-oxford-blue">Manage and track all asset recovery operations</p>
      </div>

      {/* Search and Filters */}
      <CleanContainer>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#2C8780]" />
              <input
                type="text"
                placeholder="Search by asset tag, serial number, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(15px)',
                  boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Breach">Breach</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filterSlaStage}
              onChange={(e) => setFilterSlaStage(e.target.value)}
              className="px-3 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <option value="all">All SLA Stages</option>
              <option value="Initial">Initial</option>
              <option value="Follow-Up">Follow-Up</option>
              <option value="Escalation">Escalation</option>
              <option value="Final Warning">Final Warning</option>
              <option value="Breach">Breach</option>
            </select>

            <select
              value={filterRecoveryType}
              onChange={(e) => setFilterRecoveryType(e.target.value)}
              className="px-3 py-2 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <option value="all">All Types</option>
              <option value="Exit">Exit</option>
              <option value="Swap">Swap</option>
              <option value="Loaner">Loaner</option>
            </select>

            <Button
              onClick={handleExportCSV}
              className="macos-button text-[#1D1D2C] flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CleanContainer>

      {/* Results Summary */}
      <div>
        <p className="text-[#2C8780]">
          Showing {filteredAssets.length} of {allMockAssets.length} assets
        </p>
      </div>

      {/* Table */}
      <CleanContainer className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/20">
              <tr>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Asset Tag</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Serial Number</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Type</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">SLA Stage</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Days in Recovery</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Status</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">User</th>
                <th className="text-left px-6 py-4 font-medium text-[#2C8780]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#1D1D2C]">{asset.asset_tag}</div>
                    <div className="text-sm text-[#2C8780]">{asset.asset_type}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1D1D2C]">{asset.serial_number}</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-white/50 text-[#1D1D2C] border-white/30">{asset.recovery_type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getSlaStageColor(asset.sla_stage)} backdrop-blur-lg border`}>
                      {asset.sla_stage}
                      {asset.sla_stage === 'Breach' && <AlertCircle className="ml-1 h-3 w-3" />}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${asset.recovery_age > 30 ? 'text-red-600' : asset.recovery_age > 14 ? 'text-orange-600' : 'text-[#1D1D2C]'}`}>
                      {asset.recovery_age}
                    </span>
                    <span className="text-sm text-[#2C8780] ml-1">days</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getStatusColor(asset.status)} backdrop-blur-lg border`}>
                      {asset.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-[#1D1D2C]">{asset.user_name}</div>
                      <div className="text-[#2C8780]">{asset.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="text-[#2C8780] hover:text-[#1D1D2C] bg-white/30 hover:bg-white/50 border border-white/30 backdrop-blur-lg"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </DialogTrigger>
                        <AssetDetailModal asset={asset} />
                      </Dialog>
                      <Button
                        size="sm"
                        onClick={() => handleSendEmail(asset)}
                        className="text-[#2C8780] hover:text-[#1D1D2C] bg-white/30 hover:bg-white/50 border border-white/30 backdrop-blur-lg"
                      >
                        <Mail className="mr-1 h-3 w-3" />
                        Email
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CleanContainer>
    </div>
  );
}
