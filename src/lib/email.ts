import { Product } from '@/types';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';
import { BUSINESS_CONFIG } from '@/lib/data/sample-products';

// Default email credentials fallback if env vars not explicitly supplied
const DEFAULT_EMAIL_PROVIDER = 'nodemailer';
const DEFAULT_EMAIL_HOST = 'smtp.gmail.com';
const DEFAULT_EMAIL_PORT = 465;
const DEFAULT_EMAIL_USER = 'kanjalireddy29@gmail.com';
const DEFAULT_EMAIL_PASS = 'xjnefohxidstkccd';
const DEFAULT_EMAIL_FROM = 'kanjalireddy29@gmail.com';
const DEFAULT_EMAIL_TO = 'kanjalireddy29@gmail.com';

function createSmtpTransporter() {
  const host = process.env.EMAIL_HOST || DEFAULT_EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || DEFAULT_EMAIL_PORT);
  const user = process.env.EMAIL_USER || DEFAULT_EMAIL_USER;
  const pass = process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

/**
 * Sends an HTML email to the admin.
 */
export async function sendAdminEmail(subject: string, html: string): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || DEFAULT_EMAIL_PROVIDER;
  const to = process.env.EMAIL_TO || DEFAULT_EMAIL_TO;
  const from = process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM;

  try {
    if (provider === 'resend' && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from, to, subject, html });
    } else if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({ to, from, subject, html });
    } else {
      const transporter = createSmtpTransporter();
      await transporter.sendMail({ from: `"Sparkles & Smiles Orders" <${from}>`, to, subject, html });
    }
    console.log(`✅ Admin email sent successfully to ${to} [${subject}]`);
    return true;
  } catch (e) {
    console.error('❌ Failed to send admin email:', e);
    return false;
  }
}

/**
 * Sends a confirmation HTML email directly to the customer.
 */
export async function sendCustomerEmail(toEmail: string, subject: string, html: string): Promise<boolean> {
  if (!toEmail || toEmail.includes('fireworks.local') || !toEmail.includes('@')) {
    console.log('Skipping customer email for local or invalid email:', toEmail);
    return false;
  }

  const provider = process.env.EMAIL_PROVIDER || DEFAULT_EMAIL_PROVIDER;
  const from = process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM;

  try {
    if (provider === 'resend' && process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from, to: toEmail, subject, html });
    } else if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({ to: toEmail, from, subject, html });
    } else {
      const transporter = createSmtpTransporter();
      await transporter.sendMail({ from: `"${BUSINESS_CONFIG.name} Bookings" <${from}>`, to: toEmail, subject, html });
    }
    console.log(`✅ Customer confirmation email sent successfully to ${toEmail} [${subject}]`);
    return true;
  } catch (e) {
    console.error('❌ Failed to send customer confirmation email:', e);
    return false;
  }
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  orderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  festivalDate?: string;
  pickupNote?: string;
  items: OrderItem[];
  total: number;
}

/**
 * Admin Notification Email Template
 */
