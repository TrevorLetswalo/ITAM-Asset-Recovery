import { RequestHandler } from "express";

export interface TestEmailRequest {
  templateName: string;
  subject: string;
  content: string;
  recipientEmail: string;
  templateType: string;
}

export interface TestEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export const sendTestEmail: RequestHandler = async (req, res) => {
  try {
    const { templateName, subject, content, recipientEmail, templateType } = req.body as TestEmailRequest;

    // Validate required fields
    if (!templateName || !subject || !content || !recipientEmail) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: templateName, subject, content, or recipientEmail"
      });
    }

    // In a real implementation, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - NodeMailer with SMTP
    
    // For now, we'll simulate sending the email
    console.log("=== TEST EMAIL SENDING ===");
    console.log(`To: ${recipientEmail}`);
    console.log(`Template: ${templateName} (${templateType})`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${content}`);
    console.log("=========================");

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demonstration, we'll always succeed but you could add error handling
    const emailId = `test-email-${Date.now()}`;

    const response: TestEmailResponse = {
      success: true,
      message: `Test email sent successfully to ${recipientEmail}`,
      emailId
    };

    res.json(response);

  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while sending test email"
    });
  }
};

export const getEmailHistory: RequestHandler = (req, res) => {
  // Mock email history for the asset recovery system
  const mockHistory = [
    {
      id: "email-001",
      timestamp: new Date().toISOString(),
      to: "trevdadodon@gmail.com",
      subject: "Test Email - Initial Recovery Request",
      status: "delivered",
      templateType: "Initial"
    },
    {
      id: "email-002", 
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      to: "trevdadodon@gmail.com",
      subject: "Test Email - Follow-Up Reminder",
      status: "delivered",
      templateType: "Follow-Up"
    }
  ];

  res.json({
    success: true,
    emails: mockHistory
  });
};
