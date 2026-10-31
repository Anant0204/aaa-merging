export const SERVICES = [
  { id: 'web_dev', name: 'Web Development', category: 'Engineering', basePrice: 3000 },
  { id: 'mobile_dev', name: 'Mobile App Development', category: 'Engineering', basePrice: 5000 },
  { id: 'saas_dev', name: 'SaaS Development', category: 'Engineering', basePrice: 8000 },
  { id: 'ai_automation', name: 'AI & Workflow Automation', category: 'AI / ML', basePrice: 2500 },
  { id: 'crm_erp', name: 'CRM / ERP Development', category: 'Enterprise', basePrice: 6000 },
  { id: 'ui_ux', name: 'UI/UX Design', category: 'Design', basePrice: 1500 },
  { id: 'api_integration', name: 'API Integration', category: 'Engineering', basePrice: 2000 },
  { id: 'maintenance', name: 'Maintenance & Support', category: 'Support', basePrice: 1000 },
  // Backward compatibility mappings for legacy seeded data
  { id: 'visa', name: 'Custom Software Development', category: 'Engineering', basePrice: 2000 },
  { id: 'property', name: 'Cloud Infrastructure', category: 'Enterprise', basePrice: 3000 },
  { id: 'sworn_translation', name: 'Technical Documentation', category: 'Support', basePrice: 150 },
  { id: 'dnv', name: 'Full-Stack Web App', category: 'Engineering', basePrice: 2000 },
  { id: 'nlv', name: 'Mobile Application', category: 'Engineering', basePrice: 1800 },
  { id: 'self_employed', name: 'SaaS Product MVP', category: 'Engineering', basePrice: 2500 },
  { id: 'study', name: 'AI Chatbot Solution', category: 'AI / ML', basePrice: 1200 },
  { id: 'family', name: 'Internal Business Portal', category: 'Enterprise', basePrice: 1500 },
  { id: 'tourism', name: 'API Integration Connector', category: 'Engineering', basePrice: 400 },
];

export const MAIN_SERVICES = [
  { id: 'web_dev', name: 'Web Development' },
  { id: 'mobile_dev', name: 'Mobile App Development' },
  { id: 'saas_dev', name: 'SaaS Development' },
  { id: 'ai_automation', name: 'AI & Workflow Automation' },
  { id: 'crm_erp', name: 'CRM / ERP Development' },
  { id: 'ui_ux', name: 'UI/UX Design' },
  { id: 'api_integration', name: 'API Integration' },
  { id: 'maintenance', name: 'Maintenance & Support' },
];

export const matchesServiceCategory = (item, targetServiceId) => {
  if (!targetServiceId) return true;
  const service = String(item?.serviceId || item?.serviceType || item?.service?.name || item?.service || '').toLowerCase();

  if (targetServiceId === 'sworn_translation') {
    return isSwornTranslationService(service) || Boolean(item?.wordCount) || Boolean(item?.sourceLanguage);
  }

  if (targetServiceId === 'property') {
    return service.includes('property') || service.includes('investment') || service.includes('land');
  }

  if (targetServiceId === 'visa') {
    const isTranslation = isSwornTranslationService(service) || Boolean(item?.wordCount) || Boolean(item?.sourceLanguage);
    const isProperty = service.includes('property') || service.includes('investment') || service.includes('land');
    return !isTranslation && !isProperty;
  }

  return service.includes(targetServiceId.toLowerCase());
};

export const SWORN_TRANSLATION_STATUSES = [
  'Payment Not Completed',
  'Payment Completed',
  'Under Process',
  'Completed',
  'Closed'
];

export const isSwornTranslationService = (serviceTypeOrId = '') => {
  if (!serviceTypeOrId) return false;
  const s = String(serviceTypeOrId).toLowerCase();
  return s.includes('translation') || s.includes('sworn') || s.includes('traducci');
};

export const IT_SALES_PIPELINE_STAGES = [
  'New Inquiry',
  'Discovery Scheduled',
  'Requirement Analysis',
  'Proposal Sent',
  'Negotiation',
  'Deal Won',
  'Deal Lost'
];

export const getLeadStatusOptions = (leadOrRow, leadStages = []) => {
  const service = leadOrRow?.serviceType || leadOrRow?.serviceId || leadOrRow?.service?.name || leadOrRow?.service || '';
  const currentStatus = leadOrRow?.status;
  
  const isTranslation = isSwornTranslationService(service) || 
    Boolean(leadOrRow?.wordCount) || 
    Boolean(leadOrRow?.sourceLanguage) || 
    Boolean(leadOrRow?.targetLanguage);

  if (isTranslation) {
    return Array.from(new Set([
      ...SWORN_TRANSLATION_STATUSES,
      ...(currentStatus ? [currentStatus] : [])
    ]));
  }
  
  const standardList = Array.from(new Set([
    ...IT_SALES_PIPELINE_STAGES,
    ...leadStages.map(s => s.name || s),
    'No Show'
  ]));
  return currentStatus && !standardList.includes(currentStatus)
    ? [...standardList, currentStatus]
    : standardList;
};

