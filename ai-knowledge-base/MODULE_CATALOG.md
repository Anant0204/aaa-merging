# Complete Module Catalog: AAA IT CRM

**Document ID:** `KB-DOC-004`  
**Module:** Complete Functional Module Inventory  
**Evidence Level:** `CONFIRMED_FROM_CODE` & `CONFIRMED_FROM_READ_ONLY_DATABASE`  

---

## Module Index (22 Discovered Modules)

```
01. Authentication & Session Security         12. Document Vault & Presigned S3 Storage
02. User Administration & Role Hierarchy       13. Marketing Spend & Attribution Analytics
03. Lead Intake, Deduplication & Assignment   14. Real-Time Notification & Alerting Engine
04. Discovery Calls & Calendar Scheduling      15. Background Queues & Asynchronous Workers
05. Client Records & Profile Management       16. AI Executive Briefing & Summarization
06. Commercial Deals & Sales Pipeline          17. Coupons, Discounts & Referral Codes
07. IT Project Delivery & Engineering Ops      18. Audit Logging & System Governance
08. B2B Reputation & Reviews Hub              19. Webhook Ingestion & Anti-Fraud Engine
09. Omnichannel Social Inbox & Messaging       20. Unified Communication History Logs
10. Payments, Invoicing & Multi-Gateways       21. Communication Templates Engine
11. Immigration Case Processing (Legacy)       22. System Customization & Dynamic Settings
```

---

