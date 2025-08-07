import React, { useState } from 'react';
import { Send, User, Mail, FileText, Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecoveryRequestForm {
  fullName: string;
  email: string;
  assetType: string;
  recoveryType: 'Exit' | 'Swap' | 'Loaner';
  serialAssetTag: string;
  dateOfReturn: string;
  comments: string;
}

export function SubmitRecoveryRequest() {
  const [formData, setFormData] = useState<RecoveryRequestForm>({
    fullName: '',
    email: '',
    assetType: '',
    recoveryType: 'Exit',
    serialAssetTag: '',
    dateOfReturn: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const assetTypes = [
    'Laptop - MacBook Pro',
    'Laptop - MacBook Air', 
    'Laptop - Dell',
    'Laptop - HP',
    'Monitor - 24"',
    'Monitor - 27"',
    'Monitor - 32"',
    'Dock - Thunderbolt',
    'Dock - USB-C',
    'Keyboard',
    'Mouse',
    'Webcam',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        assetType: '',
        recoveryType: 'Exit',
        serialAssetTag: '',
        dateOfReturn: '',
        comments: ''
      });
    }, 3000);
  };

  const handleInputChange = (field: keyof RecoveryRequestForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1D1D2C] mb-2">Request Submitted Successfully!</h3>
          <p className="text-gray-700">Your recovery request has been submitted. You will receive a confirmation email shortly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#1D1D2C] flex items-center">
          <FileText className="mr-3 h-6 w-6 text-[#2C8780]" />
          Submit Recovery Request
        </CardTitle>
        <p className="text-gray-700">Fill out the form below to request asset recovery</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Full Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#2C8780] mb-2 flex items-center">
                <User className="mr-2 h-4 w-4" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-300 rounded-xl text-[#1D1D2C] placeholder-gray-500 focus:bg-white/70 focus:border-[#2C8780] transition-all duration-200"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {/* Row 2: Asset Type and Recovery Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Asset Type
              </label>
              <select
                required
                value={formData.assetType}
                onChange={(e) => handleInputChange('assetType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-white/40 transition-all duration-200"
              >
                <option value="" className="bg-gray-800 text-white">Select asset type</option>
                {assetTypes.map(type => (
                  <option key={type} value={type} className="bg-gray-800 text-white">{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Recovery Type</label>
              <select
                value={formData.recoveryType}
                onChange={(e) => handleInputChange('recoveryType', e.target.value as 'Exit' | 'Swap' | 'Loaner')}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-white/40 transition-all duration-200"
              >
                <option value="Exit" className="bg-gray-800 text-white">Exit (Permanent return)</option>
                <option value="Swap" className="bg-gray-800 text-white">Swap (Exchange)</option>
                <option value="Loaner" className="bg-gray-800 text-white">Loaner (Temporary return)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Serial/Asset Tag and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Serial/Asset Tag</label>
              <input
                type="text"
                required
                value={formData.serialAssetTag}
                onChange={(e) => handleInputChange('serialAssetTag', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-200"
                placeholder="e.g. LAP-001234 or SN123456789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2 flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Date of Return
              </label>
              <input
                type="date"
                required
                value={formData.dateOfReturn}
                onChange={(e) => handleInputChange('dateOfReturn', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:border-white/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-white mb-2 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Comments (Optional)
            </label>
            <textarea
              rows={4}
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-200 resize-none"
              placeholder="Any additional information or special instructions..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#2C8780] hover:bg-[#2C8780]/90 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
