import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Hash,
  FileText,
  Send,
  ExternalLink,
  ChevronRight,
  Building,
  Timer,
  Badge as BadgeIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ReturnTicket {
  id: string;
  userEmail: string;
  assetType: string;
  returnType: 'Exit' | 'Swap' | 'Loaner';
  status: 'Submitted' | 'In Progress' | 'Completed' | 'Pending Review';
  submittedDate: string;
  expectedDate: string;
  slaCountdown: number;
  reason: string;
  comments?: string;
  assignedTo?: string;
  location: string;
}

const mockTickets: ReturnTicket[] = [
  {
    id: 'SELF-001',
    userEmail: 'trevdadodon@gmail.com',
    assetType: 'MacBook Pro 16"',
    returnType: 'Exit',
    status: 'In Progress',
    submittedDate: '2024-03-20',
    expectedDate: '2024-03-27',
    slaCountdown: 3,
    reason: 'Employee termination',
    comments: 'Asset will be returned to IT support desk',
    assignedTo: 'Sarah Johnson',
    location: 'New York Office'
  },
  {
    id: 'SELF-002',
    userEmail: 'trevdadodon@gmail.com',
    assetType: 'Dell Monitor 24"',
    returnType: 'Swap',
    status: 'Completed',
    submittedDate: '2024-03-15',
    expectedDate: '2024-03-22',
    slaCountdown: 0,
    reason: 'Hardware upgrade',
    assignedTo: 'Mike Rodriguez',
    location: 'New York Office'
  }
];

