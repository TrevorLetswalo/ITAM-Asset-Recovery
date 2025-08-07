import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_xxx',
  templateId: 'template_recovery',
  publicKey: 'public_xxx'
};

// Check if EmailJS is properly configured
const isEmailJSConfigured = () => {
  return EMAILJS_CONFIG.serviceId !== 'service_xxx' &&
         EMAILJS_CONFIG.templateId !== 'template_recovery' &&
         EMAILJS_CONFIG.publicKey !== 'public_xxx';
};

// Initialize EmailJS
export const initEmailJS = () => {
  if (isEmailJSConfigured()) {
    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize EmailJS:', error);
    }
  } else {
    console.log('EmailJS running in mock mode - update configuration in lib/emailjs.ts');
  }
};

// Email template data interface
export interface EmailTemplateData {
  name: string;
  email: string;
  assetTag: string;
  reason: string;
  ticketId: string;
  to_email?: string;
}

// Send recovery ticket confirmation email
export const sendRecoveryConfirmation = async (templateData: EmailTemplateData): Promise<void> => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateData,
      EMAILJS_CONFIG.publicKey
    );
    console.log('Recovery confirmation email sent successfully');
  } catch (error) {
    console.error('Failed to send recovery confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

// Send reminder email
export const sendReminderEmail = async (templateData: EmailTemplateData): Promise<void> => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      'template_reminder',
      templateData,
      EMAILJS_CONFIG.publicKey
    );
    console.log('Reminder email sent successfully');
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    throw new Error('Failed to send reminder email');
  }
};

// Send bulk emails
export const sendBulkEmails = async (recipients: EmailTemplateData[]): Promise<void> => {
  try {
    const promises = recipients.map(recipient => 
      emailjs.send(
        EMAILJS_CONFIG.serviceId,
        'template_escalation',
        recipient,
        EMAILJS_CONFIG.publicKey
      )
    );
    
    await Promise.all(promises);
    console.log('Bulk emails sent successfully');
  } catch (error) {
    console.error('Failed to send bulk emails:', error);
    throw new Error('Failed to send bulk emails');
  }
};

// Send test email
export const sendTestEmail = async (testEmail: string = 'trevorleb@live.com'): Promise<void> => {
  try {
    const testData = {
      name: 'Test User',
      email: testEmail,
      assetTag: 'TEST-001',
      reason: 'Test email template',
      ticketId: 'TEST-123456',
      to_email: testEmail
    };

    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      testData,
      EMAILJS_CONFIG.publicKey
    );
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Failed to send test email:', error);
    throw new Error('Failed to send test email');
  }
};
