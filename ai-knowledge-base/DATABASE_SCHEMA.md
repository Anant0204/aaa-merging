# Database Schema & Data Lifecycle Manual

**Document ID:** `KB-DOC-007`  
**Module:** Prisma ORM & MariaDB Physical Schema  
**Evidence Level:** `CONFIRMED_FROM_CODE` & `CONFIRMED_FROM_READ_ONLY_DATABASE`  

---

## 1. Database Architecture & Physical vs. Prisma Status

- **Database Engine**: MariaDB 10.4.32 (via MySQL protocol on localhost:3306)
- **Database Name**: `aaa-db`
- **ORM**: Prisma ORM 6.4.1 ([`backend/prisma/schema.prisma`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma))
- **Total Prisma Models Defined**: 30 models
- **Total Physical Tables in MariaDB**: 23 tables

### The Physical Schema Gap (CRITICAL DISTINCTION)
A strict, read-only metadata inspection of the live MariaDB database revealed that **exactly 7 models defined in Prisma do not exist as physical tables** on disk:

```
┌─────────────────────────────┬───────────────────────────────┬────────────────────────────┐
│ Prisma Model                │ Target Table Name             │ Physical Status in MariaDB │
├─────────────────────────────┼───────────────────────────────┼────────────────────────────┤
│ 1. Project                  │ `projects`                    │ DOES NOT EXIST (Gap)       │
│ 2. ProjectMilestone         │ `project_milestones`          │ DOES NOT EXIST (Gap)       │
│ 3. ProjectTask              │ `project_tasks`               │ DOES NOT EXIST (Gap)       │
│ 4. ProjectTimeLog           │ `project_time_logs`           │ DOES NOT EXIST (Gap)       │
│ 5. ProjectHandover          │ `project_handovers`           │ DOES NOT EXIST (Gap)       │
│ 6. Review                   │ `reviews`                     │ DOES NOT EXIST (Gap)       │
│ 7. ReviewProviderConfig     │ `review_provider_configs`     │ DOES NOT EXIST (Gap)       │
└─────────────────────────────┴───────────────────────────────┴────────────────────────────┘
```

The 23 existing physical tables: `agent_schedules`, `application_cycles`, `audit_logs`, `blacklisted_clients`, `chat_sessions`, `clients`, `commission_rate_histories`, `communication_logs`, `company_settings`, `consultations`, `discount_codes`, `documents`, `leads`, `marketing_spend`, `notifications`, `payments`, `refund_requests`, `relocation_packages`, `reminder_logs`, `resubmission_checklist_items`, `templates`, `users`, `visa_services`.