### Module 01: Authentication & Session Security
- **Business Purpose**: Secure user authentication, password hashing, stateless JWT session issuance, and token validation.
- **Allowed Roles**: All roles (`super_admin`, `admin`, `operations`, `marketing`, `consultant`, `finance`, `client`).
- **Frontend Views**: [`Login.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/auth/Login.jsx) (includes 1-click test role switcher), [`ForgotPassword.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/auth/ForgotPassword.jsx), [`ResetPassword.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/auth/ResetPassword.jsx), [`ClientPortalLogin.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/public/ClientPortalLogin.jsx).
- **Backend Routes**: `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`.
- **Controllers & Middlewares**: [`authController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/authController.js), [`authMiddleware.js`](file:///d:/Kiaan/aaa-merging/backend/src/middlewares/authMiddleware.js).
- **Database Models**: `User` (`email`, `password` bcrypt hashed, `role`, `isActive`), `Client` (`password`, `clientCode`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational and tested).

---

### Module 02: User Administration & Role Hierarchy
- **Business Purpose**: Provisioning staff accounts, assigning user roles, setting commission rates, and managing individual credentials.
- **Allowed Roles**: `super_admin`, `admin`.
- **Frontend Views**: [`AdminAgents.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/AdminAgents.jsx), [`SuperAdminAgents.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/SuperAdminAgents.jsx), [`StaffProfile.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/StaffProfile.jsx).
- **Backend Routes**: `GET /api/v1/users`, `POST /api/v1/users`, `GET /api/v1/users/agents`, `PUT /api/v1/users/:id`, `DELETE /api/v1/users/:id`, `PUT /api/v1/users/:id/password`.
- **Controllers**: [`userController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/userController.js).
- **Database Models**: `User` (`id`, `fullName`, `email`, `role`, `hotlineNumber`, `commissionRate`, `customPermissions`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational in live DB: 6 user records exist).

---

### Module 03: Lead Intake, Deduplication & Assignment
- **Business Purpose**: Ingestion of inbound client inquiries from website forms and social channels; Levenshtein distance duplicate detection; automated round-robin assignment to sales representatives.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `marketing`, `consultant` (isolated to own leads).
- **Frontend Views**: [`LandingPage.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/public/LandingPage.jsx), [`LeadSelfFillForm.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/public/LeadSelfFillForm.jsx), [`SuperAdminLeadList.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/leads/SuperAdminLeadList.jsx), [`LeadDetails.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/leads/LeadDetails.jsx).
- **Backend Routes**: `GET/POST /api/v1/leads`, `GET/PUT/DELETE /api/v1/leads/:id`, `POST /api/v1/leads/status`, `POST /api/v1/leads/assign`, `GET /api/v1/leads/find-by-email`, `PATCH /api/v1/leads/:id/meeting-preference`.
- **Controllers & Utils**: [`leadController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/leadController.js), [`fuzzyMatch.js`](file:///d:/Kiaan/aaa-merging/backend/src/utils/fuzzyMatch.js).
- **Database Models**: `Lead` (`firstName`, `lastName`, `email`, `phone`, `companyName`, `dealValue`, `currency`, `serviceType`, `budget`, `status`, `assignedToId`).
- **Verification Status**: `CONFIRMED_FROM_CODE` & `CONFIRMED_FROM_READ_ONLY_DATABASE` (Physical MariaDB table `leads` contains Phase B columns `companyName`, `dealValue`, `currency`, and index `leads_companyName_idx`).

---

### Module 04: Discovery Calls & Calendar Scheduling
- **Business Purpose**: Interactive appointment scheduling between clients and solutions architects; slot collision calculation; consultant re-assignment with audit trail.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`.
- **Frontend Views**: [`AdminCalendarView.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/consultations/AdminCalendarView.jsx), [`SuperAdminCalendarView.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/consultations/SuperAdminCalendarView.jsx), [`AdminConsultationList.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/consultations/AdminConsultationList.jsx).
- **Backend Routes**: `GET/POST /api/v1/consultations`, `PATCH /api/v1/consultations/:id/outcome`, `PATCH /api/v1/consultations/:id/reassign`, `PATCH /api/v1/consultations/:id/respond`.
- **Controllers & Utils**: [`consultationController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/consultationController.js), [`bookingTimeSlots.js`](file:///d:/Kiaan/aaa-merging/frontend/src/utils/bookingTimeSlots.js).
- **Database Models**: `Consultation` (`leadId`, `clientId`, `consultantId`, `date`, `timeSlot`, `status`, `meetingLink`, `zoomMeetingId`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Calendar logic operational; `meetingLink` and `zoomMeetingId` currently set to `null` in code).

---

### Module 05: Client Records & Profile Management
- **Business Purpose**: Transitioning qualified won leads into permanent client accounts; issuing unique client codes (`CID-XXXXX`); managing client document vaults.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`, `client` (self portal).
- **Frontend Views**: [`AdminClientList.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/clients/AdminClientList.jsx), [`AdminClientDetails.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/clients/AdminClientDetails.jsx), [`ClientPortalDocs.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/public/ClientPortalDocs.jsx).
- **Backend Routes**: `GET/POST /api/v1/clients`, `GET/PUT/DELETE /api/v1/clients/:id`, `PATCH /api/v1/clients/:id/status`, `POST /api/v1/clients/:id/credentials`.
- **Controllers**: [`clientController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/clientController.js).
- **Database Models**: `Client` (`clientCode`, `firstName`, `lastName`, `email`, `phone`, `assignedToId`, `status`, `serviceType`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; 2 live records exist in `clients` table).

---

### Module 06: Commercial Deals & Sales Pipeline
- **Business Purpose**: Tracking deal values, currencies, projected revenue, and progression across stages (`New Lead` $\rightarrow$ `Discovery Scheduled` $\rightarrow$ `Proposal Sent` $\rightarrow$ `Negotiation` $\rightarrow$ `Deal Won`).
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`, `marketing`.
- **Frontend Views**: [`SalesPipelineStepper.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/SalesPipelineStepper.jsx), [`DealCommercialsCard.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/DealCommercialsCard.jsx), [`AdminDashboard.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/dashboard/AdminDashboard.jsx).
- **Backend Routes**: `GET /api/v1/dashboard/metrics`, `GET /api/v1/settings/lead-stages`, `PUT /api/v1/settings/lead-stages`.
- **Controllers**: [`dashboardController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/dashboardController.js), [`settingsController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/settingsController.js).
- **Database Models**: `Lead` (`dealValue`, `currency`, `status`, `qualificationData`), `CompanySetting` (`leadStages`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Deal pipeline KPIs are fully database-backed in MariaDB).

---

