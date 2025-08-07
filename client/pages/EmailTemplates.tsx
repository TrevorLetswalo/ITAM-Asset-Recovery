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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TestEmailRequest, TestEmailResponse } from '@shared/email-api';

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

Asset Details:
- Asset Tag: {{asset_tag}}
- Serial Number: {{serial_number}}
- Asset Type: {{asset_type}}
- Days Overdue: {{recovery_age}}
- Original Due Date: {{sla_due_date}}

This matter has now been escalated to your direct manager ({{manager_name}}) and the IT Security team. Immediate action is required to return this asset.

Please contact {{assigned_to}} immediately at {{support_email}} to arrange for the return of this asset.

This is a formal notice that failure to comply may result in:
- Policy violation proceedings
- Security access review
- Potential replacement cost charges

Best regards,
IT Asset Management Team
CC: {{manager_name}}, IT Security Team`,
    variables: ['user_name', 'asset_tag', 'serial_number', 'asset_type', 'recovery_age', 'sla_due_date', 'manager_name', 'assigned_to', 'support_email'],
    lastModified: '2024-02-25',
    isActive: true
  },
  {
    id: 'tmpl-004',
    name: 'Final Warning Notice',
    type: 'Final Warning',
    subject: 'FINAL NOTICE: Asset Recovery Required - {{asset_tag}}',
    content: `Dear {{user_name}},

This is a FINAL NOTICE regarding the overdue return of company asset {{asset_tag}}.

Asset Details:
- Asset Tag: {{asset_tag}}
- Serial Number: {{serial_number}}
- Asset Type: {{asset_type}}
- Days Overdue: {{recovery_age}}
- Estimated Value: {{asset_value}}

Despite previous communications, this asset remains unreturned. This matter has been escalated to:
- Your Manager: {{manager_name}}
- IT Security: {{security_contact}}
- HR Department: {{hr_contact}}

IMMEDIATE ACTION REQUIRED:
You have 48 hours from the receipt of this notice to return the asset or contact {{assigned_to}} at {{support_phone}} to arrange return.

Failure to comply within 48 hours will result in:
- Formal policy violation proceedings
- Potential charges for asset replacement cost ({{asset_value}})
- Security access suspension
- HR disciplinary action

This is your final opportunity to resolve this matter before formal proceedings begin.

Urgent Contact: {{assigned_to}} - {{support_phone}}

IT Asset Management Team`,
    variables: ['user_name', 'asset_tag', 'serial_number', 'asset_type', 'recovery_age', 'asset_value', 'manager_name', 'security_contact', 'hr_contact', 'assigned_to', 'support_phone'],
    lastModified: '2024-02-20',
    isActive: true
  },
  {
    id: 'tmpl-005',
    name: 'Risk Alert Notification',
    type: 'Risk Alert',
    subject: 'SECURITY ALERT: High-Risk Asset Recovery - {{asset_tag}}',
    content: `SECURITY ALERT - IMMEDIATE ATTENTION REQUIRED

Asset: {{asset_tag}} ({{asset_type}})
User: {{user_name}} ({{user_email}})
Risk Level: HIGH
Days Overdue: {{recovery_age}}

This high-value/sensitive asset has exceeded our security threshold for recovery time.

SECURITY IMPLICATIONS:
- Potential data exposure risk
- Policy compliance violation
- Asset value: {{asset_value}}

IMMEDIATE ACTIONS TAKEN:
- Security team notified
- Access reviews initiated
- Manager escalation: {{manager_name}}

REQUIRED ACTIONS:
1. Immediate asset recovery coordination
2. Security assessment upon return
3. User access review

Contact {{assigned_to}} immediately for urgent recovery coordination.

