export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  sendAdminEmail,
  sendCustomerEmail,
  productEmailHtml,
  orderEmailHtml,
  inquiryEmailHtml,
  customerOrderConfirmationEmailHtml,
  OrderPayload,
} from '@/lib/email';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const resend = new Resend(RESEND_API_KEY);
const DEFAULT_FROM = 'Fireworks Store <onboarding@resend.dev>';
const ADMIN_EMAIL = 'kanjalireddy29@gmail.com';

/**
 * Generates festive HTML email for the customer order confirmation
 */
function generateCustomerHtml(customerName: string, orderId: string, orderDetails: any): string {
  const items = Array.isArray(orderDetails?.items) ? orderDetails.items : [];
  const total = orderDetails?.total || (typeof orderDetails === 'number' ? orderDetails : 0);
  const festivalDate = orderDetails?.festivalDate || '2026-11-01';
  const pickupNote = orderDetails?.pickupNote || orderDetails?.notes || '';

  const itemsHtml = items.length > 0
    ? items
        .map(
          (it: any) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 8px; font-weight: 600; color: #1e293b;">${it.name || it.productName || 'Festive Cracker'}</td>
          <td style="padding: 12px 8px; text-align: center; color: #475569;">${it.quantity || 1}</td>
          <td style="padding: 12px 8px; text-align: right; color: #2563eb; font-weight: 700;">₹${Number((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</td>
        </tr>`
        )
        .join('')
    : `
        <tr>
          <td colspan="3" style="padding: 14px 8px; color: #475569; font-style: italic;">
            ${typeof orderDetails === 'string' ? orderDetails : (orderDetails?.description || orderDetails?.summary || 'Festive Assortment Pre-Order')}
          </td>
        </tr>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Festive Order Booking Confirmation</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
      
      <!-- Festive Header Banner -->
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #d97706 100%); padding: 36px 24px; text-align: center; color: #ffffff;">
        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 18px; border-radius: 30px; font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.3);">
          ✨ 100% CSIR-NEERI CERTIFIED GREEN CRACKERS
        </div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">Fireworks Store</h1>
        <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.95; color: #fef08a;">Order Booking Confirmation & Receipt</p>
      </div>

      <!-- Main Body -->
      <div style="padding: 30px 28px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">
          Namaste ${customerName}, 🙏
        </h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px;">
          Thank you for choosing <strong>Fireworks Store</strong> for your celebrations! Your festive pre-booking is successfully received and reserved at our licensed counter.
        </p>

        <!-- Booking Reference Box -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 11px; text-transform: uppercase; color: #1e40af; font-weight: 700; letter-spacing: 0.5px; display: block;">Booking Reference ID</span>
            <span style="font-size: 20px; font-weight: 900; color: #1e3a8a; font-family: monospace;">${orderId}</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 11px; color: #64748b; display: block;">Target Date</span>
            <span style="font-size: 13px; font-weight: 700; color: #0f172a;">${festivalDate}</span>
          </div>
        </div>

        <!-- Order Items Breakdown -->
        <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
          📦 Reserved Cracker Assortment
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 18px;">
          <thead>
            <tr style="background: #f8fafc; color: #64748b; font-size: 11px; text-transform: uppercase; text-align: left;">
              <th style="padding: 8px;">Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          ${total ? `
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 14px 8px; font-weight: 800; font-size: 14px; text-align: right; color: #0f172a;">Estimated Total:</td>
              <td style="padding: 14px 8px; font-weight: 900; font-size: 18px; text-align: right; color: #2563eb;">₹${Number(total).toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>` : ''}
        </table>

        ${pickupNote ? `
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; margin-bottom: 20px; font-size: 12px; color: #92400e;">
          <strong>Pickup Note:</strong> ${pickupNote}
        </div>` : ''}

        <!-- Statutory Notice & Counter Instructions -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; font-size: 12px; color: #475569; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #0f172a;">🏢 Counter Collection & Payment Notice:</p>
          <p style="margin: 0 0 6px 0;">• In compliance with safety regulations, stock allocation is reserved for collection at our licensed counter.</p>
          <p style="margin: 0 0 6px 0;">• You can pay via UPI, Card, or Cash during handover.</p>
          <p style="margin: 0;">• Contact Counter Hotline: <strong>${BUSINESS_CONFIG.phone}</strong> for timing and express counter pickup.</p>
        </div>

        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 11px;">
          <p style="margin: 0 0 4px;">Sparklers & Smiles • Licensed Retail & Wholesale Festive Counter</p>
          <p style="margin: 0;">PESO Statutory License: ${BUSINESS_CONFIG.pesoLicense}</p>
        </div>

      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Generates clean admin alert HTML email
 */
function generateAdminHtml(customerName: string, customerEmail: string, orderId: string, orderDetails: any): string {
  const items = Array.isArray(orderDetails?.items) ? orderDetails.items : [];
  const total = orderDetails?.total || (typeof orderDetails === 'number' ? orderDetails : 0);
  const phone = orderDetails?.phone || orderDetails?.customerPhone || 'Not provided';
  const festivalDate = orderDetails?.festivalDate || '2026-11-01';
  const pickupNote = orderDetails?.pickupNote || orderDetails?.notes || '';

  const itemsList = items.length > 0
    ? items.map((it: any) => `<li><strong>${it.name || it.productName || 'Cracker Item'}</strong> × ${it.quantity || 1} — ₹${Number((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</li>`).join('')
    : `<li>${typeof orderDetails === 'string' ? orderDetails : JSON.stringify(orderDetails)}</li>`;

  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"></head>
  <body style="font-family: -apple-system, sans-serif; background: #0f172a; padding: 24px; color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 28px;">
      <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="background: #dc2626; color: #ffffff; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase;">
          🚨 Action Required: New Customer Order
        </span>
        <h1 style="color: #ffffff; font-size: 22px; margin: 12px 0 4px;">Order ${orderId}</h1>
        <p style="color: #94a3b8; font-size: 13px; margin: 0;">Total Value: <strong style="color: #38bdf8; font-size: 16px;">₹${Number(total).toLocaleString('en-IN')}</strong></p>
      </div>

      <div style="background: #0f172a; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
        <h3 style="color: #e2e8f0; font-size: 13px; text-transform: uppercase; margin-top: 0;">Customer Information</h3>
        <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${customerName}</p>
        <p style="margin: 4px 0;"><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #38bdf8;">${customerEmail}</a></p>
        <p style="margin: 4px 0;"><strong>Mobile / Phone:</strong> ${phone}</p>
        <p style="margin: 4px 0;"><strong>Pickup / Festival Date:</strong> ${festivalDate}</p>
        ${pickupNote ? `<p style="margin: 4px 0;"><strong>Customer Note:</strong> ${pickupNote}</p>` : ''}
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #e2e8f0; font-size: 13px; text-transform: uppercase;">Ordered Items Breakdown</h3>
        <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.8; padding-left: 20px;">
          ${itemsList}
        </ul>
      </div>

      <div style="border-top: 1px solid #334155; padding-top: 16px; text-align: center;">
        <a href="https://wa.me/91${phone.replace(/[^\d]/g, '').slice(-10)}" style="display: inline-block; background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px; margin-right: 10px;">
          WhatsApp Customer
        </a>
        <a href="mailto:${customerEmail}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px;">
          Reply via Email
        </a>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Next.js App Router POST /api/send-email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── CASE 1: Standard Resend Order Trigger ──────────────────────────────────
    if (body.customerEmail || body.customerName || body.orderDetails) {
      const {
        customerEmail,
        customerName = 'Valued Customer',
        orderDetails,
        orderId: clientOrderId,
      } = body;

      if (!customerEmail || !customerEmail.includes('@')) {
        return NextResponse.json(
          { error: 'A valid customerEmail is required.' },
          { status: 400 }
        );
      }

      const orderId =
        clientOrderId ||
        orderDetails?.orderId ||
        `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const customerHtml = generateCustomerHtml(customerName, orderId, orderDetails);
      const adminHtml = generateAdminHtml(customerName, customerEmail, orderId, orderDetails);

      // Save order and customer into Firebase Firestore Database
      try {
        const items = Array.isArray(orderDetails?.items) ? orderDetails.items : [];
        const total = Number(orderDetails?.total || 0);
        const orderDoc = {
          id: orderId,
          orderId,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: orderDetails?.phone || orderDetails?.customerPhone || '',
          festivalDate: orderDetails?.festivalDate || '2026-11-01',
          pickupNote: orderDetails?.pickupNote || orderDetails?.summary || '',
          items: items.length > 0 ? items : [{ name: orderDetails?.summary || 'Festive Fireworks Order', quantity: 1, price: total }],
          total,
          status: 'Pending',
          paymentStatus: 'Pay at Counter',
          createdAt: new Date().toISOString(),
          admin: 'Store Administrator',
          adminStatus: 'Pending Review',
          adminAssigned: 'Admin Desk',
          adminNotes: '',
          isAdminApproved: false,
        };
        await setDoc(doc(db, 'orders', orderId), orderDoc, { merge: true });
        console.log(`✅ [Send-Email API] Order ${orderId} saved to Firebase Firestore 'orders' collection!`);

        // Also save or update customer in `users` collection
        const normalizedEmail = customerEmail.trim().toLowerCase();
        const userQuery = query(collection(db, 'users'), where('email', '==', normalizedEmail));
        const userSnap = await getDocs(userQuery);
        if (userSnap.empty) {
          const custId = `cust-${Date.now()}`;
          await setDoc(doc(db, 'users', custId), {
            id: custId,
            name: customerName.trim(),
            email: normalizedEmail,
            phone: orderDetails?.phone || orderDetails?.customerPhone || '',
            role: 'customer',
            admin: false,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            lastOrderId: orderId,
            lastOrderTotal: total,
          });
          console.log(`✅ [Send-Email API] Customer ${customerName} saved to Firebase 'users' collection!`);
        } else {
          const existingUserDoc = userSnap.docs[0];
          await setDoc(
            doc(db, 'users', existingUserDoc.id),
            {
              lastOrderId: orderId,
              lastOrderTotal: total,
              admin: false,
              isAdmin: false,
              role: existingUserDoc.data().role || 'customer',
            },
            { merge: true }
          );
        }
      } catch (fsErr) {
        console.error('[Send-Email API Firestore Save Warning]:', fsErr);
      }

      const emailResults: {
        customerEmailSent: boolean;
        customerEmailId?: string;
        customerError?: string;
        adminEmailSent: boolean;
        adminEmailId?: string;
        adminError?: string;
      } = {
        customerEmailSent: false,
        adminEmailSent: false,
      };

      // 1. Send customer confirmation email using Resend
      try {
        const custRes = await resend.emails.send({
          from: DEFAULT_FROM,
          to: customerEmail.trim(),
          subject: `✨ Festive Order Confirmation [${orderId}] - Fireworks Store`,
          html: customerHtml,
        });

        if (custRes.error) {
          console.warn('[Resend Customer Email Notice]:', custRes.error);
          emailResults.customerError = custRes.error.message;
          // Fallback via SMTP if unverified testing domain limitation
          const smtpOk = await sendCustomerEmail(
            customerEmail.trim(),
            `✨ Festive Order Confirmation [${orderId}] - Fireworks Store`,
            customerHtml
          );
          emailResults.customerEmailSent = smtpOk;
        } else {
          emailResults.customerEmailSent = true;
          emailResults.customerEmailId = custRes.data?.id;
          console.log(`✅ Resend customer email delivered: ${custRes.data?.id}`);
        }
      } catch (err: any) {
        console.error('[Resend Customer Send Error]:', err);
        emailResults.customerError = err?.message || 'Failed to send customer email';
        // Fallback to SMTP
        const smtpOk = await sendCustomerEmail(
          customerEmail.trim(),
          `✨ Festive Order Confirmation [${orderId}] - Fireworks Store`,
          customerHtml
        );
        emailResults.customerEmailSent = smtpOk;
      }

      // 2. Send admin alert email to kanjalireddy29@gmail.com
      try {
        const total = orderDetails?.total || (typeof orderDetails === 'number' ? orderDetails : 0);
        const adminRes = await resend.emails.send({
          from: DEFAULT_FROM,
          to: ADMIN_EMAIL,
          subject: `🚨 New Order Alert: ${orderId} - ₹${total} (${customerName})`,
          html: adminHtml,
        });

        if (adminRes.error) {
          console.warn('[Resend Admin Email Notice]:', adminRes.error);
          emailResults.adminError = adminRes.error.message;
          // Fallback to SMTP
          const smtpOk = await sendAdminEmail(
            `🚨 New Order Alert: ${orderId} - ₹${total} (${customerName})`,
            adminHtml
          );
          emailResults.adminEmailSent = smtpOk;
        } else {
          emailResults.adminEmailSent = true;
          emailResults.adminEmailId = adminRes.data?.id;
          console.log(`✅ Resend admin email delivered: ${adminRes.data?.id}`);
        }
      } catch (err: any) {
        console.error('[Resend Admin Send Error]:', err);
        emailResults.adminError = err?.message || 'Failed to send admin email';
        const smtpOk = await sendAdminEmail(
          `🚨 New Order Alert: ${orderId} (${customerName})`,
          adminHtml
        );
        emailResults.adminEmailSent = smtpOk;
      }

      return NextResponse.json({
        success: true,
        message: 'Order emails processed successfully via Resend API',
        orderId,
        customerEmail: customerEmail.trim(),
        adminRecipient: ADMIN_EMAIL,
        delivery: emailResults,
      });
    }

    // ── CASE 2: Backwards Compatibility for existing payloads ─────────────────
    if (body.type === 'product') {
      const { action, product } = body;
      const subject = action === 'created' ? 'New Product Added' : 'Product Updated';
      const html = productEmailHtml(product, action);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    } else if (body.type === 'order') {
      const { order } = body as { order: OrderPayload };
      const subject = `New Order Received [${order.orderId || 'NEW'}]`;
      const html = orderEmailHtml(order);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    } else if (body.type === 'inquiry') {
      const { inquiry } = body;
      const subject = 'New Inquiry Received';
      const html = inquiryEmailHtml(inquiry);
      await sendAdminEmail(subject, html);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid payload. Provide customerEmail, customerName, and orderDetails.' },
      { status: 400 }
    );
  } catch (e: any) {
    console.error('Send-email route error:', e);
    return NextResponse.json(
      { error: e?.message || 'Internal server error while sending email.' },
      { status: 500 }
    );
  }
}
