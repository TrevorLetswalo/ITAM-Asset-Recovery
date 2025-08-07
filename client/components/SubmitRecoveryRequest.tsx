import React, { useState } from 'react';
import { Send, User, Mail, FileText, Calendar, MessageSquare } from 'lucide-react';
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
      <div 
        className="p-8 text-center rounded-2xl transition-all duration-500 ease-out" 
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.6)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(114, 241, 220, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" 
          style={{
            background: 'linear-gradient(135deg, #2C8780 0%, #72F1DC 100%)',
            boxShadow: '0 8px 24px rgba(44, 135, 128, 0.3)'
          }}
        >
          <Send className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-medium text-[#1D1D2C] mb-2">Request Submitted Successfully!</h3>
        <p className="text-[#2C8780]">Your recovery request has been submitted. You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div 
      className="p-6 rounded-2xl transition-all duration-500 ease-out cursor-pointer" 
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderTop: '1px solid rgba(255, 255, 255, 0.6)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(114, 241, 220, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
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
      <div className="mb-6">
        <h2 className="text-xl font-medium text-[#1D1D2C] flex items-center">
          <FileText className="mr-3 h-6 w-6 text-[#2C8780]" />
          Submit Recovery Request
        </h2>
        <p className="text-[#2C8780] mt-2">Fill out the form below to request asset recovery</p>
      </div>
      
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
              className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C8780] mb-2 flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Row 2: Asset Type and Recovery Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C8780] mb-2 flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Asset Type
            </label>
            <select
              required
              value={formData.assetType}
              onChange={(e) => handleInputChange('assetType', e.target.value)}
              className="w-full px-4 py-3 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <option value="" className="bg-white text-[#1D1D2C]">Select asset type</option>
              {assetTypes.map(type => (
                <option key={type} value={type} className="bg-white text-[#1D1D2C]">{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C8780] mb-2">Recovery Type</label>
            <select
              value={formData.recoveryType}
              onChange={(e) => handleInputChange('recoveryType', e.target.value as 'Exit' | 'Swap' | 'Loaner')}
              className="w-full px-4 py-3 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <option value="Exit" className="bg-white text-[#1D1D2C]">Exit (Permanent return)</option>
              <option value="Swap" className="bg-white text-[#1D1D2C]">Swap (Exchange)</option>
              <option value="Loaner" className="bg-white text-[#1D1D2C]">Loaner (Temporary return)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Serial/Asset Tag and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#2C8780] mb-2">Serial/Asset Tag</label>
            <input
              type="text"
              required
              value={formData.serialAssetTag}
              onChange={(e) => handleInputChange('serialAssetTag', e.target.value)}
              className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              placeholder="e.g. LAP-001234 or SN123456789"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2C8780] mb-2 flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Date of Return
            </label>
            <input
              type="date"
              required
              value={formData.dateOfReturn}
              onChange={(e) => handleInputChange('dateOfReturn', e.target.value)}
              className="w-full px-4 py-3 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            />
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-medium text-[#2C8780] mb-2 flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Comments (Optional)
          </label>
          <textarea
            rows={4}
            value={formData.comments}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300 resize-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            placeholder="Any additional information or special instructions..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #2C8780 0%, #72F1DC 100%)',
              boxShadow: '0 8px 24px rgba(114, 241, 220, 0.3), 0 4px 12px rgba(44, 135, 128, 0.2)'
            }}
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
    </div>
  );
}
