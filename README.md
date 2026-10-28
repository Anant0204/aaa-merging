# 🏛️ AAA Business Consultancy CRM & Relocation Platform

Comprehensive end-to-end CRM, Client Portal, and Legal Relocation Management System built for **AAA Business Consultancy LLC**. Specializing in Spain Digital Nomad Visas (DNV), Non-Lucrative Residency (NLV), Golden Visas, Study Visas, Sworn Translations, and administrative relocation assistance across Madrid, Barcelona, Valencia, and Malaga.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features & Modules](#-key-features--modules)
- [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
- [Prerequisites](#-prerequisites)
- [Local Installation & Setup](#-local-installation--setup)
  - [1. Database Setup (MySQL / MariaDB)](#1-database-setup-mysql--mariadb)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Default Login Credentials](#-default-login-credentials)
- [Integrations](#-integrations)
- [Project Directory Structure](#-project-directory-structure)
- [Troubleshooting & Gotchas](#-troubleshooting--gotchas)

---

## ⚡ Architecture & Tech Stack

```
[ Frontend: React 18 + Vite + MUI ]
               │
               ▼  REST APIs & Socket.IO (Port 5000)
    [ Backend: Express + Prisma ORM ]
               │
  ┌────────────┼────────────────┬──────────────────┐
  ▼            ▼                ▼                  ▼
[Prisma]    [AWS S3]     [Third Parties]      [Background]
  │         (Documents)  - Stripe (Payments)  - BullMQ
  ▼                      - Zoho (Invoicing)   - Redis / Mock
[MySQL]                  - Zoom (Meetings)    - Schedulers
(aaa-db)                 - Twilio (WhatsApp)
                         - Resend/SMTP (Mail)
```

- **Frontend:** React 18, Vite, Material UI (MUI v5), TanStack React Query v5, React Hook Form, Yup, Socket.io-client, Recharts, Lucide Icons.
- **Backend:** Node.js, Express 5, Prisma ORM 6, Socket.io, BullMQ, Bcrypt, Multer, Unpdf (PDF text word counter).
- **Database:** MySQL / MariaDB (via Prisma ORM).
- **Cloud & Storage:** AWS S3 (secure pre-signed document storage).
- **Communication:** Twilio / Meta WhatsApp Business Graph API, Resend, Nodemailer SMTP.

---

## 🚀 Key Features & Modules

### 1. Lead & Assessment Engine
- Capture leads from Google Ads, Meta Ads, WhatsApp Click Ads, and public landing pages.
- Dynamic slot availability calculation synchronized with consultant working hours.
- Automatic **Zoom Meeting link generation** and instant calendar invitations.
- Multi-channel booking confirmations via automated WhatsApp and Email templates.

### 2. Client Portal & Document Verification
- Password-protected portal for active clients (`/#/portal/login`).
- Document checklist (Passports, Criminal Records, Bank Statements, NIE, Insurance).
- Direct file uploads to AWS S3 with mime-type validation and audit logging.
- Operations review workflow: *Verified*, *Rejected*, *Re-upload Requested*.

### 3. Sworn Translation Engine
- Instant PDF word extraction (`unpdf`) and dynamic pricing calculation based on word counts.
- Quotation generation and integrated Stripe checkout for translation payments.

### 4. Application & Resubmission Management
- Full lifecycle tracking of Spanish residency applications.
- Legal appeal and resubmission tracking (appeal deadlines, lawyer assignment, submission receipts).

### 5. Finance, Payments & Invoicing
- **Stripe Elements & Payment Intents** for booking fees, package payments, and translation invoices.
- **Zoho Invoice Sync:** Automatic creation of customers, itemized invoices, and payment receipts.
- **Commission Management Hub:** Dynamic agent commission tracking (fixed or percentage-based) with payout auditing.
- Refund and dispute handling workflows.

### 6. Anti-Fraud & Security
- Device and browser fingerprinting (FingerprintJS) to prevent duplicate free consultations and fraudulent bookings.
- Blacklisted client detection and rate-limiting safeguards.

---

## 👥 Role-Based Access Control (RBAC)

| Role | Access Scope |
|---|---|
| **Super Admin** | Full platform authority, financial analytics, audit logs, team user management, system configurations. |
| **Admin** | Lead allocation, daily pipeline monitoring, consultant performance tracking, reporting. |
| **Consultant / Agent** | Assigned leads, Zoom assessments, meeting notes, client qualification, personal commission ledger. |
| **Operations** | Document verification, translation pipelines, application submissions, appeal cycles. |
| **Finance** | Stripe transactions, Zoho invoices, refunds, consultant payouts, billing dashboards. |
| **Marketing** | Campaign tracking, lead sources, ad spend recording, cost-per-acquisition (CPA) analytics. |
| **Client** | Self-service document uploading, case progress tracking, invoice downloads. |

---

## 📋 Prerequisites

Before starting, make sure you have:
- **Node.js** (v18.x or v20.x+)
- **MySQL / MariaDB** (e.g. XAMPP, WAMP, or standalone MySQL server running on port 3306)
- **Git**

---

## 🛠️ Local Installation & Setup

### 1. Database Setup (MySQL / MariaDB)

1. Start your MySQL service (e.g., click **Start** on Apache and MySQL in XAMPP).
2. Open phpMyAdmin (`http://localhost/phpmyadmin`) or MySQL terminal.
3. Create the database:
   ```sql
   CREATE DATABASE `aaa-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Import the provided schema & data dump (`AAA-db-PR-creation-20-aug.sql`).
   > **Note for MariaDB (XAMPP):** The dump uses `utf8mb4_unicode_ci`. Ensure `max_allowed_packet` is at least `64M` in your `my.ini` for large insert packets.

---

### 2. Backend Setup

1. Open a terminal in `backend/`:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `backend/.env`:
   ```env
   # Server Configuration
   PORT="5000"
   FRONTEND_URL="http://localhost:5173"

   # Database (Local XAMPP default)
   DATABASE_URL="mysql://root:@localhost:3306/aaa-db"
   DISABLE_REDIS="true"

   # Authentication & Security
   JWT_SECRET="your_secure_jwt_secret_key"
   JWT_EXPIRES_IN="7d"

   # AWS S3 Storage (Optional for local test)
   AWS_ACCESS_KEY_ID="your_aws_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret"
   AWS_REGION="eu-west-1"
   AWS_BUCKET_NAME="aaa-consultancy-docs"

   # Zoom Integration
   ZOOM_ACCOUNT_ID="your_zoom_account_id"
   ZOOM_CLIENT_ID="your_zoom_client_id"
   ZOOM_CLIENT_SECRET="your_zoom_client_secret"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

4. Seed default test accounts:
   ```bash
   node seed.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run on [http://localhost:5000](http://localhost:5000).*

---

### 3. Frontend Setup

1. Open a separate terminal in `frontend/`:
   ```bash
   cd frontend
   npm install
   ```

2. Configure environment variables in `frontend/.env`:
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

All test accounts seeded in the database:

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `aaabusinessconsultancy@gmail.com` | `123456` |
| **Super Admin (Seed)** | `superadmin@aaaconsultancy.com` | `password123` |
| **Admin** | `admin@aaaconsultancy.com` | `password123` |
| **Consultant / Agent** | `agent@aaaconsultancy.com` | `password123` |
| **Operations** | `operations@aaaconsultancy.com` | `password123` |
| **Finance** | `finance@aaaconsultancy.com` | `password123` |
| **Marketing** | `marketing@aaaconsultancy.com` | `password123` |

Portal Login URL: [http://localhost:5173/#/login](http://localhost:5173/#/login)

---

## 🔌 Integrations

| Provider | Purpose | Status / Mode |
|---|---|---|
| **Stripe** | Credit/Debit Card payments, consultation deposits, translation invoices. | Live / Test API Keys supported. |
| **Zoho Invoicing** | Auto-invoicing, tax compliance, and client ledger synchronization. | OAuth 2.0 Client credentials. |
| **Zoom API** | Server-to-Server OAuth for generating automatic consultation rooms. | Configurable via `.env`. |
| **Twilio / Meta** | Instant WhatsApp booking notifications and reminder alerts. | Sandbox & Production modes. |
| **Resend / SMTP** | Transactional emails, booking links, and password resets. | Dual-provider support with fallback. |
| **AWS S3** | Secure, scalable storage for passports, contracts, and legal evidence. | S3 Presigned URLs. |

---

## 📂 Project Directory Structure

```text
aaa-merging/
├── AAA-db-PR-creation-20-aug.sql  # Complete database dump
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma ORM schema definition
│   ├── src/
│   │   ├── config/               # Prisma client & DB configurations
│   │   ├── controllers/          # Business logic handlers (auth, leads, cases, etc.)
│   │   ├── middlewares/          # JWT auth & RBAC authorization
│   │   ├── queues/               # BullMQ queue jobs & workers
│   │   ├── routes/               # API endpoint definitions
│   │   ├── services/             # Third-party wrappers (Stripe, Zoom, Zoho, etc.)
│   │   └── app.js                # Express app initialization & Socket.IO server
│   ├── seed.js                   # Database seed script for default users
│   ├── package.json
│   └── .env                      # Backend environment config
├── frontend/
│   ├── src/
│   │   ├── assets/               # Branding, logos, and images
│   │   ├── components/           # Reusable UI cards, tables, and modal components
│   │   ├── layouts/              # Main dashboard wrapper & sidebar navigation
│   │   ├── pages/
│   │   │   ├── leads/            # Role-specific lead views & management
│   │   │   ├── clients/          # Client listing & profile cards
│   │   │   ├── documents/        # Document verification dashboards
│   │   │   ├── payments/         # Payment gateways, commissions, refunds
│   │   │   ├── social/           # Social inbox & omnichannel messaging
│   │   │   └── public/           # Client portal & booking landing pages
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Route guarding & navigation rules
│   │   ├── services/
│   │   │   └── dbService.js      # Unified Axios/Fetch API layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env                      # Frontend environment config
└── README.md
```

---

## 💡 Troubleshooting & Gotchas

1. **Backend Port in Use (`EADDRINUSE: 5000`)**
   - If port 5000 is occupied by an orphaned node process, run:
     ```powershell
     netstat -ano | findstr :5000
     taskkill /F /PID <PID_NUMBER>
     ```

2. **MySQL "Server has gone away" during SQL import:**
   - In XAMPP MariaDB, open `C:\xampp\mysql\bin\my.ini` and set `max_allowed_packet = 128M` under both `[mysqld]` and `[mysql]`.

3. **Collation Errors (`Unknown collation: 'utf8mb4_0900_ai_ci'`):**
   - MariaDB 10.4 does not support MySQL 9's `utf8mb4_0900_ai_ci`. Always use `utf8mb4_unicode_ci` or `utf8mb4_general_ci`.

4. **Vite API Connection:**
   - Make sure `frontend/.env` has `VITE_API_URL=http://localhost:5000/api/v1` without trailing slashes or accidental characters. Restart Vite (`npm run dev`) after changing `.env`.

---

© 2026 **AAA Business Consultancy LLC**. Advise • Assist • Achieve.
