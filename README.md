# 🎆 Sri Vijaya Fireworks - Business Management Web Application

A full-stack, legally-compliant web application for managing an authorized Indian fireworks business. Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL & Storage)**.

---

## ⚖️ Legal & Regulatory Compliance Framework

This web application is strictly designed in compliance with the **Hon'ble Supreme Court of India** rulings (Writ Petition Civil No. 728/2015 and related directives) and circulars issued by the **Petroleum and Explosives Safety Organisation (PESO)** under the **Indian Explosives Act & Explosives Rules**:

1. **Strict Prohibition on Online Sales**: Firecrackers **cannot** be sold via online e-commerce shopping carts, online payment gateways, or delivered via postal/courier/door-to-door services.
2. **Informational Digital Catalogue**: This web application functions exclusively as a **digital price guide, showcase, and store guide** for walk-in retail customers.
3. **In-Person Store Handover**: All product inspections, payments, and handovers take place strictly at the registered physical retail premises.
4. **CSIR-NEERI Certified Green Crackers**: The catalogue highlights certified green cracker formulations (SWAS, STAR, SAFAL) featuring tamper-evident QR verification codes.
5. **Permitted Store Visit Reservations**: Customers can submit an informational visit reservation to inquire about stock availability before visiting the showroom.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Server Actions, API Routes)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS (Festive Midnight Glow theme)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **Image Storage**: Supabase Storage (`fireworks-products` bucket)
- **Authentication**: Cryptographically verified HTTP-only admin session cookies
- **Mobile Notifications**: Meta WhatsApp Business Cloud API with local dev mock fallback
- **Icons**: Lucide React

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` (tested on Node v24)
- npm `v9+` or `v11+`

### 2. Installation
```bash
git clone <repository-url>
cd fireworks-business-app
npm install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Default development administrator credentials:
- **Username**: `admin`
- **Password**: `SriVijaya@2026!`

### 4. Run Development Server
```bash
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Supabase PostgreSQL & Storage Setup

### Step 1: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account.
2. Click **New Project** and name it `fireworks-business-db`.
3. Choose your database region (e.g., `South Asia (Mumbai)` for optimal low latency in India).

### Step 2: Run the SQL Schema & Seed Migration
1. In the Supabase Dashboard, click on the **SQL Editor** icon in the left navigation.
2. Open the file `supabase/migrations/20261027_initial_schema.sql` from this repository.
3. Copy the entire contents, paste into the SQL Editor, and click **Run**.
4. Next, copy the contents of `supabase/migrations/20261027_seed_data.sql`, paste into the SQL Editor, and click **Run** to load 11 sample certified fireworks items.

### Step 3: Create the Storage Bucket for Product Images
1. In Supabase Dashboard, click on **Storage** -> **Create new bucket**.
2. Name the bucket: `fireworks-products`.
3. Check the **Public bucket** toggle.
4. Click **Save**.

### Step 4: Configure Environment Variables
In your Supabase project:
1. Navigate to **Project Settings** -> **API**.
2. Copy the **Project URL**, the **anon public key**, and the **service_role secret key**.
3. Add them to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 📱 WhatsApp Business Cloud API Setup

When a customer submits a store visit reservation, the system automatically alerts the store owner on their mobile phone.

### Meta WhatsApp Cloud API Configuration
1. Register as a developer on [developers.facebook.com](https://developers.facebook.com).
2. Create an App of type **Business**.
3. Under App Dashboard, add the **WhatsApp** product.
4. Copy your **Temporary Access Token** (or generate a Permanent System User Token) and **Phone Number ID**.
5. Update `.env.local`:
```env
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
BUSINESS_OWNER_PHONE=+919840012345
```
*Note: If these variables are not configured, the application automatically uses the built-in development logger and outputs formatted alert payloads to the console.*

---

## 🔐 Administrator Dashboard Features (`/admin`)

Access the portal at `http://localhost:3000/admin`:
- **Overview**: Real-time KPI counts (active items, low stock warnings, pending customer visits).
- **Product Management**: Add, edit, upload photos, set counter rates, toggle CSIR-NEERI green cracker status, and active/hidden visibility.
- **Inventory & Stock Manager**: Instant one-click sales deductions (-1, -5) and batch restock entries (+10, +50) with movement audit logs.
- **Inquiry Management**: View customer reservations, update statuses (*Pending*, *Contacted*, *Store Visited*, *Completed*), and trigger one-click WhatsApp chats with pre-filled greetings.
- **Activity Logs**: Immutable audit log of all system changes.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub:
```bash
git add .
git commit -m "feat: complete fireworks business web application"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```
2. Go to [vercel.com](https://vercel.com) and import your GitHub repository.
3. In the Vercel project configuration, add all environment variables from `.env.example`.
4. Click **Deploy**.

---

## 🛡️ Security Guidelines

- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `WHATSAPP_ACCESS_TOKEN` on the browser.
- `.env` files are excluded from Git via `.gitignore`.
- Image uploads are strictly validated on the server for MIME type (JPEG, PNG, WebP) and size (<= 5MB).
- Row Level Security (RLS) restricts public access to read-only for active items, and requires service credentials for admin mutations.