function SubmitReturnForm() {
  const [formData, setFormData] = useState({
    userName: 'Trevor Letswalo',
    employeeId: 'EMP001',
    email: 'trevdadodon@gmail.com',
    assetType: '',
    returnType: 'Exit' as 'Exit' | 'Swap' | 'Loaner',
    reason: '',
    comments: '',
    location: 'New York Office'
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const assetTypes = [
    'MacBook Pro 16"', 'MacBook Pro 14"', 'MacBook Air 13"',
    'Dell OptiPlex', 'HP EliteDesk', 'Lenovo ThinkPad',
    'Dell Monitor 24"', 'Dell Monitor 27"', 'LG UltraWide',
    'iPad Pro', 'iPhone', 'Other Hardware'
  ];

  const returnReasons = {
    'Exit': ['Employee termination', 'Resignation', 'Transfer', 'End of contract'],
    'Swap': ['Hardware upgrade', 'Defective device', 'Different specifications', 'Performance issues'],
    'Loaner': ['Repair return', 'Temporary use ended', 'Project completion', 'Event finished']
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-poppins">
            <Upload className="mr-3 h-5 w-5 text-recovery-accent" />
            Submit Asset Return Request
          </CardTitle>
          <p className="text-gray-600">Fill out the form below to initiate your asset return process</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="mr-2 h-4 w-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Hash className="mr-2 h-4 w-4" />
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                />
              </div>
            </div>

            {/* Asset Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="mr-2 h-4 w-4" />
                  Asset Type
                </label>
                <select
                  value={formData.assetType}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                >
                  <option value="">Select asset type...</option>
                  {assetTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <BadgeIcon className="mr-2 h-4 w-4" />
                  Return Type
                </label>
                <select
                  value={formData.returnType}
                  onChange={(e) => setFormData(prev => ({ ...prev, returnType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                >
                  <option value="Exit">Exit (Permanent return)</option>
                  <option value="Swap">Swap (Exchange for different device)</option>
                  <option value="Loaner">Loaner (Return temporary device)</option>
                </select>
              </div>
            </div>

            {/* Reason and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Reason for Return
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                >
                  <option value="">Select reason...</option>
                  {returnReasons[formData.returnType]?.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="mr-2 h-4 w-4" />
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                  required
                >
                  <option value="New York Office">New York Office</option>
                  <option value="San Francisco Office">San Francisco Office</option>
                  <option value="Austin Office">Austin Office</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="mr-2 h-4 w-4" />
                Additional Comments (Optional)
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
                placeholder="Any additional information about the return..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-recovery-accent to-recovery-highlight hover:opacity-90 text-white px-8 py-3 shadow-medium"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Return Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl font-poppins">
              <CheckCircle className="mr-3 h-6 w-6 text-green-500" />
              Request Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-800 font-medium">Your return request has been submitted and assigned ticket ID: <span className="font-mono">SELF-{Date.now().toString().slice(-3)}</span></p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Next Steps:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  You will receive an email confirmation within 5 minutes
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  IT team will review your request within 24 hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  You'll receive drop-off instructions via email
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-recovery-accent rounded-full mr-3" />
                  Track your request status in the "Track My Return" tab
                </li>
              </ul>
            </div>

            <Button 
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-recovery-accent hover:bg-recovery-accent/90"
            >
              Got it, thanks!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TrackMyReturn() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState(mockTickets);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSlaColor = (countdown: number) => {
    if (countdown <= 1) return 'text-red-600 bg-red-50';
    if (countdown <= 3) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="glass-card shadow-soft">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ticket ID or asset type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-recovery-accent focus:border-transparent shadow-soft"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="glass-card shadow-medium hover:shadow-strong transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold font-poppins text-gray-900">
                      Ticket #{ticket.id}
                    </h3>
                    <Badge className={`${getStatusColor(ticket.status)} border`}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{ticket.assetType} - {ticket.returnType}</p>
                </div>
                
                <div className={`px-3 py-2 rounded-lg text-sm font-medium ${getSlaColor(ticket.slaCountdown)}`}>
                  {ticket.slaCountdown > 0 ? (
                    <div className="flex items-center">
                      <Timer className="mr-1 h-4 w-4" />
                      {ticket.slaCountdown} days left
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted</p>
                  <p className="font-medium">{ticket.submittedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Return</p>
                  <p className="font-medium">{ticket.expectedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                  <p className="font-medium">{ticket.assignedTo || 'Pending assignment'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Reason:</strong> {ticket.reason}</p>
                {ticket.comments && (
                  <p className="text-sm text-gray-600"><strong>Comments:</strong> {ticket.comments}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="glass-card shadow-soft">
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Return Requests Found</h3>
            <p className="text-gray-600">You haven't submitted any return requests yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FAQInstructions() {
  const faqs = [
    {
      question: "Where can I drop off my equipment?",
      answer: "Equipment can be dropped off at any of our IT support desks during business hours (9 AM - 5 PM). Locations include: New York Office (Floor 12), San Francisco Office (Floor 3), Austin Office (Floor 2). For remote employees, we'll arrange pickup or provide shipping labels."
    },
    {
      question: "How long does the return process take?",
      answer: "Standard return processing takes 3-5 business days from submission to completion. Exit returns are prioritized and typically completed within 2-3 business days. You'll receive email updates throughout the process."
    },
    {
      question: "What should I do before returning my device?",
      answer: "1. Back up any personal files, 2. Sign out of all accounts, 3. Remove personal data, 4. Include all accessories (charger, mouse, etc.), 5. Note any physical damage in your return request."
    },
    {
      question: "Can I expedite my return request?",
      answer: "Yes, urgent returns can be expedited. Contact IT support at (555) 123-4567 or it-support@company.com. Emergency returns (security concerns) are processed immediately."
    },
    {
      question: "What happens if I'm late returning equipment?",
      answer: "Late returns may result in SLA breaches. You'll receive reminder emails before the due date. For significantly overdue returns, the matter may be escalated to management and could affect final paycheck processing."
    },
    {
      question: "How do I track my return status?",
      answer: "Use the 'Track My Return' tab in this portal with your ticket ID. You'll also receive email notifications for status changes. For immediate updates, contact your assigned IT specialist."
    }
  ];

  const locations = [
    {
      name: "New York Office",
      address: "123 Business Ave, Floor 12",
      hours: "9:00 AM - 5:00 PM EST",
      contact: "(212) 555-0123",
      email: "nyc-it@company.com"
    },
    {
      name: "San Francisco Office", 
      address: "456 Tech Street, Floor 3",
      hours: "9:00 AM - 5:00 PM PST",
      contact: "(415) 555-0123",
      email: "sf-it@company.com"
    },
    {
      name: "Austin Office",
      address: "789 Innovation Blvd, Floor 2",
      hours: "9:00 AM - 5:00 PM CST", 
      contact: "(512) 555-0123",
      email: "austin-it@company.com"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Contact */}
      <Card className="glass-card shadow-medium border-l-4 border-l-recovery-accent">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Phone className="mr-3 h-5 w-5 text-recovery-accent" />
            <h3 className="text-lg font-semibold font-poppins">Need Immediate Help?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">IT Support</p>
                <p className="text-sm text-gray-600">(555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">it-support@company.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm text-gray-600">9 AM - 5 PM EST</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop-off Locations */}
      <Card className="glass-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-poppins">
            <MapPin className="mr-3 h-5 w-5 text-recovery-accent" />
            Drop-off Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div key={location.name} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Building className="mr-2 h-4 w-4 text-recovery-accent" />
                  <h4 className="font-semibold text-gray-900">{location.name}</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>{location.address}</p>
                  <p className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {location.hours}
                  </p>
                  <p className="flex items-center">
                    <Phone className="mr-1 h-3 w-3" />
                    {location.contact}
                  </p>
                  <p className="flex items-center">
                    <Mail className="mr-1 h-3 w-3" />
                    {location.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card className="glass-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-poppins">
            <HelpCircle className="mr-3 h-5 w-5 text-recovery-accent" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-soft transition-shadow">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <ChevronRight className="mr-2 h-4 w-4 text-recovery-accent" />
                  {faq.question}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed ml-6">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Process */}
      <Card className="glass-card shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-poppins">
            <AlertCircle className="mr-3 h-5 w-5 text-recovery-accent" />
            Escalation Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div>
                <h4 className="font-semibold text-gray-900">IT Support Team</h4>
                <p className="text-sm text-gray-600">First point of contact for all return issues</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <div>
                <h4 className="font-semibold text-gray-900">IT Manager</h4>
                <p className="text-sm text-gray-600">For unresolved issues after 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <div>
                <h4 className="font-semibold text-gray-900">HR Department</h4>
                <p className="text-sm text-gray-600">For policy-related concerns or disputes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SelfServicePortal() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
          Self-Service Portal
        </h1>
        <p className="text-gray-600">Manage your asset returns and get support when you need it</p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 glass-card p-1">
          <TabsTrigger value="submit" className="data-[state=active]:bg-recovery-accent data-[state=active]:text-white">
            Submit Return
          </TabsTrigger>
          <TabsTrigger value="track" className="data-[state=active]:bg-recovery-accent data-[state=active]:text-white">
            Track My Return
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-recovery-accent data-[state=active]:text-white">
            FAQ / Instructions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <SubmitReturnForm />
        </TabsContent>

        <TabsContent value="track">
          <TrackMyReturn />
        </TabsContent>

        <TabsContent value="faq">
          <FAQInstructions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
