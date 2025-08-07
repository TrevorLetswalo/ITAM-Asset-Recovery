import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Mail, AlertCircle } from 'lucide-react';
import { allMockAssets, type AssetRecord } from '@shared/mock-assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Asset Detail Modal Component
function AssetDetailModal({ asset }: { asset: AssetRecord }) {
  const getSlaStageColor = (stage: string) => {
    switch (stage) {
      case 'Initial':
        return 'bg-sla-green text-white';
      case 'Follow-Up':
        return 'bg-sla-yellow text-white';
      case 'Escalation':
        return 'bg-sla-orange text-white';
      case 'Final Warning':
        return 'bg-sla-red text-white';
      case 'Breach':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const mockEmailHistory = [
    { date: '2024-02-28', type: 'Follow-Up', subject: 'Asset Return Reminder', status: 'Sent' },
    { date: '2024-02-25', type: 'Initial', subject: 'Asset Recovery Required', status: 'Delivered' },
    { date: '2024-02-20', type: 'Initial', subject: 'Exit Process Started', status: 'Opened' },
  ];

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Asset Details - {asset.asset_tag}</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Asset Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Asset Tag</label>
                <p className="font-semibold">{asset.asset_tag}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Serial Number</label>
                <p className="font-semibold">{asset.serial_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Asset Type</label>
                <p>{asset.asset_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p>{asset.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Recovery Type</label>
                <p>{asset.recovery_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <Badge variant="outline">{asset.priority}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User & Status Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">User</label>
                <p className="font-semibold">{asset.user_name}</p>
                <p className="text-sm text-gray-500">{asset.user_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Assigned To</label>
                <p>{asset.assigned_to}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">SLA Stage</label>
                <Badge className={getSlaStageColor(asset.sla_stage)}>{asset.sla_stage}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Days in Recovery</label>
                <p className="font-semibold text-lg">{asset.recovery_age} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">SLA Due Date</label>
                <p className={asset.sla_stage === 'Breach' ? 'text-red-600 font-semibold' : ''}>
                  {asset.sla_due_date}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email History ({asset.email_count} emails)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockEmailHistory.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{email.subject}</p>
                  <p className="text-sm text-gray-600">{email.type} • {email.date}</p>
                </div>
                <Badge variant="outline">{email.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );
}

export function RecoveryQueue() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSlaStage, setFilterSlaStage] = useState('all');
  const [filterRecoveryType, setFilterRecoveryType] = useState('all');

  const filteredAssets = useMemo(() => {
    return allMockAssets.filter((asset) => {
      const matchesSearch = 
        asset.asset_tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.user_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
      const matchesSlaStage = filterSlaStage === 'all' || asset.sla_stage === filterSlaStage;
      const matchesRecoveryType = filterRecoveryType === 'all' || asset.recovery_type === filterRecoveryType;
      
      return matchesSearch && matchesStatus && matchesSlaStage && matchesRecoveryType;
    });
  }, [searchTerm, filterStatus, filterSlaStage, filterRecoveryType]);

  const getSlaStageColor = (stage: string) => {
    switch (stage) {
      case 'Initial':
        return 'bg-sla-green text-white';
      case 'Follow-Up':
        return 'bg-sla-yellow text-white';
      case 'Escalation':
        return 'bg-sla-orange text-white';
      case 'Final Warning':
        return 'bg-sla-red text-white';
      case 'Breach':
        return 'bg-red-600 text-white animate-pulse';
      default:
        return 'bg-gray-500 text-white';
    }
  };

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

  const exportToCSV = () => {
    const headers = ['Asset Tag', 'Serial Number', 'Type', 'SLA Stage', 'Days in Recovery', 'Status', 'User', 'Location'];
    const csvContent = [
      headers.join(','),
      ...filteredAssets.map(asset => [
        asset.asset_tag,
        asset.serial_number,
        asset.recovery_type,
        asset.sla_stage,
        asset.recovery_age,
        asset.status,
        asset.user_name,
        asset.location
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-queue.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recovery Queue</h1>
        <p className="text-gray-600">Manage and track all asset recovery operations</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by asset tag, serial number, or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="Exit">Exit</option>
                <option value="Swap">Swap</option>
                <option value="Loaner">Loaner</option>
              </select>

              <Button onClick={exportToCSV} variant="outline" className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredAssets.length} of {allMockAssets.length} assets
        </p>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Asset Tag</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Serial Number</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Type</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">SLA Stage</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Days in Recovery</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Status</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">User</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{asset.asset_tag}</div>
                      <div className="text-sm text-gray-500">{asset.asset_type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{asset.serial_number}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{asset.recovery_type}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getSlaStageColor(asset.sla_stage)}>
                        {asset.sla_stage}
                        {asset.sla_stage === 'Breach' && <AlertCircle className="ml-1 h-3 w-3" />}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${asset.recovery_age > 30 ? 'text-red-600' : asset.recovery_age > 14 ? 'text-orange-600' : 'text-gray-900'}`}>
                        {asset.recovery_age}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">days</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{asset.user_name}</div>
                        <div className="text-gray-500">{asset.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <AssetDetailModal asset={asset} />
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
