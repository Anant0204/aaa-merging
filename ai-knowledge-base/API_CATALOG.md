# Verified Backend API Catalog: AAA IT CRM

**Document ID:** `KB-DOC-006`  
**Module:** Backend Endpoints & API Contracts  
**Evidence Level:** `CONFIRMED_FROM_CODE`  
**Total Endpoints Discovered & Mapped:** 182  

---

## 1. Authentication & Session Endpoints (`/api/v1/auth`)
*Router File:* [`backend/src/routes/authRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/authRoutes.js) | *Controller:* [`authController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/authController.js)

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Response Status & Shape |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | All | `{ email, password }` | `200 OK`: `{ message, token, user: { id, fullName, email, role } }` |
| `GET` | `/api/v1/auth/me` | Bearer JWT | Authenticated | Headers: `Authorization: Bearer <token>` | `200 OK`: `{ user: { id, fullName, email, role } }` |
| `POST` | `/api/v1/auth/forgot-password` | Public | All | `{ email }` | `200 OK`: `{ message: 'Reset email sent if account exists' }` |
| `POST` | `/api/v1/auth/reset-password` | Public | All | `{ token, newPassword }` | `200 OK`: `{ message: 'Password updated successfully' }` |

---

## 2. Lead Management Endpoints (`/api/v1/leads`)
*Router File:* [`backend/src/routes/leadRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/leadRoutes.js) | *Controller:* [`leadController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/leadController.js)

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Response Status & Shape |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/v1/leads` | Bearer JWT | All staff (Consultants scoped to assigned) | Query: `?status=&serviceId=&search=&todayOnly=` | `200 OK`: Array of Lead objects |
| `POST` | `/api/v1/leads` | Public / Token | All / Web Lead | `{ firstName, lastName, email, phone, companyName, dealValue, currency, serviceType, budget }` | `201 Created`: `{ message, leadId, lead }` |
| `GET` | `/api/v1/leads/:id` | Bearer JWT | Staff | Param: `:id` (UUID) | `200 OK`: Full Lead detail including Phase B fields (`companyName`, `dealValue`, `currency`) |
| `PUT` | `/api/v1/leads/:id` | Bearer JWT | Staff (Consultants can only update assigned) | Param: `:id`, Body: Destructures Phase B fields (`companyName`, `dealValue`, `currency`, etc.) | `200 OK`: Updated Lead object |
| `DELETE` | `/api/v1/leads/:id` | Bearer JWT | `admin`, `super_admin` | Param: `:id` | `200 OK`: `{ message: 'Lead deleted successfully' }` |
| `POST` | `/api/v1/leads/status` | Bearer JWT | Staff | `{ leadId, status }` | `200 OK`: `{ success: true, lead }` |
| `POST` | `/api/v1/leads/assign` | Bearer JWT | `admin`, `super_admin`, `operations` | `{ leadId, agentId }` | `200 OK`: `{ success: true, message: 'Consultant assigned' }` |
| `GET` | `/api/v1/leads/find-by-email`| Public | All | Query: `?email=name@example.com` | `200 OK`: Sanitized Lead object for self-fill form |
| `PATCH`| `/api/v1/leads/:id/meeting-preference` | Public / Token | All | `{ meetingPreferredDate, meetingPreferredTime, meetingPreferredLanguage, meetingNotes }` | `200 OK`: `{ success: true, lead }` |
| `GET` | `/api/v1/leads/:id/public-details` | Public | All | Param: `:id` | `200 OK`: Public safe lead info |

---

## 3. IT Project Delivery Endpoints (`/api/v1/projects`)
*Router File:* [`backend/src/routes/projectRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/projectRoutes.js) | *Controller:* [`projectController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/projectController.js)  
*(Note: Controller and routes are fully implemented; physical tables currently unmigrated in MariaDB)*

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/v1/projects` | Bearer JWT | All staff (PM/Ops scoped) | Query: `?status=&health=&clientId=&search=` | List projects with milestone & task counts |
| `POST` | `/api/v1/projects` | Bearer JWT | `admin`, `super_admin`, `consultant`, `operations` | `{ name, clientId, serviceType, budget, deadline, projectManagerId, techStack }` | Provisions new project (`PRJ-2026-XXX`) |
| `GET` | `/api/v1/projects/:id` | Bearer JWT | Staff | Param: `:id` | Get project with milestones, tasks, and time logs |
| `PUT` | `/api/v1/projects/:id` | Bearer JWT | `admin`, `super_admin`, `consultant`, `operations` | `{ name, status, health, spentBudget, repositoryUrl, stagingUrl }` | Updates project metadata |
| `DELETE` | `/api/v1/projects/:id`| Bearer JWT | `admin`, `super_admin` | Param: `:id` | Soft or hard deletion |
| `POST` | `/api/v1/projects/:id/milestones` | Bearer JWT | `admin`, `super_admin`, `consultant`, `operations` | `{ title, targetDate, deliverables, invoicePercentage }` | Creates project milestone / sprint |
| `PUT` | `/api/v1/projects/:id/milestones/:milestoneId` | Bearer JWT | `admin`, `super_admin`, `consultant`, `operations` | `{ status: 'COMPLETED', completedAt }` | Marks milestone delivered |
| `DELETE`| `/api/v1/projects/:id/milestones/:milestoneId` | Bearer JWT | `admin`, `super_admin` | Param: `:milestoneId` | Deletes milestone |
| `POST` | `/api/v1/projects/:id/tasks` | Bearer JWT | Authenticated | `{ title, priority, assignedToId, estimatedHours, milestoneId }` | Adds sprint task (`TODO`, `IN_PROGRESS`, etc.) |
| `PUT` | `/api/v1/projects/:id/tasks/:taskId` | Bearer JWT | Authenticated | `{ status, actualHours, blockers }` | Updates task status |
| `DELETE`| `/api/v1/projects/:id/tasks/:taskId` | Bearer JWT | Staff | Param: `:taskId` | Deletes task |
| `POST` | `/api/v1/projects/:id/time-logs` | Bearer JWT | Authenticated | `{ taskId, hours, description, workDate }` | Logs engineer time against project |
| `DELETE`| `/api/v1/projects/:id/time-logs/:logId` | Bearer JWT | Authenticated | Param: `:logId` | Deletes time log entry |
| `POST` | `/api/v1/projects/:id/handovers` | Bearer JWT | `admin`, `super_admin`, `operations` | `{ stagingSignOffUrl, productionUrl, credentialsVaultId, clientSignOffName }` | Final project handover sign-off |
| `PATCH` | `/api/v1/projects/:id/handovers/:handoverId/signoff` | Bearer JWT | Client / PM | `{ clientSignature, signOffNotes }` | Client signs off project delivery |

---

## 4. Reviews & Reputation Endpoints (`/api/v1/reviews`)
*Router File:* [`backend/src/routes/reviewRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/reviewRoutes.js) | *Controller:* [`reviewController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/reviewController.js)  
*(Note: Controller and service are fully implemented; physical tables currently unmigrated in MariaDB)*

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/v1/reviews` | Bearer JWT | All staff | Query: `?page=1&limit=20&provider=GOOGLE&rating=5&sentiment=POSITIVE` | Paginated reviews with sentiment filtering |
| `POST` | `/api/v1/reviews` | Bearer JWT | `admin`, `super_admin`, `operations`, `marketing` | `{ provider: 'CLUTCH', authorName, rating, reviewText, externalReviewId }` | Ingests client review (manual or verified) |
| `POST` | `/api/v1/reviews/:id/respond` | Bearer JWT | `admin`, `super_admin`, `operations`, `marketing` | Param: `:id`, Body: `{ responseText }` | Submits official response to review |
| `PATCH` | `/api/v1/reviews/:id/status` | Bearer JWT | `admin`, `super_admin` | `{ status: 'PUBLISHED' \| 'HIDDEN' \| 'FLAGGED' }` | Moderation status toggle |
| `GET` | `/api/v1/reviews/stats` | Bearer JWT | All staff | Query: `?includeDemo=true` | Aggregates average rating, sentiment % |
| `GET` | `/api/v1/reviews/providers` | Bearer JWT | All staff | None | Returns Google, Meta, Clutch, Trustpilot status |
| `POST` | `/api/v1/reviews/providers/:provider/sync` | Bearer JWT | `admin`, `super_admin`, `marketing` | Param: `:provider` (`GOOGLE`, `TRUSTPILOT`) | Triggers automated provider sync |
| `POST` | `/api/v1/reviews/providers/:provider/config` | Bearer JWT | `admin`, `super_admin` | `{ apiKey, apiSecret, accountIdentifier, autoSyncEnabled }` | Encrypts credentials via AES-256-GCM |

---

## 5. Omnichannel Social Inbox Endpoints (`/api/v1/social`)
*Router File:* [`backend/src/routes/socialRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/socialRoutes.js) | *Controller:* [`socialController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/socialController.js)

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/v1/social/conversations` | Bearer JWT | Staff | None | Returns active multi-channel contact threads |
| `POST` | `/api/v1/social/messages/send` | Bearer JWT | Staff | `{ phone, channel: 'WHATSAPP' \| 'FACEBOOK' \| 'INSTAGRAM' \| 'TELEGRAM', text, mediaUrl }` | Dispatches outbound message via channel service |
| `GET` | `/api/v1/social/messages/:phone` | Bearer JWT | Staff | Param: `:phone` | Retrieves conversation transcript |
| `DELETE`| `/api/v1/social/messages/:id` | Bearer JWT | `admin`, `super_admin` | Param: `:id` | Deletes single chat message |
| `DELETE`| `/api/v1/social/conversations/:phone` | Bearer JWT | `admin`, `super_admin` | Param: `:phone` | Clears conversation thread |
| `POST` | `/api/v1/social/upload-media` | Bearer JWT | Staff | Multipart: `file` | Uploads chat attachment to S3/disk |
| `POST` | `/api/v1/social/link-lead` | Bearer JWT | Staff | `{ phone, leadId }` | Associates social chat thread with Lead |

---

## 6. Payments & Invoicing Endpoints (`/api/v1/payments`)
*Router File:* [`backend/src/routes/paymentRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/paymentRoutes.js) | *Controller:* [`paymentController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/paymentController.js)

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Request Body / Parameters | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/api/v1/payments` | Bearer JWT | Staff / Client (scoped) | None | Lists invoices and payment records |
| `POST` | `/api/v1/payments` | Bearer JWT | `admin`, `super_admin`, `finance` | `{ clientId, amount, packageType, invoiceNumber, dueDate }` | Generates new client invoice |
| `POST` | `/api/v1/payments/create-checkout-session` | Public / Token | All | `{ amount, paymentMethod: 'card' \| 'tabby' \| 'tamara', clientId, couponCode }` | Generates Stripe Checkout Session URL |
| `POST` | `/api/v1/payments/verify-checkout-session` | Public / Token | All | `{ sessionId, paymentId }` | Verifies checkout completion |
| `GET` | `/api/v1/payments/revenue-analytics` | Bearer JWT | `admin`, `super_admin`, `finance` | Query: `?startDate=&endDate=&consultantId=` | Revenue breakdown, payments collected |
| `GET` | `/api/v1/payments/refunds` | Bearer JWT | `admin`, `super_admin`, `finance` | None | Lists client refund and guarantee claims |
| `POST` | `/api/v1/payments/refunds` | Bearer JWT | Staff / Client | `{ paymentId, amount, refundReason }` | Submits refund request |
| `PATCH` | `/api/v1/payments/refunds/:id/status` | Bearer JWT | `admin`, `super_admin`, `finance` | `{ status: 'APPROVED' \| 'REJECTED', transactionRef }` | Processes refund claim |

---

## 7. Webhook Endpoints (`/api/v1/webhooks`)
*Router File:* [`backend/src/routes/webhookRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/webhookRoutes.js) | *Controller:* [`webhookController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/webhookController.js)

| Method | Endpoint Path | Auth Requirement | Verification | Description |
| :--- | :--- | :---: | :--- | :--- |
| `GET` | `/api/v1/webhooks/meta` | Public | Verify Token (`hub.verify_token`) | Responds with `hub.challenge` for Meta setup |
| `POST` | `/api/v1/webhooks/meta` | Public | HMAC SHA-256 (`x-hub-signature-256`) | Ingests Meta Lead Ads (`leadgen`) & FB/IG Messenger DMs |
| `POST` | `/api/v1/webhooks/twilio` | Public | Twilio Signature | Ingests inbound WhatsApp messages from Twilio |
| `POST` | `/api/v1/webhooks/stripe` | Public | Stripe Webhook Secret (`stripe-signature`) | Ingests `checkout.session.completed` events |
| `GET` | `/api/v1/webhooks/linkedin` | Public | LinkedIn Challenge Token | Verification handshake for LinkedIn webhook |
| `POST` | `/api/v1/webhooks/linkedin` | Public | LinkedIn Signature | Ingests LinkedIn Lead Gen Form submissions |
| `POST` | `/api/v1/webhooks/telegram` | Public | Telegram Secret Token | Ingests inbound Telegram Bot commands |
| `POST` | `/api/v1/webhooks/tiktok` | Public | TikTok Signature | Ingests TikTok Lead Form webhooks |

---

## 8. Dashboard Analytics Endpoints (`/api/v1/dashboard`)
*Router File:* [`backend/src/routes/dashboardRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/dashboardRoutes.js) | *Controller:* [`dashboardController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/dashboardController.js)

| Method | Endpoint Path | Auth Requirement | Allowed Roles | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/v1/dashboard/metrics` | Bearer JWT | All staff (Role scoped) | Computes `openPipelineValue`, `wonContractValue`, `averageDealSize`, project counts, task burndown, review ratings. Gracefully degrades over unmigrated tables. |
| `GET` | `/api/v1/dashboard/health` | Public | All | System health check |

