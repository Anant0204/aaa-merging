# Known Gaps, Architecture Discrepancies & Risk Analysis

**Document ID:** `KB-DOC-013`  
**Module:** System Gaps, Technical Debt & Risk Assessment  
**Evidence Level:** `CONFIRMED_FROM_CODE` & `CONFIRMED_FROM_READ_ONLY_DATABASE`  

---

## 1. Verified Audit Findings & Gap Register

The 9 key findings reported in [`IT_CRM_DEEP_READINESS_AUDIT.md`](file:///C:/Users/Puran/.gemini/antigravity/brain/cf74d72d-ab7f-4595-ab7b-b9928d4b7169/IT_CRM_DEEP_READINESS_AUDIT.md) were independently re-audited and verified against current source code and the live MariaDB database:

```
┌────┬────────────────────────────────────────────────────┬──────────────────────┬─────────────┐
│ #  │ Investigated Finding                               │ Current Code Status  │ Risk Level  │
├────┼────────────────────────────────────────────────────┼──────────────────────┼─────────────┤
│ 1  │ Physical MariaDB Schema Gap for Projects & Reviews │ CONFIRMED UNMIGRATED │ CRITICAL    │
│ 2  │ Operational Delivery Trapped in Immigration Cases  │ CONFIRMED ACTIVE     │ HIGH        │
│ 3  │ Social Inbox Quick Replies Reference Spain Visas   │ CONFIRMED IN 5 FILES │ MEDIUM      │
│ 4  │ Default Role Labels Reference 'Visa Agent'         │ CONFIRMED ACTIVE     │ LOW         │
│ 5  │ Discovery Meeting Links Hardcoded to Null          │ CONFIRMED IN CODE    │ MEDIUM      │
│ 6  │ Third-Party Integrations in Simulation / Dry-Run   │ CONFIRMED IN CODE    │ MEDIUM      │
│ 7  │ Dashboard Controller Swallows Project Query Errors │ CONFIRMED INTENTIONAL│ LOW         │
│ 8  │ Missing Project Delivery Frontend (Kanban Board)   │ CONFIRMED MISSING    │ HIGH        │
│ 9  │ Migration History Not Synced with Prisma CLI       │ CONFIRMED ARCHITECT. │ MEDIUM      │
└────┴────────────────────────────────────────────────────┴──────────────────────┴─────────────┘
```

---

## 2. In-Depth Gap Analysis & Evidence

### Gap 1: Physical MariaDB Gap for IT Projects & Reviews Tables
- **Original Audit Claim**: Models `Project`, `ProjectMilestone`, `ProjectTask`, `ProjectTimeLog`, `ProjectHandover`, `Review`, and `ReviewProviderConfig` exist in Prisma schema, but their physical tables are missing from MariaDB.
- **Current Source Evidence**:
  - [`backend/prisma/schema.prisma:607-844`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L607-L844) defines all 7 models.
  - Read-only inspection of MariaDB `aaa-db` confirmed 23 tables exist; tables `projects`, `project_milestones`, `project_tasks`, `project_time_logs`, `project_handovers`, `reviews`, and `review_provider_configs` **DO NOT EXIST**.
- **Status**: `CONFIRMED_FROM_READ_ONLY_DATABASE` (Active Schema Gap).
- **Technical Impact**: Any HTTP request mutating projects (`POST /api/v1/projects`) or reviews (`POST /api/v1/reviews`) throws a fatal SQL error: `Table 'aaa-db.projects' doesn't exist`.
- **Recommended Action (Non-Destructive Guidance)**: Author an idempotent SQL migration creating the 7 physical tables with foreign keys and add existence checks into `backend/deploy.js`.

---

### Gap 2: Operational Delivery Trapped in Immigration Case Law
- **Original Audit Claim**: Won deals transition to visa application cycles tracking Spanish consulate appeals and sworn translations.
- **Current Source Evidence**:
  - [`frontend/src/pages/team/ActiveCases.jsx:46-78`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/ActiveCases.jsx#L46-L78) displays visa category filters (`visaFilter`) and passport verification states.
  - [`backend/src/controllers/caseController.js:24-60`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/caseController.js#L24-L60) generates default checklist items: *'Passport Copy'*, *'Embassy Rejection Notice'*, *'Proof of Income'*.
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: Internal delivery staff managing won IT contracts have no interface to track software sprints, repository links, or QA handovers; they are presented with Spanish consulate refusal workflows.
- **Recommended Action**: Build an IT Project delivery page (Kanban view) and redirect the `/active-cases` menu pointer to the new Project Delivery view.

---

### Gap 3: Social Inbox Quick-Reply Templates Reference Spain Visas
- **Original Audit Claim**: Customer chat quick replies in the Social Inbox offer Spanish visa services.
- **Current Source Evidence**: Verified across all 5 social inbox components:
  1. [`AdminSocialInbox.jsx:100-101, 358-360`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/AdminSocialInbox.jsx#L100-L101)
  2. [`AgentSocialInbox.jsx:97-98, 330-332`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/AgentSocialInbox.jsx#L97-L98)
  3. [`OperationsSocialInbox.jsx:100-101, 358-360`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/OperationsSocialInbox.jsx#L100-L101)
  4. [`SocialInbox.jsx:86-87, 319-321`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/SocialInbox.jsx#L86-L87)
  5. [`SuperAdminSocialInbox.jsx:104-105, 404-406`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/social/SuperAdminSocialInbox.jsx#L104-L105)
  *Exact Text Found:*  
  `"Welcome to AAA Business Consultancy Services! We’re here to help you with your Spain Visa, Residency & Relocation requirements."`  
  `"To check your full eligibility for Spain Visa & Residency (Digital Nomad, NLV, Golden Visa)..."`
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: If a staff member clicks "Greet" or "Booking Form" while conversing with a B2B IT prospect, an immigration consultation message is sent.
- **Recommended Action**: Update `QUICK_TEMPLATES` in all 5 files to IT software services copy.

---

### Gap 4: Default Role Labels Reference 'Visa Agent'
- **Original Audit Claim**: Staff configuration still uses legal visa job titles.
- **Current Source Evidence**:
  - [`backend/src/controllers/settingsController.js:6`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/settingsController.js#L6):  
    `{ id: 'consultant', label: 'Consultant / Visa Agent' }`
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: UI badges and employee settings pages display "Visa Agent" instead of "Solutions Consultant" or "Account Executive".
- **Recommended Action**: Update `DEFAULT_CUSTOMIZATION.rolesDefinition` in `settingsController.js`.

---

### Gap 5: Discovery Meeting Links Hardcoded to Null
- **Original Audit Claim**: Automated Zoom or Google Meet links are not generated on booking.
- **Current Source Evidence**:
  - [`backend/src/controllers/consultationController.js:257-258`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/consultationController.js#L257-L258):
    ```javascript
    const meetingLink = null;
    const zoomMeetingId = null;
    ```
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: Calendar events and client booking confirmation screens display `meetingLink: null`. Sales representatives must manually create and email meeting URLs.
- **Recommended Action**: Integrate Zoom Server-to-Server OAuth or Google Meet API in `consultationController.js`.

---

### Gap 6: Third-Party Integrations Running in Simulation / Dry-Run
- **Original Audit Claim**: Several external messaging and lead integrations fall back to mock stubs.
- **Current Source Evidence**:
  - Twilio WhatsApp: [`whatsappService.js:55`](file:///d:/Kiaan/aaa-merging/backend/src/services/whatsappService.js#L55) runs in local `DRY-RUN/Sandbox mode` when tokens are missing.
  - Facebook Messenger: [`facebookService.js:30`](file:///d:/Kiaan/aaa-merging/backend/src/services/facebookService.js#L30) runs in simulation stub when `META_PAGE_ACCESS_TOKEN` is unset.
  - LinkedIn: [`linkedinService.js:43`](file:///d:/Kiaan/aaa-merging/backend/src/services/linkedinService.js#L43) returns `{ success: true, isMock: true }`.
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: Outbound messages do not actually transmit over telecom or social networks until production credentials are supplied.
- **Recommended Action**: Input verified external credentials into `.env` once production accounts are provisioned.

---

### Gap 7: Dashboard Swallows Unmigrated Table Errors via `.catch(() => [])`
- **Original Audit Claim**: Dashboard uses catch blocks to prevent crashes on unmigrated tables.
- **Current Source Evidence**:
  - [`backend/src/controllers/dashboardController.js:38-41, 76, 94, 178`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/dashboardController.js#L38-L41):
    ```javascript
    const projects = await prisma.project.findMany({ ... }).catch(err => {
      console.warn('[Dashboard] Project table not migrated or unavailable:', err.message);
      return [];
    });
    const tasks = await prisma.projectTask.findMany({ ... }).catch(() => []);
    const timeLogs = await prisma.projectTimeLog.findMany({ ... }).catch(() => []);
    const reviews = await prisma.review.findMany({ ... }).catch(() => []);
    ```
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: This is an intentional safeguard: the dashboard metrics endpoint returns `200 OK` and renders deal revenue metrics while returning `0` for project and review KPIs. Once tables are migrated, real counts will flow automatically.
- **Recommended Action**: Retain `.catch(() => [])` during table migration, then remove once tables are verified in production.

---

### Gap 8: Missing Project Delivery Frontend (Kanban Board)
- **Original Audit Claim**: No frontend page exists to manage projects, tasks, or sprints.
- **Current Source Evidence**:
  - Search of `frontend/src/pages/` confirmed zero files named `*Project*`.
  - [`frontend/src/services/dbService.js`](file:///d:/Kiaan/aaa-merging/frontend/src/services/dbService.js) contains zero methods calling `/api/v1/projects`.
  - [`frontend/src/routes/AppRoutes.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/routes/AppRoutes.jsx) has no route for `/projects`.
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: Even if the backend tables are migrated, staff have no web interface to interact with the project delivery engine.
- **Recommended Action**: Construct `ProjectList.jsx`, `ProjectKanban.jsx`, and `TaskModal.jsx` in `frontend/src/pages/projects/`.

---

### Gap 9: Migration History Not Synced with Prisma CLI
- **Original Audit Claim**: Prisma CLI migrations are bypassed in favor of `backend/deploy.js`.
- **Current Source Evidence**:
  - `_prisma_migrations` table is absent from MariaDB `aaa-db`.
  - Running `npx prisma migrate deploy` fails or risks schema conflicts.
  - Startup deployment is executed via [`backend/deploy.js`](file:///d:/Kiaan/aaa-merging/backend/deploy.js) using raw SQL `information_schema` queries.
- **Status**: `CONFIRMED_FROM_CODE`.
- **Technical Impact**: Running `prisma migrate dev` or `prisma db push` could overwrite manual SQL tables or cause schema divergence.
- **Recommended Action**: Continue using the proven, idempotent programmatic startup DDL checks in `backend/deploy.js` (Phase B pattern).

