import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { dbService } from '../../services/dbService';

// Recharts components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend } from 'recharts';

// Custom icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CancelIcon from '@mui/icons-material/Cancel';

// Custom components
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AppCard from '../../components/AppCard';
import AppTable from '../../components/AppTable';

// Constants & Helpers
import { SERVICES } from '../../constants/mockData';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isConsultant, isFinance, isAdmin, isOperations, currentUser, isViewOnlyMenu } = useAuth();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { currency, currencySymbol, formatAmount, convertAmount } = useCurrency();

  // Lead Ingestion Simulator State
  const [fullName, setFullName] = useState('');
  const [source, setSource] = useState('WhatsApp');
  const [serviceId, setServiceId] = useState('dnv');
  const [nationality, setNationality] = useState('American');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const nationalityDetails = {
    American: { preferredLanguage: 'English', phonePrefix: '+1' },
    British: { preferredLanguage: 'English', phonePrefix: '+44' },
    Indian: { preferredLanguage: 'English', phonePrefix: '+91' },
    Canadian: { preferredLanguage: 'English', phonePrefix: '+1' },
    Chinese: { preferredLanguage: 'English', phonePrefix: '+86' },
    Russian: { preferredLanguage: 'English', phonePrefix: '+7' },
    French: { preferredLanguage: 'English', phonePrefix: '+33' },
    Spanish: { preferredLanguage: 'Spanish', phonePrefix: '+34' },
    Jordanian: { preferredLanguage: 'Arabic', phonePrefix: '+962' },
    Emirati: { preferredLanguage: 'Arabic', phonePrefix: '+971' },
    Lebanese: { preferredLanguage: 'Arabic', phonePrefix: '+961' } };

  const handleIngestLead = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showAlert('Please enter a candidate name', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || 'Doe';

      const details = nationalityDetails[nationality] || { preferredLanguage: 'English', phonePrefix: '+1' };
      const randomPhoneSuffix = Math.floor(100000000 + Math.random() * 900000000);
      const generatedEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`;
      const generatedPhone = `${details.phonePrefix} ${randomPhoneSuffix}`;

      const payload = {
        firstName,
        lastName,
        email: generatedEmail,
        phone: generatedPhone,
        nationality,
        preferredLanguage: details.preferredLanguage,
        source,
        serviceId,
        applicantsCount: 1,
        status: 'New Lead',
        notes: `Simulated inbound lead from ${source} for ${SERVICES.find(s => s.id === serviceId)?.name || serviceId}.` };

      await dbService.createLead(payload);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showAlert(`Test lead for ${firstName} ${lastName} successfully ingested!`, 'success');

      // Reset form
      setFullName('');
      setSource('WhatsApp');
      setServiceId('dnv');
      setNationality('American');
    } catch (error) {
      console.error(error);
      showAlert('Failed to ingest lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: leads = [] } = useQuery({ queryKey: ['leads'], queryFn: dbService.getLeads });
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: dbService.getClients });
  const { data: consultations = [] } = useQuery({ queryKey: ['consultations'], queryFn: dbService.getConsultations });
  const { data: payments = [] } = useQuery({ queryKey: ['payments'], queryFn: dbService.getPayments });
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: dbService.getNotifications });
  const { data: agentsList = [] } = useQuery({ queryKey: ['agents'], queryFn: dbService.getAgents });
  const { data: refundRequests = [] } = useQuery({ queryKey: ['refundRequests'], queryFn: dbService.getRefundRequests });
  const { data: customizationSettings } = useQuery({ queryKey: ['customization-settings'], queryFn: dbService.getCustomizationSettings });

  const isViewOnly = isViewOnlyMenu(customizationSettings, 'Dashboard');

  const toUAEDateStr = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return String(ts).substring(0, 10);
    const uaeOffset = 4 * 60; // UTC+4 in minutes
    const localMs = d.getTime() + uaeOffset * 60 * 1000;
    const localDate = new Date(localMs);
    const y = localDate.getUTCFullYear();
    const m = String(localDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(localDate.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getDateStr = (val) => {
    if (!val) return '';
    return toUAEDateStr(val);
  };

  // Compute key stats
  const totalLeads = leads.length;
  const todayDateStr = toUAEDateStr(new Date());
  const todayLeadsCount = leads.filter((l) => {
    const dateVal = l.meetingPreferredDate || l.createdAt || l.createdDate;
    return toUAEDateStr(dateVal) === todayDateStr;
  }).length;

  const pendingPaymentsCount = payments.filter((p) => p.status === 'Pending' || p.status === 'Pending Payment').length;

  const processedRefundsList = (Array.isArray(refundRequests) ? refundRequests : []).filter(
    r => r && (r.status === 'Processed' || r.status === 'Approved')
  );
  const totalRefundsAmount = processedRefundsList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const todayRefundsAmount = processedRefundsList
    .filter(r => getDateStr(r.updatedAt || r.createdAt) === todayDateStr)
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const paidPaymentsList = (Array.isArray(payments) ? payments : []).filter(
    p => p && (p.status === 'Paid' || p.status === 'Completed')
  );
  const grossTotalRevenue = paidPaymentsList.reduce((sum, p) => sum + (Number(p.totalPaid || p.amount) || 0), 0);
  const revenueTotal = Math.max(0, grossTotalRevenue - totalRefundsAmount);

  const todayPaidPayments = paidPaymentsList.filter(p => {
    const pDate = getDateStr(p.paidAt || p.paymentDate || p.billingDate || p.dueDate || p.createdAt);
    return pDate === todayDateStr;
  });
  const grossTodayRevenue = todayPaidPayments.reduce((sum, p) => sum + (Number(p.totalPaid || p.amount) || 0), 0);
  const revenueTodayTotal = Math.max(0, grossTodayRevenue - todayRefundsAmount);

  // Outstanding Revenue: sum of all pending payment amounts
  const outstandingRevenue = payments
    .filter((p) => p.status === 'Pending' || p.status === 'Pending Payment')
    .reduce((sum, p) => sum + (p.amount || p.totalPaid || 0), 0);

  // Refunded
  const refundedTotal = totalRefundsAmount;

  const activeCasesCount = clients.filter((c) => c.status === 'Under Process').length;
  const completedCasesCount = clients.filter((c) => c.status === 'Completed').length;
  const lostLeadsCount = leads.filter((l) => l.status === 'Lost Lead').length;

  // Today's Clients
  const clientsTodayCount = clients.filter((c) => c.onboardingDate?.startsWith(todayDateStr)).length;

  // Render quick stats data — titles must exactly match AVAILABLE_CARDS keys
  const statsList = [
    { title: 'Total Clients', value: clients.length, icon: <PeopleAltIcon />, color: '#3F51B5', trend: null, onClick: () => navigate('/admin/leads', { state: { filterStatus: '', cardInfo: { title: 'Total Clients', value: clients.length, color: '#3F51B5', trend: null, iconType: 'PeopleAlt' } } }) },
    { title: "Today's Clients", value: clientsTodayCount, icon: <AddIcon />, color: '#14B8A6', trend: null, onClick: () => navigate('/admin/leads', { state: { filterStatus: '', cardInfo: { title: "Today's Clients", value: clientsTodayCount, color: '#14B8A6', trend: null, iconType: 'Add' } } }) },
    { title: 'Total Inquiries', value: totalLeads, icon: <PeopleAltIcon />, color: '#8B5CF6', trend: null, onClick: () => navigate('/admin/leads', { state: { filterToday: false, filterStatus: '', cardInfo: { title: 'Total Inquiries', value: totalLeads, color: '#8B5CF6', trend: null, iconType: 'PeopleAlt' } } }) },
    { title: "Today's Inquiries", value: todayLeadsCount, icon: <AddIcon />, color: '#EC4899', trend: null, onClick: () => navigate('/admin/leads', { state: { filterToday: true, filterStatus: '', cardInfo: { title: "Today's Inquiries", value: todayLeadsCount, color: '#EC4899', trend: null, iconType: 'Add' } } }) },
    { title: 'Pending Payments', value: pendingPaymentsCount, icon: <PaymentsIcon />, color: '#F59E0B', trend: null },
    { title: 'Total Revenue', value: formatAmount(currency === 'INR' ? convertAmount(revenueTotal, 'USD', 'INR') : revenueTotal), icon: <TrendingUpIcon />, color: '#22C55E', trend: null },
    { title: 'Active Projects', value: activeCasesCount, icon: <AssignmentIcon />, color: '#3B82F6', trend: null, onClick: () => navigate('/admin/leads', { state: { filterStatus: 'Under Process', cardInfo: { title: 'Active Projects', value: activeCasesCount, color: '#3B82F6', trend: null, iconType: 'Assignment' } } }) },
    { title: 'Completed Projects', value: completedCasesCount, icon: <CheckCircleOutlinedIcon />, color: '#10B981', trend: null, onClick: () => navigate('/admin/leads', { state: { filterStatus: 'Completed', cardInfo: { title: 'Completed Projects', value: completedCasesCount, color: '#10B981', trend: null, iconType: 'CheckCircleOutlined' } } }) },
    { title: 'Lost Inquiries', value: lostLeadsCount, icon: <WarningAmberIcon />, color: '#EF4444', trend: null, onClick: () => navigate('/admin/leads', { state: { filterStatus: 'Lost Lead', filterToday: false, cardInfo: { title: 'Lost Inquiries', value: lostLeadsCount, color: '#EF4444', trend: null, iconType: 'WarningAmber' } } }) },
    { title: 'Revenue Today', value: formatAmount(currency === 'INR' ? convertAmount(revenueTodayTotal, 'USD', 'INR') : revenueTodayTotal), icon: <TrendingUpIcon />, color: '#14B8A6', trend: null },
    { title: 'Outstanding Revenue', value: formatAmount(currency === 'INR' ? convertAmount(outstandingRevenue, 'USD', 'INR') : outstandingRevenue), icon: <AccountBalanceWalletIcon />, color: '#F59E0B', trend: null },
    { title: 'Refunded (Guarantee Claims)', value: formatAmount(currency === 'INR' ? convertAmount(refundedTotal, 'USD', 'INR') : refundedTotal), icon: <CancelIcon />, color: '#EF4444', trend: null },
  ];

  // CHART 1: Lead Source Chart
  const sourcesData = leads.reduce((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.source);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.source, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

  // CHART 2: Revenue Chart — computed dynamically from live database payments
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const revenueByMonth = payments
    .filter(p => (p.status === 'Paid' || p.status === 'Completed') && (p.paymentDate || p.paidAt || p.dueDate || p.createdAt))
    .reduce((acc, p) => {
      const d = new Date(p.paymentDate || p.paidAt || p.dueDate || p.createdAt);
      if (isNaN(d.getTime())) return acc;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!acc[key]) acc[key] = { name: `${monthNames[d.getMonth()]} ${d.getFullYear()}`, revenue: 0, target: 25000 };
      acc[key].revenue += (p.totalPaid || p.amount || 0);
      return acc;
    }, {});
  const dynamicRevenueList = Object.values(revenueByMonth).slice(-6);
  const revenueData = dynamicRevenueList.length > 0 ? dynamicRevenueList : [
    { name: monthNames[new Date().getMonth()], revenue: 0, target: 25000 }
  ];

  // CHART 3: Monthly Conversion Chart — computed dynamically from live database leads
  const conversionByMonth = leads.reduce((acc, l) => {
    const rawDate = l.createdDate || l.createdAt;
    if (!rawDate) return acc;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return acc;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!acc[key]) acc[key] = { name: monthNames[d.getMonth()], total: 0, converted: 0 };
    acc[key].total += 1;
    if (l.clientId || l.status === 'Converted' || l.status === 'Completed' || l.status === 'Client') {
      acc[key].converted += 1;
    }
    return acc;
  }, {});
  const dynamicConversionList = Object.values(conversionByMonth).slice(-6).map(m => ({
    name: m.name,
    rate: m.total > 0 ? Math.round((m.converted / m.total) * 100) : 0
  }));
  const conversionData = dynamicConversionList.length > 0 ? dynamicConversionList : [
    { name: monthNames[new Date().getMonth()], rate: 0 }
  ];

  // CHART 4: Consultant Performance Chart
  const performanceData = agentsList.map((c) => ({
    name: c.name.split(' ')[0],
    cases: c.casesCount || 0,
    rate: c.conversionRate || 0 }));

  // Leads table configuration
  const recentLeads = leads.slice(0, 5);
  const leadsColumns = [
    {
      id: 'id',
      label: 'Lead ID',
      minWidth: 110,
      render: (row) => row.clientCode || row.leadCode || row.displayId || (typeof row.id === 'string' && row.id.length > 8 ? `LEAD-${row.id.substring(0, 6).toUpperCase()}` : (row.id || '—'))
    },
    {
      id: 'name',
      label: 'Name',
      render: (row) => `${row.firstName} ${row.lastName}` },
    {
      id: 'service',
      label: 'Service Category',
      render: (row) => SERVICES.find((s) => s.id === row.serviceId)?.name || row.serviceId 
    },
    { id: 'status', label: 'Status' },
  ];



  return (
    <Box>
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Welcome back, ${currentUser?.name || 'Admin'}. Here is your CRM overview.`}
        action={
          !isViewOnly && (
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/admin/leads')}>
              Add New Lead
            </Button>
          )
        }
      />

      {/* Grid of Statistical Cards */}
      <Box
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-3"
      >
        {statsList
          .filter(stat => {
            // Use title directly — titles now exactly match AVAILABLE_CARDS keys
            const cardTitle = stat.title;

            // 1. Individual user customization override (highest priority)
            if (customizationSettings && currentUser?.id && customizationSettings[currentUser.id]?.cards) {
              const allowedCards = customizationSettings[currentUser.id].cards || [];
              return allowedCards.includes(cardTitle);
            }

            // 2. Individual custom permissions override (legacy fallback)
            if (currentUser?.customPermissions?.enabled) {
              const allowedCards = currentUser.customPermissions.cards || [];
              return allowedCards.includes(cardTitle);
            }

            // 3. Role-level customization settings
            const roleKey = currentUser?.role;
            if (customizationSettings && roleKey && customizationSettings[roleKey]) {
              const allowedCards = customizationSettings[roleKey].cards || [];
              return allowedCards.includes(cardTitle);
            }

            // 4. Fallback: show all
            return true;
          })
          .map((stat, idx) => (
            <StatCard
              key={idx}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              trendDirection={parseFloat(stat.trend) >= 0 ? 'up' : 'down'}
              color={stat.color}
              onClick={stat.onClick}
            />
          ))}
      </Box>

      {/* Charts Grid */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        {/* Revenue Chart */}
        <Box className="col-span-1">
          <ChartCard title="Revenue Growth Trends" subheader="Target vs Actual monthly generated payments">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <ChartTooltip formatter={(value) => [`${currencySymbol}${Number(value).toLocaleString()}`, 'Revenue']} />
                <Legend iconSize={8} iconType="circle" />
                <Area type="monotone" dataKey="revenue" name={`Actual Revenue (${currencySymbol})`} stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="target" name={`Target Revenue (${currencySymbol})`} stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Lead Source Pie Chart */}
        <Box className="col-span-1">
          <ChartCard title="Lead Registration Channels" subheader="Distribution of inbound leads by acquisition channel">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  fontSize={10}
                  fontWeight={500}
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value) => [value, 'Leads Count']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Monthly Conversion Rate */}
        <Box className="col-span-1">
          <ChartCard title="Deal Conversion Efficiency" subheader="Percentage of qualified leads converted to active project clients">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <ChartTooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                <Area type="monotone" dataKey="rate" name="Conversion Rate (%)" stroke="#14B8A6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>

        {/* Consultant Performance Chart */}
        <Box className="col-span-1">
          <ChartCard title="Team Leaderboard" subheader="Active projects delivered vs conversion rate">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <ChartTooltip />
                <Legend iconSize={8} iconType="circle" />
                <Bar dataKey="cases" name="Projects Handled" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="rate" name="Conversion Rate (%)" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Box>
      </Box>

      {/* Tables and Widgets Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Recent Leads Table */}
        <Box className="col-span-12">
          <AppCard
            title="Recent Lead registrations"
            subheader="Overview of the latest qualified inquiries"
            action={
              <Button size="small" variant="text" color="secondary" onClick={() => navigate('/leads')}>
                View All Leads
              </Button>
            }
            noPadding
          >
            <AppTable
              columns={leadsColumns}
              data={recentLeads}
              onRowClick={(row) => navigate(`/leads/details/${row.id}`)}
            />
          </AppCard>
        </Box>

        {/* Sidebar widgets */}
        <Box className="col-span-12">
          {/* Recent activity timeline log */}
          <Box>
            <AppCard title="Recent Live Activities" subheader="System audit log tracking">
              <List disablePadding>
                {notifications.slice(0, 4).map((notif, idx) => (
                  <React.Fragment key={notif.id}>
                    <ListItem sx={{ py: 1.2, px: 0 }}>
                      <ListItemText
                        slotProps={{
                          primary: { component: 'div' },
                          secondary: { component: 'div' }
                        }}
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {notif.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {notif.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {notif.time}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < 3 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </AppCard>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
