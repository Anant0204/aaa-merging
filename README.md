# 🏛️ AAA Business Consultancy CRM & Legal Relocation Platform

Comprehensive, staff-driven **Leads & Relocation Management System** built for **AAA Business Consultancy LLC**. Specializing in Spain Digital Nomad Visas (DNV), Non-Lucrative Residency (NLV), Golden Visas, Study Visas, Sworn Translations, and end-to-end relocation assistance across Madrid, Barcelona, Valencia, and Malaga.

> **Note on Architecture:** The platform is configured as a streamlined, **Leads-Centric CRM**. Client interactions (document submission, queries, payment links) are handled directly by dedicated consultants via WhatsApp, Email, and Phone. Self-service client logins and non-essential sub-modules (Doc Verification, Finance Dashboards, Refunds & Commissions) have been decommissioned to maintain a clean, frictionless sales and consultation workflow.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features & Modules](#-key-features--modules)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Third-Party Integrations & APIs](#-third-party-integrations--apis)
- [Prerequisites](#-prerequisites)
- [Local Installation & Setup](#-local-installation--setup)
  - [1. Database Setup (XAMPP MySQL / MariaDB)](#1-database-setup-xampp-mysql--mariadb)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Default Login Credentials](#-default-login-credentials)
- [Project Directory Structure](#-project-directory-structure)
- [Troubleshooting & Gotchas](#-troubleshooting--gotchas)

---

## ⚡ Architecture & Tech Stack

```
[ Frontend: React 19 + Vite + Material UI ]
               │
               ▼  REST APIs & Socket.IO (Port 5000)
    [ Backend: Express 5 + Prisma ORM 6 ]
               │
  ┌────────────┼────────────────┬──────────────────┐
  ▼            ▼                ▼                  ▼
[Prisma]    [AWS S3]     [Third Parties]      [Background]
  │         (Documents)  - Stripe / Tabby     - BullMQ
  ▼                      - Zoho (Invoices)    - Redis / Mock
[MySQL]                  - Zoom (Meetings)    - Schedulers
(aaa-db)                 - Twilio / Meta WA   - Socket.IO
                         - Resend / SMTP
                         - OpenAI / Gemini
```

- **Frontend:** React 19, Vite, Material UI (MUI v5/v6), TanStack React Query v5, React Hook Form, Yup, Socket.io-client, Recharts, Lucide / Material Icons.
- **Backend:** Node.js, Express 5, Prisma ORM 6, Socket.IO, BullMQ, Bcrypt, Multer, Unpdf (PDF text word extractor).
- **Database:** MySQL / MariaDB (via Prisma ORM).
- **Cloud & Storage:** AWS S3 (secure document storage).
- **Communication:** Twilio / Meta WhatsApp Business Cloud API, Resend, Nodemailer SMTP.
- **AI Engines:** OpenAI API (Client summary generation) & Google Gemini 1.5 Flash (WhatsApp chatbot).

---

## 🚀 Key Features & Modules

### 1. Lead & Assessment Engine (Core)
- **Multi-channel Ingestion:** Captures leads from Google Ads, Meta Ads (Facebook/Instagram), WhatsApp click-to-chat ads, and landing page forms.
- **Dynamic Slot Availability:** Real-time consultant availability checking based on working hours and time zones (UAE UTC+4 / Spain UTC+1).
- **Automated Video Meetings:** Auto-creates **Zoom Meeting links** upon consultation booking with automated calendar invites.
- **Automated Alerts:** Dual-channel (WhatsApp + Email) booking confirmations, 24h/1h/10m reminders, and reschedule alerts.

### 2. Active & Closed Case Management
- Full lifecycle tracking of Spanish residency applicants across all stages (*New Lead*, *Contacted*, *Consultation Scheduled*, *Under Process*, *Completed*, *Lost*).
- Staff can record case notes, assign cases to dedicated consultants, and track progression milestones.

### 3. Omnichannel Social Inbox
- Unified real-time chat interface powered by Socket.IO.
- Integrates messaging from **WhatsApp**, **Facebook Messenger**, **Instagram DMs**, **LinkedIn**, **Twitter / X**, and **Telegram**.
- AI chatbot fallback (OpenAI / Google Gemini) for automated visa queries, with instant handover to human agents (*Live Agent Mode*).

### 4. Sworn Translation Calculator
- Automated word counting from uploaded PDF documents using `unpdf`.
- Dynamic cost calculation according to Spanish official sworn translation tariffs.

### 5. Marketing & Acquisition Analytics
- Tracks campaign sources, UTM parameters, lead volumes, conversion rates, and agent-wise performance metrics.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Access Scope |
|---|---|
| **Super Admin** | Full platform control, system settings, agent allocations, integrations, audit logs. |
| **Admin** | Daily pipeline monitoring, lead distribution, consultant schedules, marketing oversight. |
| **Consultant / Agent** | Assigned leads, consultation calendar, client interactions, meeting follow-ups. |
| **Operations** | Active case tracking, document collection on behalf of clients, closed case archiving. |
| **Marketing** | Campaign performance, ad spend recording, lead generation metrics. |

---

## 🔌 Third-Party Integrations & APIs

| Service | Category | Required `.env` Keys | Purpose |
|---|---|---|---|
| **Twilio WhatsApp API** | Messaging | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM` | Automated WhatsApp reminders, booking confirmations & chatbot. |
| **Meta Graph API** | Social Inbox | `META_APP_SECRET`, `META_PAGE_ACCESS_TOKEN`, `META_VERIFY_TOKEN` | Facebook Messenger & Instagram DM sync. |
| **Resend API** | Email | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | High-deliverability transactional emails (booking confirmations, drip emails). |
| **Custom SMTP** | Email Fallback | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Secondary email delivery provider. |
| **Stripe API** | Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Debit/Credit cards, Apple Pay, Google Pay payments & webhooks. |
| **Tabby API** | BNPL Payment | `TABBY_PUBLIC_KEY`, `TABBY_SECRET_KEY`, `TABBY_MERCHANT_CODE` | 4 interest-free installment payments for UAE/GCC clients. |
| **Tamara API** | BNPL Payment | `TAMARA_TOKEN` | Split-checkout installment gateway for UAE & Saudi Arabia. |
| **Zoho Invoicing** | Accounting | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_ORGANIZATION_ID`, `ZOHO_REFRESH_TOKEN` | Automated invoice generation and ledger sync. |
| **Zoom Meeting API** | Video Call | `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`, `ZOOM_WEBHOOK_SECRET_TOKEN` | Server-to-Server OAuth for auto-generating consultation meetings. |
| **AWS S3** | Cloud Storage | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME` | Secure cloud storage for client documentation. |
| **OpenAI API** | AI Analysis | `OPENAI_API_KEY` | Client profile summarization and visa eligibility risk assessment. |
| **Google Gemini API** | AI Chatbot | `GEMINI_API_KEY` | Real-time visa enquiry responses on WhatsApp (Gemini 1.5 Flash). |
| **LinkedIn Marketing** | Social Inbox | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_ACCESS_TOKEN`, `LINKEDIN_ORGANIZATION_ID` | Lead Gen forms & LinkedIn Direct Messages. |
| **Twitter / X API** | Social Inbox | `TWITTER_API_KEY`, `TWITTER_API_SECRET`, `TWITTER_BEARER_TOKEN` | Twitter / X Direct Messages. |
| **Telegram Bot API** | Alerts | `TELEGRAM_BOT_TOKEN` | Direct messaging and group notifications. |

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v18.x, v20.x, or v22.x+)
- **XAMPP** (or standalone MySQL / MariaDB on port `3306`)
- **Git**

---

## 🛠️ Local Installation & Setup

### 1. Database Setup (XAMPP MySQL / MariaDB)

1. Open **XAMPP Control Panel** and click **Start** next to **MySQL** (and Apache if using phpMyAdmin).
2. Open your browser at `http://localhost/phpmyadmin/`.
3. Create a new database named **`aaa-db`**:
   ```sql
   CREATE DATABASE `aaa-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Push the schema directly from the backend using Prisma (handles collation compatibility automatically):
   ```bash
   cd backend
   npx prisma db push
   ```
   *This automatically generates all 24 tables in your `aaa-db` database.*

---

### 2. Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Verify or update `backend/.env`:
   ```env
   # Server Configuration
   PORT="5000"
   FRONTEND_URL="http://localhost:5173"

   # Database (XAMPP default)
   DATABASE_URL="mysql://root:@localhost:3306/aaa-db"
   DISABLE_REDIS="true"
   REDIS_URL="redis://default:dummy_password@localhost:6379"

   # Authentication & Security
   JWT_SECRET="your_jwt_secret_key_here"
   JWT_EXPIRES_IN="7d"
   ```

3. Seed default staff accounts:
   ```bash
   node seed.js
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run at [http://localhost:5000](http://localhost:5000).*

---

### 3. Frontend Setup

1. Open a terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Ensure `frontend/.env` has:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will launch at [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Default Login Credentials

All test accounts seeded in the database (`password123`):

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@aaaconsultancy.com` | `password123` |
| **Admin** | `admin@aaaconsultancy.com` | `password123` |
| **Consultant / Agent** | `agent@aaaconsultancy.com` | `password123` |
| **Operations** | `operations@aaaconsultancy.com` | `password123` |
| **Marketing** | `marketing@aaaconsultancy.com` | `password123` |

**Staff Login URL:** [http://localhost:5173/#/login](http://localhost:5173/#/login)

---

## 📂 Project Directory Structure

```text
aaa-merging/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM schema (24 models)
│   ├── src/
│   │   ├── config/               # Database & JWT configurations
│   │   ├── controllers/          # Business logic (leads, auth, social, etc.)
│   │   ├── middlewares/          # JWT authentication & RBAC middleware
│   │   ├── queues/               # BullMQ queues & reminder schedulers
│   │   ├── routes/               # Express REST routes
│   │   ├── services/             # Integrations (Stripe, Zoom, Zoho, Twilio, Resend, AI)
│   │   └── app.js                # Express entrypoint & Socket.IO initialization
│   ├── seed.js                   # Seed script for staff accounts
│   ├── package.json
│   └── .env                      # Backend environment configuration
├── frontend/
│   ├── src/
│   │   ├── assets/               # Brand logos & imagery
│   │   ├── components/           # Reusable UI widgets, cards & modals
│   │   ├── layouts/              # Main dashboard wrapper & sidebar navigation
│   │   ├── pages/
│   │   │   ├── leads/            # Lead lists, filters, and detail cards
│   │   │   ├── consultations/    # Consultation list & booking calendar
│   │   │   ├── team/             # Agent rosters & active/closed cases
│   │   │   ├── social/           # Unified Social Inbox (WhatsApp, IG, FB, etc.)
│   │   │   ├── marketing/        # Marketing spend & campaign analytics
│   │   │   └── public/           # Public booking & landing pages
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Route guarding & redirection rules
│   │   ├── services/
│   │   │   └── dbService.js      # Unified Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env                      # Frontend environment configuration
└── README.md
```

---

## 💡 Troubleshooting & Gotchas

1. **Port Already in Use (`EADDRINUSE: 5000`):**
   ```powershell
   netstat -ano | findstr :5000
   taskkill /F /PID <PID_NUMBER>
   ```

2. **XAMPP MariaDB Collation Error:**
   - Avoid importing dumps containing `utf8mb4_0900_ai_ci` directly into MariaDB 10.4.
   - Always run `npx prisma db push` inside `backend/` to generate 100% MariaDB-compatible tables automatically.

3. **Disabled Redis in Local Development:**
   - In `backend/.env`, set `DISABLE_REDIS="true"` to run BullMQ queues in Mock mode without needing an external Redis server.

4. **Vite API Connection:**
   - Ensure `frontend/.env` points to `http://localhost:5000/api/v1` without a trailing slash. Restart the Vite server (`npm run dev`) after any `.env` edits.

---

© 2026 **AAA Business Consultancy LLC**. Advise • Assist • Achieve.
