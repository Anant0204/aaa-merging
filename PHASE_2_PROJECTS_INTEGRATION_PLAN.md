# PHASE 2 — AAA IT COMPANY CRM Projects Module & Navigation Integration Plan

**Document:** `PHASE_2_PROJECTS_INTEGRATION_PLAN.md`  
**Target Root:** `d:\Kiaan\aaa-merging`  
**Execution Mode:** STRICT READ-ONLY PLANNING (No code, database, or Git mutations executed)  
**Prerequisite Verification:** Phase 1 Security Fixes (`SEC-01`, `SEC-02`) verified active and intact.

---

## 1. Current Frontend & Backend Architecture Findings

### A. Backend IT Projects Infrastructure (Implemented but Disconnected)
- **Mount Point:** Mounted in [`backend/src/app.js:91`](file:///d:/Kiaan/aaa-merging/backend/src/app.js#L91) via `app.use('/api/v1/projects', require('./routes/projectRoutes'));`.
- **Route Definitions:** Registered in [`backend/src/routes/projectRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/projectRoutes.js) with 14 distinct REST endpoints covering projects, milestones, tasks, time logs, and handovers.
- **Controller Implementation:** Implemented in [`backend/src/controllers/projectController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/projectController.js) (620 lines) supporting filtering, search, metrics aggregation (hours logged, completion rates), and automated status transitions.
- **Database Schema:** Defined in [`backend/prisma/schema.prisma:607-757`](file:///d:/Kiaan/aaa-merging/backend/prisma/schema.prisma#L607-L757) across 5 relational models:
  - `Project` (Mapped to table `projects`)
  - `ProjectMilestone` (Mapped to table `project_milestones`)
  - `ProjectTask` (Mapped to table `project_tasks`)
  - `ProjectTimeLog` (Mapped to table `project_time_logs`)
  - `ProjectHandover` (Mapped to table `project_handovers`)

### B. Frontend Navigation & Screen Misdirection
- **Sidebar Definition:** In [`frontend/src/layouts/DashboardLayout.jsx:509-513`](file:///d:/Kiaan/aaa-merging/frontend/src/layouts/DashboardLayout.jsx#L509-L513):
  ```jsx
  {
    label: 'Projects',
    icon: <GroupsIcon />,
    path: '/active-cases',
    roles: ['admin', 'operations', 'super_admin'],
  }
  ```
- **Disconnection Cause:** The menu item labeled **"Projects"** points to `/active-cases` rather than an IT project route.
- **Underlying Page:** The destination component ([`frontend/src/pages/team/ActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/ActiveCases.jsx)) and its duplicates ([`AdminActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/AdminActiveCases.jsx), [`OperationsActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/OperationsActiveCases.jsx), [`SuperAdminActiveCases.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/team/SuperAdminActiveCases.jsx)) query `dbService.getClients` and render legacy immigration document verification forms (e.g., apostilles, sworn translations, Spanish embassy checklists).
- **API Client Gap:** In [`frontend/src/services/dbService.js`](file:///d:/Kiaan/aaa-merging/frontend/src/services/dbService.js), there is **zero** integration with `/api/v1/projects`. No project fetching, creation, or task tracking methods exist in the frontend.

---

## 2. Verified Project API Endpoints & Capabilities

Static code inspection of [`backend/src/routes/projectRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/projectRoutes.js) and [`backend/src/controllers/projectController.js`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/projectController.js) confirms the following live capabilities:

| HTTP Method | Endpoint Path | Current Controller Handler | Allowed Roles in Route Middleware | Implemented Backend Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/projects` | `getProjects` | All authenticated (`router.use(authMiddleware)`) | Scoped listing, status filtering, health filtering, search, client/manager includes, counts. |
| `POST` | `/api/v1/projects` | `createProject` | `admin`, `super_admin`, `consultant`, `operations` | Auto-generates `PRJ-YYYY-XXX` code, sets tech stack, URLs, budget, initial health. |
| `GET` | `/api/v1/projects/:id` | `getProjectById` | All authenticated | Full breakdown: milestones, tasks, handovers, time logs, aggregated hours, completion rate. |
| `PUT` | `/api/v1/projects/:id` | `updateProject` | `admin`, `super_admin`, `consultant`, `operations` | Updates details, budget, links, health, completion timestamp when status = `COMPLETED`. |
| `DELETE` | `/api/v1/projects/:id` | `deleteProject` | `admin`, `super_admin` | Hard delete of project and cascading child entities. |
| `POST` | `/api/v1/projects/:id/milestones` | `createMilestone` | `admin`, `super_admin`, `consultant`, `operations` | Creates milestone or sprint with start/due dates. |
| `PUT` | `/api/v1/projects/:id/milestones/:milestoneId` | `updateMilestone` | `admin`, `super_admin`, `consultant`, `operations` | Updates milestone details, auto-sets `completedAt`. |
| `DELETE` | `/api/v1/projects/:id/milestones/:milestoneId` | `deleteMilestone` | `admin`, `super_admin` | Deletes milestone record. |
| `POST` | `/api/v1/projects/:id/tasks` | `createTask` | **Unrestricted** (auth only) | Creates project task (FEATURE, BUG, TASK, QA, etc.). |
| `PUT` | `/api/v1/projects/:id/tasks/:taskId` | `updateTask` | **Unrestricted** (auth only) | Updates task status, hours, assignee; auto-sets `completedAt`. |
| `DELETE` | `/api/v1/projects/:id/tasks/:taskId` | `deleteTask` | `admin`, `super_admin`, `consultant`, `operations` | Deletes task record. |
| `POST` | `/api/v1/projects/:id/time-logs` | `logTime` | **Unrestricted** (auth only) | Logs billable/non-billable hours; auto-increments task `actualHours`. |
| `DELETE` | `/api/v1/projects/:id/time-logs/:logId` | `deleteTimeLog` | **Unrestricted** (auth only) | Deletes time log; auto-decrements task `actualHours`. |
| `POST` | `/api/v1/projects/:id/handovers` | `createHandover` | `admin`, `super_admin`, `operations`, `consultant` | Creates handover stage (QA, UAT, STAGING, PRODUCTION, HANDOVER). |
| `PUT` | `/api/v1/projects/:id/handovers/:handoverId/signoff` | `signOffHandover` | `admin`, `super_admin`, `operations` | Records sign-off; auto-advances project status to `QA_UAT` or `COMPLETED`. |

---

## 3. Current Projects Sidebar & Routing Problems

1. **Incorrect Destination:**
   - In [`DashboardLayout.jsx:511`](file:///d:/Kiaan/aaa-merging/frontend/src/layouts/DashboardLayout.jsx#L511), clicking "Projects" navigates to `/active-cases`.
   - `getDynamicPath()` transforms `/active-cases` into `/:rolePrefix/active-cases` (e.g. `/admin/active-cases`, `/super_admin/active-cases`), routing to `ActiveCases.jsx`.
2. **Icon & Role Inaccuracy:**
   - Projects uses `<GroupsIcon />`, which is identical to the "Team" menu icon.
   - Roles allowed in sidebar are restricted to `['admin', 'operations', 'super_admin']`, omitting `consultant` and `finance`, even though backend `projectRoutes.js` permits consultants to create/manage projects and finance to audit project revenue/budgets.
3. **Legacy Redirection Triggers:**
   - When a consultant or finance user attempts to click Projects, the sidebar either hides the item or redirects to `/dashboard` due to route prefix guards in [`AppRoutes.jsx:695-705`](file:///d:/Kiaan/aaa-merging/frontend/src/routes/AppRoutes.jsx#L695-L705).
4. **Impact on Existing Workflows:**
   - `/active-cases` is currently used strictly as the document/case checklist viewer.
   - Rerouting the "Projects" sidebar item to `/projects` will **not** delete `/active-cases` or break existing case management. `/active-cases` will remain mounted and intact as a legacy route until Phase 4.

---

## 4. Relevant Roles & Authorization Behavior

### A. Role Visibility Model
- **`super_admin` & `admin`:** Full access across all projects, financial costing, milestone administration, project deletion, and handover sign-offs.
- **`operations`:** Technical lead & delivery managers. Can create and update projects, milestones, tasks, and perform handover sign-offs (`QA`, `UAT`, `STAGING`, `PRODUCTION`).
- **`consultant` / `agent`:** Solutions architects / BDMs. Allowed to view assigned projects (where `projectManagerId === user.id`, `deliveryManagerId === user.id`, or tasks are assigned to them) and create initial projects.
- **`finance`:** Can view all projects, budgets, and spent amounts for billing reconciliation and invoice matching.
- **`client`:** Restricted to viewing projects where `clientId === user.id`.

---

## 5. Proposed File-by-File Integration Plan

To achieve seamless integration with minimal risk, the changes are organized into four focused files:

### File 1: [`frontend/src/services/dbService.js`](file:///d:/Kiaan/aaa-merging/frontend/src/services/dbService.js) (API Layer)
Add standard project service methods using the existing `apiClient`:
- `getProjects(params)`: `GET /projects` (passes query filters)
- `getProjectById(id)`: `GET /projects/${id}`
- `createProject(data)`: `POST /projects`
- `updateProject(id, data)`: `PUT /projects/${id}`
- `deleteProject(id)`: `DELETE /projects/${id}`
- `createMilestone(projectId, data)`: `POST /projects/${projectId}/milestones`
- `updateMilestone(projectId, milestoneId, data)`: `PUT /projects/${projectId}/milestones/${milestoneId}`
- `deleteMilestone(projectId, milestoneId)`: `DELETE /projects/${projectId}/milestones/${milestoneId}`
- `createTask(projectId, data)`: `POST /projects/${projectId}/tasks`
- `updateTask(projectId, taskId, data)`: `PUT /projects/${projectId}/tasks/${taskId}`
- `deleteTask(projectId, taskId)`: `DELETE /projects/${projectId}/tasks/${taskId}`
- `logTime(projectId, data)`: `POST /projects/${projectId}/time-logs`
- `deleteTimeLog(projectId, logId)`: `DELETE /projects/${projectId}/time-logs/${logId}`
- `createHandover(projectId, data)`: `POST /projects/${projectId}/handovers`
- `signOffHandover(projectId, handoverId, data)`: `PUT /projects/${projectId}/handovers/${handoverId}/signoff`

### File 2: Create [`frontend/src/pages/projects/Projects.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/projects/Projects.jsx) (UI List Page)
A modern, enterprise IT Projects dashboard styled consistently with the application's MUI theme:
- **Header:** Title "IT Projects Management", search bar, and "Create Project" action (restricted by role).
- **KPI Summary Cards:** Total Projects, In Progress, QA/UAT, Deployed/Completed, Total Budget, Hours Logged.
- **Filter Controls:** Status filter (`PLANNING`, `IN_PROGRESS`, `QA_UAT`, `DEPLOYED`, `COMPLETED`), Health filter (`ON_TRACK`, `AT_RISK`, `DELAYED`), Service Type filter (`Web Development`, `Mobile App`, `Cloud & DevOps`, `AI / ML`, `Custom Software`).
- **Project Cards / Grid:**
  - Project code badge (`PRJ-2026-001`)
  - Tech stack chips (e.g., `React`, `Node.js`, `AWS`, `Docker`)
  - External repository link (`repositoryUrl`) and staging link (`stagingUrl`)
  - Milestone and task progress bar
  - Project manager and delivery manager display
  - Click to view details
- **States:** Skeleton loading state, graceful empty state ("No IT projects match your filter"), error alert with retry button.
- **Create Project Modal:** Simple form accepting name, client, service type, budget, priority, tech stack, and repository link.

### File 3: Create [`frontend/src/pages/projects/ProjectDetails.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/pages/projects/ProjectDetails.jsx) (UI Detail View)
A comprehensive single-project workspace:
- **Overview Tab:** Scope description, budget vs. spent budget, client details, environment links.
- **Milestones & Sprints Tab:** Milestone timeline with sprint status and task associations.
- **Tasks & Kanban Tab:** Task cards grouped by status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `QA`, `DONE`) with priority badges and estimated vs. actual hours.
- **Time Tracking Tab:** Logged hours breakdown with user names, work dates, and "Log Work Time" modal.
- **Deployment & Handover Tab:** QA, UAT, Staging, and Production sign-off records with sign-off credentials.

### File 4: [`frontend/src/routes/AppRoutes.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/routes/AppRoutes.jsx) (Routing)
Mount the new project components safely:
- Add imports:
  ```javascript
  import Projects from '../pages/projects/Projects';
  import ProjectDetails from '../pages/projects/ProjectDetails';
  ```
- Register canonical and prefixed routes:
  ```jsx
  <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
  <Route path="/:rolePrefix/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
  <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
  <Route path="/:rolePrefix/projects/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
  ```
- Keep existing `/active-cases` routes untouched for backward compatibility.

### File 5: [`frontend/src/layouts/DashboardLayout.jsx`](file:///d:/Kiaan/aaa-merging/frontend/src/layouts/DashboardLayout.jsx) (Navigation)
- Update the Projects sidebar entry:
  ```jsx
  {
    label: 'Projects',
    icon: <FolderSpecialIcon />, // Distinct from GroupsIcon
    path: '/projects',
    roles: ['admin', 'operations', 'super_admin', 'consultant', 'finance'],
  }
  ```
- In `getDynamicPath()`: Add `/projects` to shared path handlers so navigation smoothly resolves across all role prefixes.

---

## 6. Security Concerns & Identified Backend Gaps

Before connecting the frontend in execution, code inspection revealed three backend authorization gaps in [`backend/src/routes/projectRoutes.js`](file:///d:/Kiaan/aaa-merging/backend/src/routes/projectRoutes.js):

1. **Missing Access Scoping on `GET /api/v1/projects/:id` (Severity: HIGH):**
   - In [`projectController.js:81`](file:///d:/Kiaan/aaa-merging/backend/src/controllers/projectController.js#L81), `getProjectById` fetches any project by ID without checking whether the requesting user is an admin, assigned consultant, or the project's client.
   - *Recommendation:* Add assignment check mirroring `getProjects` list scoping.
2. **Missing RBAC on Task Endpoints (Severity: MEDIUM):**
   - `POST /:id/tasks` and `PUT /:id/tasks/:taskId` have no `rbacMiddleware`. Any authenticated token (including external client tokens) can add or update tasks.
   - *Recommendation:* Attach `rbacMiddleware(['admin', 'super_admin', 'consultant', 'operations'])` to task mutation routes.
3. **Missing Ownership Check on Time Logs (Severity: LOW):**
   - `DELETE /:id/time-logs/:logId` allows any authenticated user to delete any time log.
   - *Recommendation:* Verify that `timeLog.userId === req.user.id` or user is `admin`/`super_admin`.

*Note: These backend improvements can be bundled into the Phase 2 implementation or authorized separately.*

---

## 7. Safe Testing Plan

| Test Phase | Action & Scope | Verification Method | Safe Mode Rules |
| :--- | :--- | :--- | :--- |
| **Test 1: Backend Route Syntax** | Run `node -c` on all project routes and controllers. | Static node compilation check | Zero database or network execution |
| **Test 2: Frontend Build Verification** | Run `npm run build` or Vite build dry run on frontend. | Static bundle analysis | Tests React imports, JSX syntax, and routing integrity |
| **Test 3: Sidebar Navigation Routing** | Inspect `DashboardLayout` role-prefix resolution. | Router unit mock in scratch | Verifies `/projects` resolves for admin, operations, consultant, finance |
| **Test 4: Empty & Error UI States** | Verify Projects page handles 0 records or 500 API responses gracefully. | Component unit inspection | Verifies skeleton loader and empty alert render properly |
| **Test 5: Phase 1 Regression Protection** | Re-run `scratch/verify_phase1_security.js`. | Automated in-memory security suite | Confirms purge and client scoping protections remain 100% active |

---

## 8. Dependencies, Blockers & Unresolved Questions

1. **Database Service Availability (Blocker for Live Data Testing):**  
   *Verified Fact:* The local MySQL service (`localhost:3306`) is currently offline in this environment session.  
   *Resolution:* Live end-to-end testing with actual database queries can be executed once MySQL is active. The UI will be engineered with resilient loading/empty states so it handles empty arrays or offline backend responses gracefully.
2. **"Archived Projects" Menu Destination:**  
   *Question:* Should the sidebar's "Archived Projects" item navigate to `/projects?status=COMPLETED`, or remain pointed to legacy `/closed-cases` until Phase 4?  
   *Recommendation:* Keep `/closed-cases` untouched in Phase 2 to prevent any disruption to legacy records, while adding a "Completed" tab to the new Projects view.

---

## 9. Exact Implementation Steps Ordered by Priority

```
Step 1: dbService.js Integration
  └── Add project CRUD, milestone, task, and handover methods to dbService.js.
         │
         ▼
Step 2: Component Creation (frontend/src/pages/projects/)
  ├── Create Projects.jsx (List view, filters, metrics, Tech Stack tags, Create modal).
  └── Create ProjectDetails.jsx (Tabs for Milestones, Tasks, Time Logs, and Handovers).
         │
         ▼
Step 3: Route Binding in AppRoutes.jsx
  ├── Import Projects and ProjectDetails.
  └── Mount /projects, /:rolePrefix/projects, /projects/:id, /:rolePrefix/projects/:id.
         │
         ▼
Step 4: Sidebar Navigation Update in DashboardLayout.jsx
  ├── Update "Projects" path to /projects.
  ├── Update icon to <FolderSpecialIcon />.
  └── Expand allowed roles to ['admin', 'operations', 'super_admin', 'consultant', 'finance'].
         │
         ▼
Step 5: Safe Verification & Build Check
  ├── Run Vite build check to verify 0 syntax or bundling errors.
  └── Re-verify Phase 1 security protections to ensure zero regressions.
```

---

## 10. List of Files That Will Remain Untouched

To preserve working stability and legacy compatibility, the following files will **NOT** be modified in Phase 2:
- `backend/prisma/schema.prisma` (Zero database schema changes)
- `backend/src/routes/settingsRoutes.js` (Phase 1 purge protection intact)
- `backend/src/controllers/settingsController.js` (Phase 1 purge guard intact)
- `backend/src/routes/clientRoutes.js` (Phase 1 client protection intact)
- `backend/src/controllers/clientController.js` (Phase 1 client scoping intact)
- `frontend/src/pages/team/ActiveCases.jsx` (Legacy Spanish case workflow untouched)
- `frontend/src/pages/team/AdminActiveCases.jsx` (Legacy file untouched)
- `frontend/src/pages/team/OperationsActiveCases.jsx` (Legacy file untouched)
- `frontend/src/pages/team/SuperAdminActiveCases.jsx` (Legacy file untouched)
- `frontend/src/pages/clients/ClosedCases.jsx` (Legacy archived cases untouched)
- All existing lead, consultation, payment, review, social, and authentication pages.

---

## 11. Final Stop Condition

This document represents the complete, verified Phase 2 Integration Plan.  
**No application source files, components, or configurations have been altered.**  
Awaiting your explicit review and approval before beginning implementation.

