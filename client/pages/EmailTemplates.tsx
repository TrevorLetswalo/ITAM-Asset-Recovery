import React, { useState, useEffect } from 'react';
import {
  Mail,
  Eye,
  Edit3,
  Save,
  Copy,
  Download,
  Send,
  Plus,
  Trash2,
  RefreshCw,
  Code,
  Type,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TestEmailRequest, TestEmailResponse } from '@shared/email-api';

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

interface EmailTemplate {
  id: string;
  name: string;
  type: 'Initial' | 'Follow-Up' | 'Escalation' | 'Final Warning' | 'Risk Alert';
  subject: string;
  content: string;
  variables: string[];
  lastModified: string;
  isActive: boolean;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Initial Recovery Request',
    type: 'Initial',
    subject: 'Action Required: Return of Company Asset - {{asset_tag}}',
    content: `Dear {{user_name}},

We hope this message finds you well. As part of our standard asset recovery process, we need to arrange for the return of the following company asset:

Asset Details:
- Asset Tag: {{asset_tag}}
- Serial Number: {{serial_number}}
- Asset Type: {{asset_type}}
- Recovery Type: {{recovery_type}}

Please return this asset to your local IT department or designated collection point by {{sla_due_date}}.

If you have any questions or need assistance with the return process, please contact your IT support team or reply to this email.

Thank you for your cooperation.

Best regards,
IT Asset Management Team`,
    variables: ['user_name', 'asset_tag', 'serial_number', 'asset_type', 'recovery_type', 'sla_due_date'],
    lastModified: '2024-03-01',
    isActive: true
  },
  {
    id: 'tmpl-002',
    name: 'Follow-Up Reminder',
    type: 'Follow-Up',
    subject: 'Reminder: Return of Company Asset - {{asset_tag}} ({{recovery_age}} days overdue)',
    content: `Dear {{user_name}},

This is a follow-up reminder regarding the return of company asset {{asset_tag}}. Our records indicate that this asset was due for return on {{sla_due_date}}, which was {{recovery_age}} days ago.

Asset Details:
- Asset Tag: {{asset_tag}}
- Serial Number: {{serial_number}}
- Asset Type: {{asset_type}}
- Current Status: {{status}}

Please arrange for the immediate return of this asset. If there are any issues preventing the return, please contact us immediately at {{support_email}} or {{support_phone}}.

Failure to return company assets may result in escalation to management and potential policy violations.

Best regards,
IT Asset Management Team`,
    variables: ['user_name', 'asset_tag', 'serial_number', 'asset_type', 'status', 'recovery_age', 'sla_due_date', 'support_email', 'support_phone'],
    lastModified: '2024-02-28',
    isActive: true
  },
  {
    id: 'tmpl-003',
    name: 'Management Escalation',
    type: 'Escalation',
    subject: 'URGENT: Asset Recovery Required - {{asset_tag}} ({{recovery_age}} days overdue)',
    content: `Dear {{user_name}},

This is an urgent notice regarding the overdue return of company asset {{asset_tag}}.

The asset is now {{recovery_age}} days overdue and this matter has been escalated to management.

Please contact IT support immediately to arrange return of this asset.

Best regards,
IT Asset Management Team`,
    variables: ['user_name', 'asset_tag', 'recovery_age'],
    lastModified: '2024-02-25',
    isActive: true
  }
];

