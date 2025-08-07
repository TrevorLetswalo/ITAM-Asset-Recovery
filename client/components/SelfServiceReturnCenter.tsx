import React, { useState } from 'react';
import { Send, Upload, Package, Laptop, Smartphone, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface SelfServiceReturnCenterProps {
  className?: string;
}

export default function SelfServiceReturnCenter({ className = "" }: SelfServiceReturnCenterProps) {
  const [ticketId, setTicketId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [recoveryType, setRecoveryType] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form
      setTicketId('');
      setSerialNumber('');
      setRecoveryType('');
      setComments('');
      alert('Return request submitted successfully!');
    }, 2000);
  };

  return (
    <div className={cn("bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-6", className)} style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.2)'}}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2C8780] to-[#72F1DC] rounded-xl flex items-center justify-center mr-4">
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
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent"
              style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}
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
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent"
              style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}
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
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-[#1D1D2C] focus:ring-2 focus:ring-[#2C8780] focus:border-transparent"
            style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}
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
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl text-[#1D1D2C] placeholder-gray-500 focus:ring-2 focus:ring-[#2C8780] focus:border-transparent resize-none"
            style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.1)'}}
          />
        </div>

        {/* Quick Device Type Icons */}
        <div className="flex items-center space-x-3 py-2">
          <span className="text-sm text-[#2C8780] font-medium">Device type:</span>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <Laptop className="w-4 h-4 text-[#2C8780]" />
            </div>
            <div className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-[#2C8780]" />
            </div>
            <div className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center">
              <Monitor className="w-4 h-4 text-[#2C8780]" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-gradient-to-r from-[#2C8780] to-[#72F1DC] text-white font-semibold rounded-xl px-6 py-3 hover:from-[#2C8780]/90 hover:to-[#72F1DC]/90 transition-all duration-200 disabled:opacity-50"
          style={{boxShadow: '0 4px 30px rgba(114, 241, 220, 0.3)'}}
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