export function orderEmailHtml(order: OrderPayload): string {
  const rows = order.items
    .map(
      (it) => `<tr>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#1e293b;">${it.name}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0; text-align:center; font-size:13px; font-weight:bold; color:#1e293b;">${it.quantity}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #e2e8f0; text-align:right; font-size:13px; font-weight:bold; color:#2563eb;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:#f8fafc; margin:0; padding:24px 12px;}
      .container {max-width:600px; margin:auto; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;}
      .header {background:linear-gradient(135deg, #1e3a8a, #2563eb); color:#ffffff; padding:24px 20px; text-align:center;}
      .header h1 {margin:0 0 4px; font-size:22px; font-weight:800; letter-spacing:-0.5px;}
      .header p {margin:0; font-size:12px; color:#bfdbfe; font-weight:600; text-transform:uppercase; letter-spacing:1px;}
      .body-content {padding:24px 20px;}
      .badge {display:inline-block; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:12px; font-weight:700; padding:4px 12px; rounded-radius:8px; border-radius:6px; font-family:monospace; margin-bottom:16px;}
      .info-box {background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:20px; font-size:13px; line-height:1.6;}
      .info-box strong {color:#0f172a;}
      table {width:100%; border-collapse:collapse; margin-top:8px;}
      th {background:#f1f5f9; padding:8px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; font-weight:700;}
      .total-row {background:#f8fafc; padding:16px 20px; border-top:2px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;}
      .footer {padding:16px 20px; text-align:center; font-size:11px; color:#94a3b8; border-top:1px solid #f1f5f9;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✨ New Festive Order Alert</h1>
        <p>${BUSINESS_CONFIG.name} Store Admin</p>
      </div>
      <div class="body-content">
        ${order.orderId ? `<div class="badge">Reference ID: ${order.orderId}</div>` : ''}
        
        <div class="info-box">
          <p style="margin:0 0 6px;"><strong>Customer:</strong> ${order.customerName}</p>
          <p style="margin:0 0 6px;"><strong>Email:</strong> ${order.customerEmail}</p>
          ${order.customerPhone ? `<p style="margin:0 0 6px;"><strong>Phone / WhatsApp:</strong> <a href="tel:${order.customerPhone}" style="color:#2563eb; text-decoration:none; font-weight:bold;">${order.customerPhone}</a></p>` : ''}
          ${order.festivalDate ? `<p style="margin:0 0 6px;"><strong>Festival / Pickup Date:</strong> ${order.festivalDate}</p>` : ''}
          ${order.pickupNote ? `<p style="margin:0;"><strong>Customer Note:</strong> ${order.pickupNote}</p>` : ''}
        </div>

        <h3 style="font-size:14px; text-transform:uppercase; color:#475569; letter-spacing:0.5px; margin:0 0 8px;">Order Assortment</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="margin-top:16px; padding:12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; text-align:right;">
          <span style="font-size:14px; font-weight:600; color:#1e40af;">Total Amount (Pay at Counter):</span>
          <span style="font-size:18px; font-weight:900; color:#1d4ed8; margin-left:8px;">₹${order.total.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div class="footer">
        Automated Store Notification • ${BUSINESS_CONFIG.pesoLicense} • Counter Hotline: ${BUSINESS_CONFIG.phone}
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Customer Confirmation Email Template
 */
export function customerOrderConfirmationEmailHtml(order: OrderPayload): string {
  const rows = order.items
    .map(
      (it) => `<tr>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; font-size:13px; color:#1e293b;">${it.name}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; text-align:center; font-size:13px; font-weight:bold; color:#1e293b;">${it.quantity}</td>
        <td style="padding:10px 12px; border-bottom:1px solid #e2e8f0; text-align:right; font-size:13px; font-weight:bold; color:#2563eb;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
      </tr>`
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:#f8fafc; margin:0; padding:24px 12px;}
      .container {max-width:600px; margin:auto; background:#ffffff; border-radius:16px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05); overflow:hidden;}
      .header {background:linear-gradient(135deg, #1e3a8a, #2563eb); color:#ffffff; padding:28px 20px; text-align:center;}
      .header h1 {margin:0 0 6px; font-size:24px; font-weight:800; letter-spacing:-0.5px;}
      .header p {margin:0; font-size:13px; color:#bfdbfe;}
      .body-content {padding:24px 20px;}
      .order-pill {display:inline-block; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; padding:6px 14px; border-radius:8px; font-family:monospace; font-weight:bold; font-size:14px; margin-bottom:16px;}
      .greeting {font-size:15px; color:#1e293b; line-height:1.6; margin-bottom:18px;}
      .info-box {background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:20px; font-size:13px; line-height:1.6;}
      table {width:100%; border-collapse:collapse; margin-top:8px;}
      th {background:#f1f5f9; padding:8px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; font-weight:700;}
      .total-box {margin-top:16px; padding:14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; text-align:right;}
      .instructions {margin-top:20px; padding:14px; background:#fefce8; border:1px solid #fde047; border-radius:12px; font-size:12px; color:#713f12; line-height:1.5;}
      .footer {padding:20px; text-align:center; font-size:12px; color:#94a3b8; border-top:1px solid #f1f5f9; line-height:1.6;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎆 Festive Pre-Order Confirmed!</h1>
        <p>${BUSINESS_CONFIG.name} — CSIR-NEERI Green Certified Fireworks</p>
      </div>

      <div class="body-content">
        <div style="text-align:center;">
          ${order.orderId ? `<div class="order-pill">Booking Reference: ${order.orderId}</div>` : ''}
        </div>

        <p class="greeting">
          Dear <strong>${order.customerName}</strong>,<br/>
          Thank you for celebrating this festive season with <strong>${BUSINESS_CONFIG.name}</strong>! We have received your order booking. Your reserved festive items are being prepared for convenient counter pickup.
        </p>

        <div class="info-box">
          <p style="margin:0 0 6px;"><strong>Scheduled Collection Date:</strong> ${order.festivalDate || 'Immediate Festive Counter Collection'}</p>
          <p style="margin:0 0 6px;"><strong>Counter Location:</strong> ${BUSINESS_CONFIG.address}</p>
          <p style="margin:0 0 6px;"><strong>Contact Hotline:</strong> ${BUSINESS_CONFIG.phone}</p>
          <p style="margin:0;"><strong>Payment Terms:</strong> Pay at Store Counter during collection (UPI, Cash, or Cards)</p>
        </div>

        <h3 style="font-size:13px; text-transform:uppercase; color:#475569; letter-spacing:0.5px; margin:0 0 8px;">Your Cracker Selection</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total-box">
          <span style="font-size:14px; font-weight:600; color:#1e40af;">Total Estimated Amount:</span>
          <span style="font-size:20px; font-weight:900; color:#1d4ed8; margin-left:8px;">₹${order.total.toLocaleString('en-IN')}</span>
        </div>

        <div class="instructions">
          <strong>⚠️ Counter Collection Instructions:</strong><br/>
          • Please show your Booking Reference ID <strong>(${order.orderId || 'Your Order'})</strong> at our retail counter.<br/>
          • 100% CSIR-NEERI Certified Green Crackers with valid QR verification codes.<br/>
          • Need changes to your booking? Contact our helpline directly at <strong>${BUSINESS_CONFIG.phone}</strong>.
        </div>
      </div>

      <div class="footer">
        <strong>${BUSINESS_CONFIG.name}</strong><br/>
        Seasonal Festive License: ${BUSINESS_CONFIG.pesoLicense}<br/>
        Have a safe, bright, and joyous celebration!
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Minimal responsive HTML email for a product event.
 */
export function productEmailHtml(product: Product, action: 'created' | 'updated'): string {
  const title = action === 'created' ? 'New Product Added' : 'Product Updated';
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {font-family: Arial, Helvetica, sans-serif; background:#f8fafc; margin:0; padding:20px;}
      .container {max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:12px; border:1px solid #e2e8f0;}
      .header {font-size:20px; font-weight:bold; color:#1e293b; margin-bottom:12px;}
      .row {margin-bottom:8px; font-size:13px;}
      .label {font-weight:bold; color:#64748b;}
      .value {color:#0f172a;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${title}</div>
      <div class="row"><span class="label">Name:</span> <span class="value">${product.name}</span></div>
      <div class="row"><span class="label">Category:</span> <span class="value">${product.categoryName}</span></div>
      <div class="row"><span class="label">Price:</span> <span class="value">₹${product.retailPrice.toLocaleString('en-IN')}</span></div>
      <div class="row"><span class="label">Stock:</span> <span class="value">${product.stockQuantity}</span></div>
      <div class="row"><span class="label">Green Cracker:</span> <span class="value">${product.isGreenCracker ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="label">Description:</span> <span class="value">${product.description}</span></div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Generates responsive HTML email for an inquiry submission.
 */
export function inquiryEmailHtml(inquiry: {
  customerName: string;
  phone: string;
  email?: string;
  festivalDate: string;
  requirementType: string;
  notes?: string;
  productId?: string;
  productName?: string;
  createdAt: string;
}): string {
  const title = 'New Festive Inquiry Received';
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {font-family: Arial, Helvetica, sans-serif; background:#f8fafc; margin:0; padding:20px;}
      .container {max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:12px; border:1px solid #e2e8f0;}
      .header {font-size:20px; font-weight:bold; color:#1e293b; margin-bottom:12px;}
      .row {margin-bottom:8px; font-size:13px;}
      .label {font-weight:bold; color:#64748b;}
      .value {color:#0f172a;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${title}</div>
      <div class="row"><span class="label">Customer Name:</span> <span class="value">${inquiry.customerName}</span></div>
      <div class="row"><span class="label">Phone / WhatsApp:</span> <span class="value">${inquiry.phone}</span></div>
      ${inquiry.email ? `<div class="row"><span class="label">Email:</span> <span class="value">${inquiry.email}</span></div>` : ''}
      <div class="row"><span class="label">Festival Date:</span> <span class="value">${inquiry.festivalDate}</span></div>
      <div class="row"><span class="label">Requirement:</span> <span class="value">${inquiry.requirementType}</span></div>
      ${inquiry.notes ? `<div class="row"><span class="label">Notes:</span> <span class="value">${inquiry.notes}</span></div>` : ''}
      ${inquiry.productName ? `<div class="row"><span class="label">Product:</span> <span class="value">${inquiry.productName}</span></div>` : ''}
      <div class="row"><span class="label">Date Submitted:</span> <span class="value">${new Date(inquiry.createdAt).toLocaleString()}</span></div>
    </div>
  </body>
  </html>
  `;
}