### Module 07: IT Project Delivery & Engineering Operations
- **Business Purpose**: Managing post-sale software delivery: project provisioning, milestone tracking, sprint task backlogs, engineer time logs, and QA/UAT handover sign-offs.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`.
- **Frontend Views**: *Missing from frontend UI* (no dedicated Project Kanban board in `frontend/src/pages`).
- **Backend Routes**: `GET/POST /api/v1/projects`, `GET/PUT/DELETE /api/v1/projects/:id`, `POST /api/v1/projects/:id/milestones`, `POST /api/v1/projects/:id/tasks`, `POST /api/v1/projects/:id/time-logs`, `POST /api/v1/projects/:id/handovers`.
- **Controllers**: [`projectController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/projectController.js) (620 lines), [`projectRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/projectRoutes.js).
- **Database Models**: `Project`, `ProjectMilestone`, `ProjectTask`, `ProjectTimeLog`, `ProjectHandover`.
- **Verification Status**: `MISSING_IMPLEMENTATION` in physical database (Models exist in `schema.prisma` and Express controller, but physical tables `projects`, `project_milestones`, etc., DO NOT EXIST in MariaDB `aaa-db`).

---

### Module 08: B2B Reputation & Reviews Hub
- **Business Purpose**: Centralized hub aggregating client reviews across Google Business Profile, Clutch.co, Trustpilot, and Meta; sentiment analysis NLP; staff responses; AES-256 encrypted credential storage.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `marketing`.
- **Frontend Views**: [`ReviewsDashboard.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/reviews/ReviewsDashboard.jsx) (complete UI with filters, KPI cards, response dialogs, and provider modals).
- **Backend Routes**: `GET/POST /api/v1/reviews`, `POST /api/v1/reviews/:id/respond`, `PATCH /api/v1/reviews/:id/status`, `GET /api/v1/reviews/stats`, `GET /api/v1/reviews/providers`, `POST /api/v1/reviews/providers/:provider/sync`, `POST /api/v1/reviews/providers/:provider/config`.
- **Controllers & Services**: [`reviewController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/reviewController.js), [`reviewService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/reviewService.js).
- **Database Models**: `Review`, `ReviewProviderConfig`.
- **Verification Status**: `MISSING_IMPLEMENTATION` in physical database (Frontend UI and backend service are complete, but physical tables `reviews` and `review_provider_configs` DO NOT EXIST in MariaDB `aaa-db`).

---

### Module 09: Omnichannel Social Inbox & Messaging
- **Business Purpose**: Real-time bi-directional messaging interface unifying WhatsApp Business, Facebook Messenger, Instagram DMs, Telegram, and Twitter/X direct messages.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`.
- **Frontend Views**: [`SocialInbox.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/SocialInbox.jsx), [`AdminSocialInbox.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/AdminSocialInbox.jsx), [`SuperAdminSocialInbox.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/SuperAdminSocialInbox.jsx).
- **Backend Routes**: `GET /api/v1/social/conversations`, `POST /api/v1/social/messages/send`, `DELETE /api/v1/social/messages/:id`, `DELETE /api/v1/social/conversations/:phone`, `POST /api/v1/social/upload-media`.
- **Controllers & Services**: [`socialController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/socialController.js), [`whatsappService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/whatsappService.js), [`facebookService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/facebookService.js), [`instagramService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/instagramService.js).
- **Database Models**: `CommunicationLog`, `ChatSession`.
- **Verification Status**: `CONFIRMED_FROM_CODE` & `UNVERIFIED` externally (Socket.IO chat UI operates cleanly; dispatches fall back to dry-run/mock until production API keys are supplied).

---

### Module 10: Payments, Invoicing & Multi-Gateways
- **Business Purpose**: Client invoice creation, sequential invoice numbering (`INV-2026-XXXX`), Stripe card checkouts, Tabby and Tamara installment plans, and refund claims.
- **Allowed Roles**: `super_admin`, `admin`, `finance`, `operations`.
- **Frontend Views**: [`PaymentDashboard.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/payments/PaymentDashboard.jsx), [`InvoiceList.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/payments/InvoiceList.jsx), [`InvoiceDetails.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/payments/InvoiceDetails.jsx), [`PaymentSuccess.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/public/PaymentSuccess.jsx).
- **Backend Routes**: `GET/POST /api/v1/payments`, `POST /api/v1/payments/create-checkout-session`, `POST /api/v1/payments/verify-checkout-session`, `GET /api/v1/payments/revenue-analytics`, `GET/POST /api/v1/payments/refunds`.
- **Controllers & Services**: [`paymentController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/paymentController.js), [`paymentService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/paymentService.js), [`tabbyService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/tabbyService.js), [`tamaraService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/tamaraService.js).
- **Database Models**: `Payment`, `RefundRequest`, `DiscountCode`, `CommissionRateHistory`.
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; requires live Stripe keys for production card settlements).

---

### Module 11: Immigration Case Processing (Legacy)
- **Business Purpose**: Legacy module tracking Spanish consulate visa application cycles, refusal notices, resubmission appeals, and sworn Spanish translations.
- **Allowed Roles**: `super_admin`, `admin`, `operations`.
- **Frontend Views**: [`ActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/ActiveCases.jsx), [`AdminActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/AdminActiveCases.jsx), [`ClosedCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/clients/ClosedCases.jsx).
- **Backend Routes**: `GET/POST /api/v1/cases/cycles`, `PATCH /api/v1/cases/cycles/:id`, `GET /api/v1/cases/cycles/:id/checklist`, `POST /api/v1/cases/checklists/item`, `POST /api/v1/cases/cycles/:id/resubmit`.
- **Controllers**: [`caseController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/caseController.js) (1,121 lines).
- **Database Models**: `ApplicationCycle`, `ResubmissionChecklistItem`.
- **Verification Status**: `REPORTED_IN_EXISTING_AUDIT` (Operational, but heavily immigration-specific; targeted for deprecation in favor of Module 07).