export const RELOCATION_SERVICES = [
  { id: 'devops', name: 'DevOps & Cloud Infrastructure' },
  { id: 'tie', name: 'TIE & Fingerprint Appointment' },
  { id: 'empadronamiento', name: 'Empadronamiento Assistance' },
  { id: 'digital_cert', name: 'Digital Certificate Assistance' },
  { id: 'clave', name: 'Cl@ve Registration Assistance' },
  { id: 'nif_tax', name: 'NIF & Tax Registration Guidance' },
  { id: 'social_security', name: 'Social Security Registration' },
  { id: 'sip_health', name: 'SIP Health Card Assistance' },
  { id: 'bank_account', name: 'Spanish Bank Account Guidance' },
  { id: 'sim_card', name: 'SIM Card Assistance' },
];

export const PACKAGES = [
  {
    id: 'OPTION_A',
    code: 'OPTION_A',
    name: 'Option A: Professional Case Assessment',
    price: 250,
    additionalApplicantPrice: 0,
    refundable: 'Non-refundable (€250 fee deductible within 14 days if upgraded to Full or Premium Package)',
    description: 'Dedicated One-to-One Case Review, Professional Case Evaluation, Comprehensive Eligibility Assessment & Action Plan.',
    includes: [
      'Dedicated One-to-One Case Review',
      'Professional Case Evaluation & Strategy',
      'Comprehensive Eligibility Assessment',
      'Personalized Document Checklist',
      'Application Readiness Report & Action Plan'
    ]
  },
  {
    id: 'OPTION_B',
    code: 'OPTION_B',
    name: 'Option B: Full Processing Package – End-to-End Service',
    price: 3500,
    additionalApplicantPrice: 500,
    refundable: '100% Milestone Satisfaction Guarantee',
    description: 'Complete, Professional & End-to-End Support for Spain Residency Applications from eligibility to submission.',
    includes: [
      'Eligibility Verification & Initial Assessment',
      'Professional Case Evaluation & Strategy',
      'Sworn Translation Management',
      'Digital Nomad / NLV File Assembly',
      'Cloud Architecture & DevOps Setup',
      'Milestone-based Quality Guarantee & SLA Protection'
    ]
  },
  {
    id: 'OPTION_C',
    code: 'OPTION_C',
    name: 'Option C: Administrative Relocation Package – Post-Approval Assistance',
    price: 1750,
    additionalApplicantPrice: 500,
    refundable: 'Non-refundable',
    description: 'Post-deployment maintenance and managed cloud infrastructure support.',
    includes: [
      'Post-Approval Residency Card (TIE) Fingerprint Booking',
      'Town Hall Registration (Empadronamiento)',
      'Spanish Health Card / Private Insurance Setup',
      'Spanish Bank Account & Social Security Setup Support',
      'Driver License Exchange Guidance'
    ]
  },
  {
    id: 'OPTION_D',
    code: 'OPTION_D',
    name: 'Option D: Premium Package – End-to-End Service + Administrative Relocation Package',
    price: 4750,
    additionalApplicantPrice: 750,
    refundable: '100% Milestone Satisfaction Guarantee',
    isRecommended: true,
    description: 'Includes EVERYTHING in Full Processing Package + Complete In-Spain Relocation & Administrative Assistance.',
    includes: [
      'Everything in Full Processing Package (End-to-End)',
      'Everything in Administrative Relocation Package (In-Spain Setup)',
      'Spanish Bank Account Opening Assistance',
      'Production Deployment & Security Hardening',
      'Empadronamiento (Town Hall Registration)',
      'Spanish Social Security Registration',
      'Milestone-based Quality Guarantee & SLA Protection'
    ]
  }
];


// Legacy mock data arrays neutralized to ensure 100% live database usage
export const AGENTS = [];
export const MOCK_LEADS = [];
export const MOCK_CLIENTS = [];
export const MOCK_CONSULTATIONS = [];
export const MOCK_PAYMENTS = [];
export const MOCK_DOCUMENTS = [];
export const EMAIL_TEMPLATES = [];
export const WHATSAPP_TEMPLATES = [];
export const ROLES = [];
export const NOTIFICATIONS = [];
