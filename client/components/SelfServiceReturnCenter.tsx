import React, { useState, useEffect } from 'react';
import { Send, Upload, Package, Laptop, Smartphone, Monitor, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { submitRecoveryTicket } from '@/lib/firebase';
import { sendRecoveryConfirmation, initEmailJS } from '@/lib/emailjs';

interface SelfServiceReturnCenterProps {
  className?: string;
}

export default function SelfServiceReturnCenter({ className = "" }: SelfServiceReturnCenterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [assetTag, setAssetTag] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [reason, setReason] = useState('');
  const [recoveryType, setRecoveryType] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Initialize EmailJS
  useEffect(() => {
    initEmailJS();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionSuccess(false);

    try {
      // Submit to Firebase Firestore
      const ticketId = await submitRecoveryTicket({
        name,
        email,
        assetTag,
        reason: reason || recoveryType,
        serialNumber,
        recoveryType,
        comments
      });

      setGeneratedTicketId(ticketId);

      // Send confirmation email via EmailJS
      await sendRecoveryConfirmation({
        name,
        email,
        assetTag,
        reason: reason || recoveryType,
        ticketId
      });

      // Reset form and show success
      setName('');
      setEmail('');
      setAssetTag('');
      setSerialNumber('');
      setReason('');
      setRecoveryType('');
      setComments('');
      setSubmissionSuccess(true);

    } catch (error) {
      console.error('Error submitting recovery request:', error);
      alert('Failed to submit recovery request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={cn("p-6 rounded-2xl transition-all duration-500 ease-out cursor-pointer", className)} 
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
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-4" style={{
          background: 'linear-gradient(135deg, #2C8780 0%, #72F1DC 100%)',
          boxShadow: '0 4px 16px rgba(44, 135, 128, 0.3)'
        }}>
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-[#1D1D2C]">Self-Service Return Center</h3>
          <p className="text-sm text-[#2C8780]">Submit your device return request quickly and easily</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ticket ID */}
          <div>
            <label htmlFor="ticketId" className="block text-sm font-medium text-[#1D1D2C] mb-2">
              Ticket ID
            </label>
            <input
              type="text"
              id="ticketId"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="e.g., TKT-12345"
              className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              required
            />
          </div>

          {/* Serial Number */}
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-[#1D1D2C] mb-2">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Device serial number"
              className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              required
            />
          </div>
        </div>

        {/* Recovery Type */}
        <div>
          <label htmlFor="recoveryType" className="block text-sm font-medium text-[#1D1D2C] mb-2">
            Recovery Type
          </label>
          <select
            id="recoveryType"
            value={recoveryType}
            onChange={(e) => setRecoveryType(e.target.value)}
            className="w-full px-4 py-3 text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            required
          >
            <option value="">Select recovery type</option>
            <option value="Exit">Exit - Employee leaving</option>
            <option value="Loan">Loan - Temporary return</option>
            <option value="Swap">Swap - Device replacement</option>
          </select>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-[#1D1D2C] mb-2">
            Comments
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Additional notes or instructions..."
            rows={3}
            className="w-full px-4 py-3 text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent rounded-xl transition-all duration-300 resize-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 4px 16px rgba(114, 241, 220, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          />
        </div>

        {/* Quick Device Type Icons */}
        <div className="flex items-center space-x-3 py-2">
          <span className="text-sm text-[#2C8780] font-medium">Device type:</span>
          <div className="flex space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <Laptop className="w-4 h-4 text-[#2C8780]" />
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <Smartphone className="w-4 h-4 text-[#2C8780]" />
            </div>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer" 
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(15px)',
                boxShadow: '0 2px 8px rgba(114, 241, 220, 0.1)'
              }}
            >
              <Monitor className="w-4 h-4 text-[#2C8780]" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #2C8780 0%, #72F1DC 100%)',
            boxShadow: '0 8px 24px rgba(114, 241, 220, 0.3), 0 4px 12px rgba(44, 135, 128, 0.2)'
          }}
        >
          {isSubmitting ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Return
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
