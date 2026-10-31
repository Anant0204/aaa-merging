/**
 * Routes for 7 Autonomous AI Employees Control Center
 */

const express = require('express');
const router = express.Router();
const aiEmployeeController = require('../controllers/aiEmployeeController');
const { verifyToken, checkRole } = require('../middlewares/auth');

// Public or token-verified access (allowing super_admin, admin, operations)
const allowedRoles = ['super_admin', 'admin', 'operations', 'marketing', 'consultant'];

router.get('/overview', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getOverview(req, res));
router.get('/agents', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getAgents(req, res));
router.patch('/agents/:id/status', verifyToken, checkRole(['super_admin', 'admin']), (req, res) => aiEmployeeController.updateAgentStatus(req, res));
router.post('/agents/:id/trigger', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.triggerAgentNow(req, res));

router.get('/tasks', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getTasks(req, res));
router.get('/approvals', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getApprovals(req, res));
router.post('/approvals/:id/decide', verifyToken, checkRole(['super_admin', 'admin', 'operations']), (req, res) => aiEmployeeController.decideApproval(req, res));

router.get('/health', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getHealth(req, res));
router.post('/ceo-briefing', verifyToken, checkRole(allowedRoles), (req, res) => aiEmployeeController.getCeoBriefing(req, res));

module.exports = router;
