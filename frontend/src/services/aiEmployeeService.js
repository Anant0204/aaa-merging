import { apiClient } from './dbService';

export const aiEmployeeService = {
  getOverview: async () => {
    const res = await apiClient.get('/ai-employees/overview');
    return res.data;
  },

  getAgents: async () => {
    const res = await apiClient.get('/ai-employees/agents');
    return res.data;
  },

  updateAgentStatus: async (agentId, data) => {
    const res = await apiClient.patch(`/ai-employees/agents/${agentId}/status`, data);
    return res.data;
  },

  triggerAgentNow: async (agentId) => {
    const res = await apiClient.post(`/ai-employees/agents/${agentId}/trigger`);
    return res.data;
  },

  getTasks: async (params = {}) => {
    const res = await apiClient.get('/ai-employees/tasks', { params });
    return res.data;
  },

  getApprovals: async (status = 'PENDING') => {
    const res = await apiClient.get('/ai-employees/approvals', { params: { status } });
    return res.data;
  },

  decideApproval: async (approvalId, decision, notes = '') => {
    const res = await apiClient.post(`/ai-employees/approvals/${approvalId}/decide`, { decision, notes });
    return res.data;
  },

  getHealth: async () => {
    const res = await apiClient.get('/ai-employees/health');
    return res.data;
  },

  getCeoBriefing: async () => {
    const res = await apiClient.post('/ai-employees/ceo-briefing');
    return res.data;
  }
};