IT Security Team
Asset Management Division`,
    variables: ['asset_tag', 'asset_type', 'user_name', 'user_email', 'recovery_age', 'asset_value', 'manager_name', 'assigned_to'],
    lastModified: '2024-02-15',
    isActive: false
  }
];

const availableVariables = [
  'user_name', 'user_email', 'asset_tag', 'serial_number', 'asset_type', 
  'recovery_type', 'recovery_age', 'sla_due_date', 'status', 'manager_name',
  'assigned_to', 'support_email', 'support_phone', 'asset_value', 
  'security_contact', 'hr_contact', 'location', 'priority'
];

function TemplateEditor({ template, onSave, onCancel }: { 
  template: EmailTemplate | null; 
  onSave: (template: EmailTemplate) => void;
  onCancel: () => void;
}) {
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate>(
    template || {
      id: '',
      name: '',
      type: 'Initial',
      subject: '',
      content: '',
      variables: [],
      lastModified: new Date().toISOString().split('T')[0],
      isActive: true
    }
  );

  const insertVariable = (variable: string) => {
    setEditedTemplate(prev => ({
      ...prev,
      content: prev.content + `{{${variable}}}`
    }));
  };

  const previewWithSampleData = (text: string) => {
    const sampleData: Record<string, string> = {
      user_name: 'John Smith',
      user_email: 'john.smith@company.com',
      asset_tag: 'LAP-001234',
      serial_number: 'SN789456123',
      asset_type: 'MacBook Pro 16"',
      recovery_type: 'Exit',
      recovery_age: '15',
      sla_due_date: '2024-02-28',
      status: 'Overdue',
      manager_name: 'Sarah Johnson',
      assigned_to: 'Mike Rodriguez',
      support_email: 'it-support@company.com',
      support_phone: '(555) 123-4567',
      asset_value: '$2,500',
      security_contact: 'security@company.com',
      hr_contact: 'hr@company.com',
      location: 'New York Office',
      priority: 'High'
    };

    return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
      return sampleData[variable] || match;
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
          <input
            type="text"
            value={editedTemplate.name}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
            placeholder="Enter template name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Template Type</label>
          <select
            value={editedTemplate.type}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, type: e.target.value as EmailTemplate['type'] }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
          >
            <option value="Initial">Initial</option>
            <option value="Follow-Up">Follow-Up</option>
            <option value="Escalation">Escalation</option>
            <option value="Final Warning">Final Warning</option>
            <option value="Risk Alert">Risk Alert</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
        <input
          type="text"
          value={editedTemplate.subject}
          onChange={(e) => setEditedTemplate(prev => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent"
          placeholder="Enter email subject line"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
          <textarea
            value={editedTemplate.content}
            onChange={(e) => setEditedTemplate(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-recovery-accent focus:border-transparent font-mono text-sm"
            placeholder="Enter email content..."
          />
        </div>

        {/* Variables Panel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Variables</label>
          <div className="border border-gray-300 rounded-lg p-4 h-96 overflow-y-auto">
            <div className="space-y-2">
              {availableVariables.map((variable) => (
                <Button
                  key={variable}
                  variant="outline"
                  size="sm"
                  onClick={() => insertVariable(variable)}
                  className="w-full text-left justify-start text-xs"
                >
                  <Code className="mr-2 h-3 w-3" />
                  {variable}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview (with sample data)</label>
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-64 overflow-y-auto">
          <div className="space-y-2">
            <div><strong>Subject:</strong> {previewWithSampleData(editedTemplate.subject)}</div>
            <hr />
            <div className="whitespace-pre-wrap text-sm">{previewWithSampleData(editedTemplate.content)}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(editedTemplate)} className="bg-recovery-accent hover:bg-recovery-accent/90">
          <Save className="mr-2 h-4 w-4" />
          Save Template
        </Button>
      </div>
    </div>
  );
}

export function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sendingTestEmail, setSendingTestEmail] = useState<string | null>(null);
  const [testEmailStatus, setTestEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Initial':
        return 'bg-green-100 text-green-800';
      case 'Follow-Up':
        return 'bg-blue-100 text-blue-800';
      case 'Escalation':
        return 'bg-orange-100 text-orange-800';
      case 'Final Warning':
        return 'bg-red-100 text-red-800';
      case 'Risk Alert':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = templates.filter(template => 
    activeTab === 'all' || template.type === activeTab
  );

  const copyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.content);
    // You could add a toast notification here
  };

  const handleSaveTemplate = (template: EmailTemplate) => {
    if (template.id) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    } else {
      const newTemplate = { ...template, id: `tmpl-${Date.now()}` };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
            <p className="text-gray-600">Manage and customize automated email templates for asset recovery communications</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedTemplate(null);
              setIsEditing(true);
            }}
            className="bg-recovery-accent hover:bg-recovery-accent/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedTemplate ? 'Edit Template' : 'Create New Template'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateEditor
              template={selectedTemplate}
              onSave={handleSaveTemplate}
              onCancel={() => {
                setIsEditing(false);
                setSelectedTemplate(null);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="Initial">Initial</TabsTrigger>
              <TabsTrigger value="Follow-Up">Follow-Up</TabsTrigger>
              <TabsTrigger value="Escalation">Escalation</TabsTrigger>
              <TabsTrigger value="Final Warning">Final Warning</TabsTrigger>
              <TabsTrigger value="Risk Alert">Risk Alert</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getTypeColor(template.type)}>
                          {template.type}
                        </Badge>
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setIsEditing(true);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Subject:</label>
                      <p className="text-sm text-gray-900 truncate">{template.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Variables:</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.slice(0, 4).map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                        {template.variables.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.variables.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last modified: {template.lastModified}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Preview: {template.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="font-semibold">Subject:</label>
                            <p className="mt-1 p-3 bg-gray-50 rounded border">{template.subject}</p>
                          </div>
                          <div>
                            <label className="font-semibold">Content:</label>
                            <div className="mt-1 p-4 bg-gray-50 rounded border whitespace-pre-wrap text-sm">
                              {template.content}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline" size="sm">
                      <Send className="mr-2 h-4 w-4" />
                      Test Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
