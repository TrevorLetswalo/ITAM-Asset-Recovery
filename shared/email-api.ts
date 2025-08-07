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

export interface EmailHistoryItem {
  id: string;
  timestamp: string;
  to: string;
  subject: string;
  status: 'delivered' | 'pending' | 'failed';
  templateType: string;
}

export interface EmailHistoryResponse {
  success: boolean;
  emails: EmailHistoryItem[];
}