---

### Module 12: Document Vault & Presigned S3 Storage
- **Business Purpose**: Secure upload, storage, verification, and retrieval of client NDAs, technical contracts, and architecture diagrams.
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`, `client`.
- **Frontend Views**: [`UploadedDocumentsCard.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/UploadedDocumentsCard.jsx), [`FileUploader.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/FileUploader.jsx), [`SuperAdminStorageBackup.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/documents/SuperAdminStorageBackup.jsx).
- **Backend Routes**: `GET /api/v1/documents`, `POST /api/v1/documents/upload`, `POST /api/v1/documents/upload-batch`, `PATCH /api/v1/documents/:id/verify`.
- **Controllers & Services**: [`documentController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/documentController.js), [`s3Service.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/s3Service.js).
- **Database Models**: `Document` (`clientId`, `name`, `url`, `status`, `category`, `belongsTo`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; presigned S3 URLs or local disk fallback).

---

### Module 13: Marketing Spend & Attribution Analytics
- **Business Purpose**: Tracking advertising expenditures across Google Ads, Meta Ads, TikTok, and LinkedIn; computing Cost-per-Lead (CPL) and Return on Ad Spend (ROAS).
- **Allowed Roles**: `super_admin`, `admin`, `marketing`.
- **Frontend Views**: [`AdminMarketing.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/marketing/AdminMarketing.jsx), [`SuperAdminMarketing.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/marketing/SuperAdminMarketing.jsx).
- **Backend Routes**: `GET /api/v1/marketing/spend`, `POST /api/v1/marketing/spend`.
- **Controllers**: [`marketingController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/marketingController.js).
- **Database Models**: `MarketingSpend` (`platform`, `campaignName`, `amount`, `currency`, `date`).
- **Verification Status**: `CONFIRMED_FROM_CODE`.

---

### Module 14: Real-Time Notification & Alerting Engine
- **Business Purpose**: Bi-directional in-app notifications and push alerts broadcast via Socket.IO rooms (`role:*` and `user:*`) for new leads, payments, and document reviews.
- **Allowed Roles**: All roles.
- **Frontend Views**: Notification Bell Drawer in [`DashboardLayout.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/layouts/DashboardLayout.jsx).
- **Backend Routes**: `GET /api/v1/notifications/my`, `GET /api/v1/notifications/unread-count`, `PATCH /api/v1/notifications/:id/read`, `PATCH /api/v1/notifications/read-all`.
- **Controllers**: [`notificationController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/notificationController.js).
- **Database Models**: `Notification` (`userId`, `role`, `title`, `message`, `type`, `isRead`).
- **Verification Status**: `CONFIRMED_FROM_CODE` & `CONFIRMED_FROM_READ_ONLY_DATABASE` (30 live records exist in `notifications` table).

---

### Module 15: Background Queues & Asynchronous Workers
- **Business Purpose**: Redis-backed BullMQ job processing for incoming webhooks, transactional communications, and dead-letter queue (DLQ) retry handling.
- **Allowed Roles**: Background system service.
- **Backend Infrastructure**: [`queueSetup.js`](file:///d:/Kiaan/aaa-merging/backend/src/queues/queueSetup.js), [`workers.js`](file:///d:/Kiaan/aaa-merging/backend/src/queues/workers.js), [`connection.js`](file:///d:/Kiaan/aaa-merging/backend/src/queues/connection.js).
- **Queues**: `communications`, `reminders`, `no-show-enforcer`, `payment-drip`, `failed-jobs`.
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; graceful fallback to `MockQueue` when `DISABLE_REDIS=true`).

---

### Module 16: AI Executive Briefing & Summarization
- **Business Purpose**: Automated client communication summaries and daily executive briefing using Google Gemini / OpenAI LLM APIs with Redis caching.
- **Allowed Roles**: `super_admin`, `admin`.
- **Frontend Views**: [`AiSummaryModal.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/AiSummaryModal.jsx).
- **Backend Routes**: `GET /api/v1/ai/ceo-brief`, `POST /api/v1/ai/summarize-client`.
- **Controllers**: [`aiController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/aiController.js).
- **Database Models**: `CommunicationLog`, `Client`, `Lead`.
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; requires `GEMINI_API_KEY` or `OPENAI_API_KEY`).

---

### Module 17: Coupons, Discounts & Referral Codes
- **Business Purpose**: Generating percentage or fixed-value discount promo codes for client proposals and checkout sessions.
- **Allowed Roles**: `super_admin`, `admin`, `finance`.
- **Frontend Views**: Integrated in checkout modals.
- **Backend Routes**: `GET/POST /api/v1/coupons`, `POST /api/v1/coupons/validate`, `DELETE /api/v1/coupons/:id`, `DELETE /api/v1/coupons/:id/permanent`.
- **Controllers**: [`couponController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/couponController.js).
- **Database Models**: `DiscountCode` (`code`, `discountPercent`, `isActive`, `createdById`).
- **Verification Status**: `CONFIRMED_FROM_CODE`.