function EmailTemplateCard({ template }: { template: EmailTemplate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(template.content);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Initial':
        return 'bg-blue-100/50 text-blue-700 border-blue-200/50';
      case 'Follow-Up':
        return 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50';
      case 'Escalation':
        return 'bg-orange-100/50 text-orange-700 border-orange-200/50';
      case 'Final Warning':
        return 'bg-red-100/50 text-red-700 border-red-200/50';
      case 'Risk Alert':
        return 'bg-purple-100/50 text-purple-700 border-purple-200/50';
      default:
        return 'bg-gray-100/50 text-gray-700 border-gray-200/50';
    }
  };

  const sendTestEmail = async () => {
    setIsSending(true);
    setSendResult(null);
    
    try {
      const testRequest: TestEmailRequest = {
        to: 'trevdadodon@gmail.com',
        subject: template.subject.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          const sampleData: Record<string, string> = {
            user_name: 'Trevor Letswalo',
            asset_tag: 'LAP-001234',
            serial_number: 'SN123456789',
            asset_type: 'MacBook Pro 16"',
            recovery_type: 'Exit',
            recovery_age: '15',
            sla_due_date: '2024-03-15',
            status: 'Pending',
            support_email: 'it-support@company.com',
            support_phone: '(555) 123-4567'
          };
          return sampleData[key] || match;
        }),
        content: editedContent.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          const sampleData: Record<string, string> = {
            user_name: 'Trevor Letswalo',
            asset_tag: 'LAP-001234',
            serial_number: 'SN123456789',
            asset_type: 'MacBook Pro 16"',
            recovery_type: 'Exit',
            recovery_age: '15',
            sla_due_date: 'March 15, 2024',
            status: 'Pending',
            support_email: 'it-support@company.com',
            support_phone: '(555) 123-4567'
          };
          return sampleData[key] || match;
        }),
        templateId: template.id
      };

      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest),
      });

      const result: TestEmailResponse = await response.json();
      setSendResult(result.success ? 'Email sent successfully!' : `Failed to send: ${result.error}`);
    } catch (error) {
      setSendResult('Error sending email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Glass3DContainer>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-[#1D1D2C]">{template.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={`${getTypeColor(template.type)} backdrop-blur-lg border`}>
              {template.type}
            </Badge>
            <Badge className={template.isActive ? 'bg-green-100/50 text-green-700 border-green-200/50' : 'bg-gray-100/50 text-gray-700 border-gray-200/50'}>
              {template.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" className="macos-button text-[#2C8780]">
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button size="sm" className="macos-button text-[#2C8780]" onClick={() => setIsEditing(!isEditing)}>
            <Edit3 className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#2C8780]">Subject Line</label>
          <p className="text-sm text-[#1D1D2C] p-3 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg mt-1">
            {template.subject}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-[#2C8780]">Content</label>
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-40 p-3 text-sm text-[#1D1D2C] rounded-lg border border-white/30 transition-all duration-300 resize-none mt-1"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            />
          ) : (
            <div className="text-sm text-[#1D1D2C] p-3 rounded-lg border border-white/20 bg-white/20 backdrop-blur-lg whitespace-pre-wrap max-h-40 overflow-y-auto mt-1">
              {template.content}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[#2C8780]">Available Variables</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {template.variables.map((variable) => (
              <code key={variable} className="px-2 py-1 text-xs bg-white/30 text-[#1D1D2C] rounded border border-white/30 backdrop-blur-lg">
                {`{{${variable}}}`}
              </code>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div className="text-xs text-[#2C8780]">
            Last modified: {template.lastModified}
          </div>
          <div className="flex space-x-2">
            {isEditing && (
              <Button size="sm" className="macos-button text-[#2C8780]">
                <Save className="h-3 w-3 mr-1" />
                Save Changes
              </Button>
            )}
            <Button 
              size="sm" 
              onClick={sendTestEmail}
              disabled={isSending}
              className="bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white hover:scale-105 transition-all duration-300"
              style={{
                boxShadow: '0 4px 12px rgba(44, 135, 128, 0.3)'
              }}
            >
              {isSending ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Send className="h-3 w-3 mr-1" />
              )}
              {isSending ? 'Sending...' : 'Test Email'}
            </Button>
          </div>
        </div>

        {sendResult && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm ${
            sendResult.includes('successfully') 
              ? 'bg-green-100/50 text-green-700 border border-green-200/50' 
              : 'bg-red-100/50 text-red-700 border border-red-200/50'
          } backdrop-blur-lg`}>
            {sendResult.includes('successfully') ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{sendResult}</span>
          </div>
        )}
      </div>
    </Glass3DContainer>
  );
}

export function EmailTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.type === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-[#1D1D2C] mb-2">Email Templates</h1>
          <p className="text-[#2C8780]">Manage and customize automated communication templates</p>
        </div>
        <div className="flex space-x-3">
          <Button className="macos-button text-[#1D1D2C]">
            <Download className="mr-2 h-4 w-4" />
            Export Templates
          </Button>
          <Button className="bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white hover:scale-105 transition-all duration-300" style={{
            boxShadow: '0 4px 12px rgba(44, 135, 128, 0.3)'
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Glass3DContainer>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            />
          </div>
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
            <option value="Initial">Initial</option>
            <option value="Follow-Up">Follow-Up</option>
            <option value="Escalation">Escalation</option>
            <option value="Final Warning">Final Warning</option>
            <option value="Risk Alert">Risk Alert</option>
          </select>
        </div>
      </Glass3DContainer>

      {/* Templates Grid */}
      <div className="space-y-6">
        {filteredTemplates.map((template) => (
          <EmailTemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Glass3DContainer className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-[#2C8780] mb-4" />
          <h3 className="text-lg font-medium text-[#1D1D2C] mb-2">No Templates Found</h3>
          <p className="text-[#2C8780]">No email templates match the selected filters.</p>
        </Glass3DContainer>
      )}
    </div>
  );
}