Prisma migration history tracking table (`_prisma_migrations`) is not present in MariaDB. Database evolution is handled programmatically on server boot via [`backend/deploy.js`](file:///d:/Kiaan/aaa-merging/backend/deploy.js).

---

## 2. Core Model Specifications

### Model: `Lead` (`leads` table)
*File Reference:* [`backend/prisma/schema.prisma:56-109`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L56-L109)  
Represents an inbound sales prospect or commercial deal inquiry.

| Field Name | Type | Attributes / Constraints | Business Meaning |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key UUID |
| `firstName` | `String` | Required | Contact first name |
| `lastName` | `String` | Required | Contact last name |
| `email` | `String` | Required | Business email address |
| `phone` | `String` | Required | Normalized E.164 phone number |
| `companyName` | `String?` | `@db.VarChar(191)` | **Phase B**: Enterprise organization / business name |
| `dealValue` | `Decimal?`| `@db.Decimal(12, 2)` | **Phase B**: Commercial deal value / quotation amount |
| `currency` | `String` | `@default("USD") @db.VarChar(10)`| **Phase B**: Commercial currency code |
| `serviceType` | `String?` | Optional | IT Domain (e.g. `Custom Software`, `Web & Mobile`, `AI/ML`) |
| `budget` | `String?` | Optional | Budget range bracket (e.g. `$15,000 - $35,000`) |
| `source` | `String?` | Optional | Lead attribution (`Website`, `Meta Leadgen`, `LinkedIn`, `WhatsApp`) |
| `campaignId` | `String?` | Optional | UTM campaign tracking identifier |
| `status` | `String` | `@default("New Lead")` | Sales stage (`New Lead`, `Discovery Scheduled`, `Proposal Sent`, `Deal Won`, `Lost`) |
| `assignedToId`| `String?` | Foreign key $\rightarrow$ `User.id` | Assigned Solutions Consultant / Account Executive |
| `clientId` | `String?` | `@unique` $\rightarrow$ `Client.id` | Foreign key populated when lead converts to client |
| `createdAt` | `DateTime` | `@default(now())` | Timestamp of creation |
| `updatedAt` | `DateTime` | `@updatedAt` | Timestamp of last modification |

**Indexes in MariaDB:**
- `leads_companyName_idx` on `(companyName)` *(Created & verified in Phase B)*
- `leads_assignedToId_idx` on `(assignedToId)`
- `leads_status_idx` on `(status)`

---

### Model: `Project` (`projects` table) *(Unmigrated)*
*File Reference:* [`backend/prisma/schema.prisma:607-654`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L607-L654)  
Represents an active post-sale engineering contract and delivery project.

| Field Name | Type | Attributes / Constraints | Business Meaning |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key UUID |
| `projectCode` | `String` | `@unique` | Human-readable identifier (e.g. `PRJ-2026-001`) |
| `name` | `String` | Required | Project title (e.g. *Enterprise SaaS Platform*) |
| `clientId` | `String` | Foreign key $\rightarrow$ `Client.id` | Target client organization |
| `serviceType` | `String` | Required | IT service vertical |
| `status` | `Enum` | `PLANNING`, `IN_PROGRESS`, `QA_UAT`, `COMPLETED`, `ON_HOLD` | Lifecycle delivery phase |
| `health` | `Enum` | `ON_TRACK`, `AT_RISK`, `DELAYED` | Project health indicator |
| `budget` | `Float?` | Optional | Total project engineering budget |
| `spentBudget` | `Float?` | `@default(0)` | Real-time budget consumed |
| `deadline` | `DateTime?`| Optional | Contractual target delivery date |
| `repositoryUrl`| `String?` | Optional | GitHub/GitLab repository URL |
| `stagingUrl` | `String?` | Optional | Staging / Preview deployment link |
| `projectManagerId` | `String?` | Foreign key $\rightarrow$ `User.id` | Assigned Delivery Lead / Project Manager |

---

### Model: `Review` (`reviews` table) *(Unmigrated)*
*File Reference:* [`backend/prisma/schema.prisma:797-827`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L797-L827)  
Represents a client review collected from external platforms or manually entered.

| Field Name | Type | Attributes / Constraints | Business Meaning |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key UUID |
| `provider` | `Enum` | `GOOGLE`, `META`, `CLUTCH`, `TRUSTPILOT`, `MANUAL` | Review source platform |
| `externalReviewId`| `String?`| Optional | Remote platform review ID |
| `authorName` | `String` | Required | Client reviewer name |
| `rating` | `Int` | 1 to 5 stars | Star rating |
| `reviewText` | `String?` | `@db.Text` | Review feedback content |
| `sentiment` | `Enum` | `POSITIVE`, `NEUTRAL`, `NEGATIVE` | Output of deterministic sentiment classifier |
| `status` | `Enum` | `PUBLISHED`, `HIDDEN`, `FLAGGED` | Moderation visibility state |
| `responseStatus`| `Enum` | `UNRESPONDED`, `RESPONDED`, `NOT_REQUIRED` | Response lifecycle |
| `responseText` | `String?` | `@db.Text` | Official company reply |
| `isDemo` | `Boolean` | `@default(false)` | Distinguishes synthetic demo data from real reviews |

---

### Model: `ReviewProviderConfig` (`review_provider_configs` table) *(Unmigrated)*
*File Reference:* [`backend/prisma/schema.prisma:829-844`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L829-L844)  
Stores third-party review provider credentials securely encrypted at rest.

| Field Name | Type | Attributes / Constraints | Business Meaning |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | Primary key UUID |
| `provider` | `Enum` | `@unique` (`GOOGLE`, `META`, `CLUTCH`, `TRUSTPILOT`) | Provider name |
| `accountIdentifier`| `String?`| Optional | Google Place ID or Clutch profile URL |
| `encryptedApiKey` | `String?` | `@db.Text` | AES-256-GCM encrypted API key |
| `encryptedApiSecret`| `String?`| `@db.Text` | AES-256-GCM encrypted API secret |
| `autoSyncEnabled` | `Boolean` | `@default(false)` | Scheduled background sync toggle |
| `status` | `Enum` | `CONNECTED`, `CONFIG_REQUIRED`, `ERROR`, `MANUAL_ONLY` | Provider connection status |

---

### Model: `User` (`users` table)
*File Reference:* [`backend/prisma/schema.prisma:10-54`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L10-L54)  
Represents an internal employee, manager, or executive user.

| Field Name | Type | Constraints | Business Meaning |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id @default(uuid())` | UUID primary key |
| `email` | `String` | `@unique` | Login email address |
| `password` | `String` | Bcrypt hashed | Password hash |
| `fullName` | `String` | Required | Employee full name |
| `role` | `String` | `@default("consultant")` | `super_admin`, `admin`, `operations`, `marketing`, `consultant`, `finance` |
| `commissionRate`| `Float?` | `@default(0)` | Base sales commission percentage |
| `isActive` | `Boolean`| `@default(true)` | Account activation status |
| `customPermissions`| `Json?` | Optional | Granular override permissions |

---

## 3. Data Lifecycle & Transition Policies

```
             [Public Intake / Ad Webhook]
                          │
                          ▼
             ┌─────────────────────────┐
             │       New Lead          │
             └────────────┬────────────┘
                          │ (Assign Solutions Consultant)
                          ▼
             ┌─────────────────────────┐
             │   Discovery Scheduled   │
             └────────────┬────────────┘
                          │ (Consultant logs outcome & attaches SOW)
                          ▼
             ┌─────────────────────────┐
             │      Proposal Sent      │
             └────────────┬────────────┘
                          │ (Client signs proposal & pays deposit)
                          ▼
             ┌─────────────────────────┐
             │        Deal Won         │
             └────────────┬────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  Client Record   │    │  Project Record  │
    │  (CID-2026-XXXX) │    │  (PRJ-2026-XXX)  │
    └──────────────────┘    └─────────┬────────┘
                                      │
                         (Milestones & Sprints)
                                      ▼
                            ┌──────────────────┐
                            │  Handover / UAT  │
                            └──────────────────┘
```

1. **Lead Conversion**: When a deal reaches `Deal Won`, `leadController.js` and `bookingController.js` trigger creation of a linked `Client` record with unique sequential client code (`CID-XXXXX`).
2. **Phase B Backfill Policy**: Programmed into [`backend/deploy.js:261-279`](file:///d:/Kiaan/aaa-merging/backend/deploy.js#L261-L279). On startup, `companyName` is extracted from legacy JSON `qualificationData` only where `leads.companyName IS NULL`. Non-null fields are never overwritten.
3. **Data Purging**: `DELETE /api/v1/settings/purge-all-data` executes a high-security cascading wipe of transactional tables (`leads`, `consultations`, `payments`, `documents`) while strictly preserving `User` accounts and base configuration.

