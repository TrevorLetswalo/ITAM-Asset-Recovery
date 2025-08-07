import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// System prompt for IT Asset Recovery Assistant
const SYSTEM_PROMPT = `You are an IT Asset Recovery Assistant chatbot. You help users with:

1. Device Returns: Guide users through the process of returning loaner devices, company equipment, and personal devices used for work
2. SLA Information: Explain Service Level Agreement stages, timelines, and requirements
3. Recovery Status: Help users check and understand their asset recovery status
4. Escalation Rules: Explain when and how cases get escalated, and what triggers different escalation levels
5. Exit Recovery Protocol: Guide users through the process of completing their asset recovery and exiting the system

Key Information:
- SLA Stage 1: Initial request (0-2 business days) - Device flagged for recovery
- SLA Stage 2: First contact (3-5 business days) - User notified via email
- SLA Stage 3: Follow-up (6-10 business days) - Manager notification and phone contact
- SLA Stage 4: Escalation (11-15 business days) - IT Security and HR involvement
- SLA Stage 5: Final notice (16+ business days) - Asset marked as lost, potential charges

Return Methods:
- Drop-off at IT Service Desk (Building A, Floor 2)
- Scheduled pickup service (available Mon-Fri, 9 AM - 5 PM)
- Mail-in using prepaid shipping labels

Recovery Exit Process:
1. Return all assigned devices and accessories
2. Complete asset verification form
3. Obtain return receipt/confirmation
4. Wait for final clearance (1-2 business days)

Be helpful, professional, and concise. If you don't know something specific, guide users to contact IT support at it-support@company.com or call (555) 123-4567.`;

// Mock responses for when OpenAI API is not available
const getMockResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('return') && lowerMessage.includes('device')) {
    return "To return your loaner device:\n\n1. **Drop-off**: Visit IT Service Desk (Building A, Floor 2) during business hours\n2. **Pickup**: Schedule a pickup at (555) 123-4567\n3. **Mail**: Use the prepaid shipping label sent to your email\n\nMake sure to include all accessories (charger, cables, etc.) and remove any personal data.";
  }
  
  if (lowerMessage.includes('sla') && lowerMessage.includes('stage 3')) {
    return "**SLA Stage 3** (6-10 business days):\n\n- Follow-up phase after initial contact\n- Your manager will be notified\n- Phone contact attempted\n- Email reminders sent daily\n- Next stage triggers at day 11 if no response\n\nTo avoid escalation, please respond to emails or return your device as soon as possible.";
  }
  
  if (lowerMessage.includes('recovery status') || lowerMessage.includes('check status')) {
    return "To check your recovery status:\n\n1. **Email**: Check your company email for recovery notifications\n2. **IT Portal**: Log into the self-service portal on the company intranet\n3. **Phone**: Call IT Support at (555) 123-4567\n4. **Dashboard**: Use the Recovery Queue section in this application\n\nYour status will show current SLA stage, pending actions, and return deadline.";
  }
  
  if (lowerMessage.includes('escalation')) {
    return "**Escalation Rules**:\n\n**Stage 1→2**: After 2 business days without response\n**Stage 2→3**: After 5 business days, manager notified\n**Stage 3→4**: After 10 business days, IT Security involved\n**Stage 4→5**: After 15 business days, HR involvement and potential charges\n\nEscalation is automatic based on timelines. Respond promptly to avoid unnecessary escalation.";
  }
  
  if (lowerMessage.includes('exit') && lowerMessage.includes('protocol')) {
    return "**Exit Recovery Protocol**:\n\n1. ✅ Return all assigned devices and accessories\n2. ✅ Complete asset verification form\n3. ✅ Obtain return receipt/confirmation\n4. ✅ Wait for final clearance (1-2 business days)\n5. ✅ Receive completion notification\n\nOnce all steps are complete, you'll be removed from active recovery status.";
  }
  
  if (lowerMessage.includes('serial number')) {
    return "To find your device serial number:\n\n**Windows**: Settings > System > About\n**Mac**: Apple Menu > About This Mac\n**Mobile**: Settings > General > About\n**Label**: Check physical sticker on device bottom/back\n\nThe serial number is required for return processing and asset verification.";
  }
  
  if (lowerMessage.includes('deadline') || lowerMessage.includes('miss')) {
    return "If you miss the return deadline:\n\n- Case automatically escalates to next SLA stage\n- Manager and IT Security may be notified\n- Additional follow-up communications sent\n- Potential charges for lost/missing equipment\n\nContact IT Support immediately at (555) 123-4567 to discuss options and avoid penalties.";
  }
  
  if (lowerMessage.includes('long') || lowerMessage.includes('process')) {
    return "**Recovery Process Timeline**:\n\n- **Return**: 1-2 days after submission\n- **Verification**: 1-2 business days\n- **Clearance**: 1-2 business days\n- **Total**: Usually 3-6 business days\n\nTimeline depends on return method and device condition. Expedited processing available for urgent cases.";
  }
  
  return "I can help you with device returns, SLA information, recovery status, escalation rules, and exit protocols. Could you please be more specific about what you'd like to know? You can also contact IT Support at it-support@company.com or (555) 123-4567 for direct assistance.";
};

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    let response: string;

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found, using mock responses');
      response = getMockResponse(message);
    } else {
      try {
        // Call OpenAI API
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fallback to mock response if OpenAI fails
        response = getMockResponse(message);
      }
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