---

### Module 18: Audit Logging & System Governance
- **Business Purpose**: Immutable activity logging tracking sensitive actions (role modifications, fee updates, record deletions, logins).
- **Allowed Roles**: `super_admin`.
- **Backend Routes**: `GET /api/v1/audit-logs`.
- **Controllers & Services**: [`auditLogController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/auditLogController.js), [`auditService.js`](file:///d:/Kiaan/aaa-merging/backend/src/services/auditService.js).
- **Database Models**: `AuditLog` (`action`, `entityType`, `entityId`, `userId`, `details`, `ipAddress`).
- **Verification Status**: `CONFIRMED_FROM_CODE`.

---

### Module 19: Webhook Ingestion & Anti-Fraud Engine
- **Business Purpose**: Secure endpoint ingesting Meta Lead Ads, Twilio WhatsApp callbacks, Stripe events, and device fingerprint fraud checks.
- **Allowed Roles**: Public webhook handlers (authenticated via HMAC signatures).
- **Backend Routes**: `GET/POST /api/v1/webhooks/meta`, `POST /api/v1/webhooks/twilio`, `POST /api/v1/webhooks/stripe`, `GET/POST /api/v1/webhooks/linkedin`, `POST /api/v1/webhooks/telegram`.
- **Controllers**: [`webhookController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/webhookController.js) (1,017 lines).
- **Database Models**: `Lead`, `CommunicationLog`, `Payment`, `BlacklistedClient`.
- **Verification Status**: `CONFIRMED_FROM_CODE` (HMAC signatures and Meta `leadgen` parsers verified).

---

### Module 20: Unified Communication History Logs
- **Business Purpose**: Persistent transcript of all inbound and outbound client touchpoints across channels (email, phone, SMS, WhatsApp, social DMs).
- **Allowed Roles**: `super_admin`, `admin`, `operations`, `consultant`.
- **Frontend Views**: [`CommunicationHistoryTab.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/components/CommunicationHistoryTab.jsx).
- **Backend Routes**: `GET/POST /api/v1/communications`.
- **Controllers**: [`communicationController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/communicationController.js).
- **Database Models**: `CommunicationLog` (`clientId`, `leadId`, `channel`, `direction`, `content`, `messageId`, `deliveryStatus`).
- **Verification Status**: `CONFIRMED_FROM_CODE`.

---

### Module 21: Communication Templates Engine
- **Business Purpose**: Managing approved email bodies, WhatsApp Business templates, and social chat quick replies with dynamic variable interpolation (`{{firstName}}`, `{{companyName}}`).
- **Allowed Roles**: `super_admin`, `admin`.
- **Frontend Views**: Template management modals in Settings.
- **Backend Routes**: `GET/POST /api/v1/templates`, `GET /api/v1/templates/all`, `PUT/DELETE /api/v1/templates/:id`, `GET /api/v1/templates/check-status/:id`.
- **Controllers**: [`templateController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/templateController.js).
- **Database Models**: `Template` (`name`, `channel`, `category`, `subject`, `body`, `variables`, `approvalStatus`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; 2 records exist in `templates` table).

---

### Module 22: System Customization & Dynamic Settings
- **Business Purpose**: Company branding, dynamic role permission matrices, navigation menu visibility, and stage workflows stored in JSON.
- **Allowed Roles**: `super_admin`.
- **Frontend Views**: [`Settings.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/settings/Settings.jsx), [`SuperAdminCustomization.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/settings/SuperAdminCustomization.jsx).
- **Backend Routes**: `GET/PUT /api/v1/settings/customization`, `GET/PUT /api/v1/settings/company`, `GET/PUT /api/v1/settings/lead-stages`, `DELETE /api/v1/settings/purge-all-data`.
- **Controllers**: [`settingsController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/settingsController.js).
- **Database Models**: `CompanySetting` (`companyName`, `leadStages`, `customizationSettings`).
- **Verification Status**: `CONFIRMED_FROM_CODE` (Operational; 1 record in `company_settings` table).

