import { Inquiry } from '@/types';

export interface NotificationResult {
  success: boolean;
  channel: 'whatsapp_cloud_api' | 'development_mock';
  messageId?: string;
  error?: string;
  timestamp: string;
}

/**
 * Sends a notification alert to the business owner when a new seasonal festive inquiry / pre-booking is received.
 */
export async function sendInquiryNotification(inquiry: Inquiry): Promise<NotificationResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const ownerPhone = process.env.BUSINESS_OWNER_PHONE || '+916371512551';

  const now = new Date().toISOString();

  // Notification text formatted for instant WhatsApp reading
  const messageBody = 
`🎆 *SPARKLERS & SMILES - NEW FESTIVE INQUIRY*
━━━━━━━━━━━━━━━━━━━━
*Ref ID:* #${inquiry.refId}
*Customer:* ${inquiry.customerName}
*Phone:* ${inquiry.phone}
*Occasion/Festival Date:* ${inquiry.festivalDate}
*Requirement:* ${inquiry.requirementType}
${inquiry.notes ? `*Cracker List/Notes:* ${inquiry.notes}` : ''}
*Received At:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━
_Action: Please review on Admin Portal or reply to customer via WhatsApp._`;

  // If WhatsApp Business credentials are provided, dispatch via Meta Graph API
  if (token && phoneNumberId && ownerPhone) {
    try {
      const cleanedOwnerPhone = ownerPhone.replace(/[^\d]/g, '');

      const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanedOwnerPhone,
          type: 'text',
          text: {
            preview_url: false,
            body: messageBody,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[WhatsApp Cloud API Error]:', data);
        return {
          success: false,
          channel: 'whatsapp_cloud_api',
          error: data?.error?.message || 'Failed to dispatch WhatsApp message',
          timestamp: now,
        };
      }

      return {
        success: true,
        channel: 'whatsapp_cloud_api',
        messageId: data?.messages?.[0]?.id,
        timestamp: now,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown network error';
      console.error('[Notification Exception]:', errorMessage);
      return {
        success: false,
        channel: 'whatsapp_cloud_api',
        error: errorMessage,
        timestamp: now,
      };
    }
  }

  // Safe Development Fallback: Logs clearly to terminal and server console
  console.log(`\n======================================================`);
  console.log(`[WHATSAPP ALERT] Simulated Alert to Owner (${ownerPhone}):`);
  console.log(messageBody);
  console.log(`======================================================\n`);

  return {
    success: true,
    channel: 'development_mock',
    messageId: `mock-msg-${Date.now()}`,
    timestamp: now,
  };
}
