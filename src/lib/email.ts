import { Product } from '@/types';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import sgMail from '@sendgrid/mail';

/**
 * Sends an HTML email to the admin using the configured provider.
 * Supports Resend, SendGrid, and generic Nodemailer (SMTP).
 */
export async function sendAdminEmail(subject: string, html: string): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER;
  const to = process.env.EMAIL_TO;
  const from = process.env.EMAIL_FROM;

  if (!provider || !to || !from) {
    console.warn('⚠️ Email not configured. Set EMAIL_PROVIDER, EMAIL_FROM, EMAIL_TO in .env.local');
    return false;
  }

  try {
    if (provider === 'resend') {
      const resend = new Resend(process.env.RESEND_API_KEY || '');
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
    } else if (provider === 'sendgrid') {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
      await sgMail.send({
        to,
        from,
        subject,
        html,
      });
    } else {
      // Nodemailer (SMTP) fallback
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
    }
    console.log(`✅ Email sent [${provider}] to ${to} – ${subject}`);
    return true;
  } catch (e) {
    console.error('❌ Failed to send email:', e);
    return false;
  }
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
      body {font-family: Arial, Helvetica, sans-serif; background:#f9f9f9; margin:0; padding:20px;}
      .container {max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);}
      .header {font-size:24px; font-weight:bold; color:#222222; margin-bottom:10px;}
      .row {margin-bottom:8px;}
      .label {font-weight:bold; color:#555555;}
      .value {color:#333333;}
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
      <div class="row"><span class="label">Featured:</span> <span class="value">${product.featured ? 'Yes' : 'No'}</span></div>
      <div class="row"><span class="label">Description:</span> <span class="value">${product.description}</span></div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Generates a simple responsive HTML email for an inquiry submission.
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
      body {font-family: Arial, Helvetica, sans-serif; background:#f9f9f9; margin:0; padding:20px;}
      .container {max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);}
      .header {font-size:24px; font-weight:bold; color:#222222; margin-bottom:12px;}
      .row {margin-bottom:8px;}
      .label {font-weight:bold; color:#555555;}
      .value {color:#333333;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${title}</div>
      <div class="row"><span class="label">Name:</span> <span class="value">${inquiry.customerName}</span></div>
      <div class="row"><span class="label">Phone:</span> <span class="value">${inquiry.phone}</span></div>
      ${inquiry.email ? `<div class="row"><span class="label">Email:</span> <span class="value">${inquiry.email}</span></div>` : ''}
      <div class="row"><span class="label">Festival Date:</span> <span class="value">${inquiry.festivalDate}</span></div>
      <div class="row"><span class="label">Requirement Type:</span> <span class="value">${inquiry.requirementType}</span></div>
      ${inquiry.notes ? `<div class="row"><span class="label">Notes:</span> <span class="value">${inquiry.notes}</span></div>` : ''}
      ${inquiry.productName ? `<div class="row"><span class="label">Product:</span> <span class="value">${inquiry.productName}</span></div>` : ''}
      <div class="row"><span class="label">Submitted At:</span> <span class="value">${new Date(inquiry.createdAt).toLocaleString()}</span></div>
    </div>
  </body>
  </html>
  `;
}

  


/**
 * Simple responsive HTML email for an order summary.
 */
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}
export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
}
export function orderEmailHtml(order: OrderPayload): string {
  const rows = order.items
    .map(
      (it) => `<tr>
        <td style="padding:4px 8px; border-bottom:1px solid #eaeaea;">${it.name}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eaeaea; text-align:center;">${it.quantity}</td>
        <td style="padding:4px 8px; border-bottom:1px solid #eaeaea; text-align:right;">₹${(it.price * it.quantity).toLocaleString('en-IN')}</td>
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
      body {font-family:Arial,Helvetica,sans-serif;background:#f9f9f9;margin:0;padding:20px;}
      .container {max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
      .header {font-size:24px;font-weight:bold;color:#222;margin-bottom:12px;}
      .summary {margin-top:12px;font-size:16px;color:#333;}
      table {width:100%;border-collapse:collapse;}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">New Order Received</div>
      <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
      <table>
        <thead>
          <tr>
            <th style="text-align:left;padding:4px 8px;">Item</th>
            <th style="text-align:center;padding:4px 8px;">Qty</th>
            <th style="text-align:right;padding:4px 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <div class="summary"><strong>Total:</strong> ₹${order.total.toLocaleString('en-IN')}</div>
    </div>
  </body>
  </html>
  `;
}
