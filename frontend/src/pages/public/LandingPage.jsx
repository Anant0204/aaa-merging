import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation } from '@tanstack/react-query';

// IT Enterprise Visual Assets
import itHeroBanner from '../../assets/it_hero_banner.jpg';
import itDevOpsShowcase from '../../assets/it_devops_showcase.jpg';

// Material Icons
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DevicesIcon from '@mui/icons-material/Devices';
import LayersIcon from '@mui/icons-material/Layers';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';

// Services
import { dbService } from '../../services/dbService';
import { useAlert } from '../../contexts/AlertContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Navigation & Interactive States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('cloud');

  // Smooth Scroll
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // IT Project Discovery Lead Form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceType: 'Custom Software & SaaS Development',
    budget: '$15,000 - $50,000',
    timeline: '1 - 3 Months',
    notes: '',
  });

  const leadMutation = useMutation({
    mutationFn: dbService.createLead,
    onSuccess: () => {
      showAlert('Thank you! Your project discovery request has been submitted. Our solutions architect will contact you within 24 hours.', 'success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        serviceType: 'Custom Software & SaaS Development',
        budget: '$15,000 - $50,000',
        timeline: '1 - 3 Months',
        notes: '',
      });
    },
    onError: (error) => {
      console.error('Lead submission error:', error);
      showAlert('Unable to submit inquiry. Please check your inputs or email us directly.', 'error');
    }
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      showAlert('Please fill in your name, business email, and contact number.', 'warning');
      return;
    }

    leadMutation.mutate({
      ...formData,
      status: 'New Lead',
      source: 'Landing Page'
    });
  };

  // Navigation Links
  const navItems = [
    { label: 'Services', href: '#services' },
    { label: 'Tech Stack', href: '#stack' },
    { label: 'Process', href: '#process' },
    { label: 'Plans', href: '#plans' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  // Core IT Services
  const services = [
    {
      title: 'Custom Software & SaaS Platforms',
      desc: 'Scalable multi-tenant cloud architectures, enterprise web portals, and microservice backends built for high concurrency and zero downtime.',
      icon: <CodeIcon className="text-blue-600 text-3xl" />,
      tag: 'Core Specialization',
    },
    {
      title: 'Full-Stack Web & Mobile Apps',
      desc: 'Cross-platform native iOS & Android applications with Flutter & React Native alongside responsive ultra-fast web apps powered by React and Next.js.',
      icon: <DevicesIcon className="text-indigo-600 text-3xl" />,
    },
    {
      title: 'AI & Intelligent Automation',
      desc: 'Custom LLM integrations, retrieval-augmented generation (RAG), computer vision, and workflow automation to unlock exponential efficiency.',
      icon: <SmartToyIcon className="text-cyan-600 text-3xl" />,
      tag: 'Trending',
    },
    {
      title: 'Cloud Infrastructure & DevOps (SRE)',
      desc: 'Automated CI/CD pipelines, Kubernetes container orchestration, Terraform infrastructure-as-code, and 24/7 site reliability engineering on AWS/GCP.',
      icon: <CloudIcon className="text-emerald-600 text-3xl" />,
    },
    {
      title: 'Enterprise CRM & ERP Systems',
      desc: 'Bespoke customer data platforms, sales pipeline automations, inventory management, and integration with legacy enterprise ERPs.',
      icon: <LayersIcon className="text-blue-600 text-3xl" />,
    },
    {
      title: 'UI/UX Product Design & Prototyping',
      desc: 'Human-centered user experience design, interactive Figma design systems, usability research, and rapid clickable prototypes.',
      icon: <AutoAwesomeIcon className="text-purple-600 text-3xl" />,
    },
    {
      title: 'E-Commerce & Omnichannel Platforms',
      desc: 'Headless e-commerce, high-volume checkout engines, payment gateway integrations, and real-time inventory synchronization.',
      icon: <RocketLaunchIcon className="text-amber-600 text-3xl" />,
    },
    {
      title: '24/7 Managed IT Support & Security',
      desc: 'Proactive vulnerability assessments, SOC2 & ISO 27001 compliance hardening, automated database backups, and dedicated SLA support.',
      icon: <SecurityIcon className="text-blue-600 text-3xl" />,
    }
  ];

  // Engineering Tech Stack Categories
  const techCategories = {
    cloud: [
      { name: 'Amazon Web Services', tag: 'Cloud Platform', icon: 'AWS' },
      { name: 'Google Cloud Platform', tag: 'Compute & AI', icon: 'GCP' },
      { name: 'Kubernetes & Docker', tag: 'Containers', icon: 'K8s' },
      { name: 'Terraform', tag: 'Infrastructure as Code', icon: 'TF' },
      { name: 'GitHub Actions', tag: 'CI/CD Pipeline', icon: 'CI' },
      { name: 'Cloudflare', tag: 'Edge & DDoS Defense', icon: 'CF' }
    ],
    backend: [
      { name: 'Node.js & Express', tag: 'API Engine', icon: 'Node' },
      { name: 'Python & FastAPI', tag: 'Data & AI', icon: 'Py' },
      { name: 'Go (Golang)', tag: 'High Concurrency', icon: 'Go' },
      { name: 'PostgreSQL', tag: 'Relational DB', icon: 'PG' },
      { name: 'Redis', tag: 'In-Memory Cache', icon: 'Redis' },
      { name: 'Apache Kafka', tag: 'Event Streaming', icon: 'Kafka' }
    ],
    frontend: [
      { name: 'React 19 & Next.js', tag: 'Modern Web UI', icon: 'React' },
      { name: 'TypeScript', tag: 'Type-Safe Logic', icon: 'TS' },
      { name: 'Tailwind CSS', tag: 'Design System', icon: 'CSS' },
      { name: 'React Native', tag: 'Mobile Engine', icon: 'RN' },
      { name: 'Flutter', tag: 'Cross-Platform', icon: 'FL' },
      { name: 'GraphQL / REST', tag: 'API Layer', icon: 'GQL' }
    ],
    ai: [
      { name: 'OpenAI GPT-4o & Claude', tag: 'LLM Foundations', icon: 'AI' },
      { name: 'LangChain & LlamaIndex', tag: 'RAG Frameworks', icon: 'LC' },
      { name: 'Pinecone & pgvector', tag: 'Vector Databases', icon: 'VEC' },
      { name: 'PyTorch & HuggingFace', tag: 'Model Training', icon: 'HF' },
      { name: 'Whisper & Computer Vision', tag: 'Multimodal', icon: 'CV' },
      { name: 'Automated RPA Bots', tag: 'Process Automation', icon: 'RPA' }
    ]
  };

  // Structured IT Delivery Workflow
  const deliveryStages = [
    {
      num: '01',
      title: 'Architectural Discovery',
      desc: 'Technical scoping, business logic mapping, system architecture blueprinting, and SLA alignment before writing a single line of code.'
    },
    {
      num: '02',
      title: 'Agile Sprint Sprints',
      desc: 'Bi-weekly sprint deliverables, interactive staging environments, continuous feature demos, and transparent burndown tracking.'
    },
    {
      num: '03',
      title: 'Automated QA & Security',
      desc: 'Rigorous unit testing, automated regression suites, penetration testing, load simulation, and SOC2 compliance validation.'
    },
    {
      num: '04',
      title: 'Zero-Downtime Deployment',
      desc: 'Blue/green or rolling cloud deployment, automated container orchestration, 24/7 telemetry monitoring, and ongoing warranty support.'
    }
  ];

  // IT Engagement Packages
  const engagementPlans = [
    {
      name: 'Startup MVP Acceleration',
      badge: 'Rapid Launch',
      desc: 'Designed for early-stage companies needing to validate and launch a production-ready digital product in 4 to 8 weeks.',
      price: '$9,500',
      period: 'Starting Project Scope',
      features: [
        'Full Product Architecture & Tech Spec',
        'Modern React / Next.js Web Application',
        'Node.js or Python Cloud Backend',
        'Automated CI/CD Pipeline & AWS Setup',
        'User Authentication & Role Management',
        'Stripe / Payment Gateway Integration',
        '30-Day Post-Launch Warranty Support'
      ],
      highlight: false
    },
    {
      name: 'Dedicated Engineering Pod',
      badge: 'Most Popular',
      desc: 'A dedicated, full-stack software engineering team scaling your product roadmap with predictable monthly velocity.',
      price: '$14,500',
      period: 'per month / retainer',
      features: [
        'Dedicated Senior Full-Stack Engineers',
        'Lead Solutions Architect & Tech PM',
        'QA Engineer & Automated Test Coverage',
        'Daily Standups & Bi-Weekly Sprint Demos',
        'Direct Slack & Jira Workspace Integration',
        'Code Ownership & Full IP Transfer',
        'Flexible Pod Scaling (Up or Down)'
      ],
      highlight: true
    },
    {
      name: 'Cloud & DevOps Modernization',
      badge: 'Infrastructure',
      desc: 'Transform legacy infrastructure into resilient, auto-scaling Kubernetes clusters with automated security guardrails.',
      price: '$8,000',
      period: 'one-time engagement',
      features: [
        'Cloud Infrastructure & Cost Audit',
        'Docker & Kubernetes Migration',
        'Terraform Infrastructure as Code',
        'Zero-Downtime CI/CD Pipeline Setup',
        'Database Optimization & Caching Strategy',
        'Comprehensive Disaster Recovery Plan',
        '24/7 Cloud Telemetry & Alerting'
      ],
      highlight: false
    },
    {
      name: 'Enterprise Digital Transformation',
      badge: 'Custom Enterprise',
      desc: 'Bespoke end-to-end software, custom ERP/CRM, and AI-driven automation built for complex enterprise requirements.',
      price: 'Custom Scope',
      period: 'annual or multi-stage',
      features: [
        'Bespoke Enterprise Software Architecture',
        'Deep Legacy Systems Integration',
        'Custom AI & Workflow Automation Engines',
        'SOC2 & ISO 27001 Security Hardening',
        'Strict Guaranteed SLA (99.99% Uptime)',
        '24/7/365 Dedicated SRE Support Team',
        'Executive Steering & Governance'
      ],
      highlight: false
    }
  ];

  // Case Studies
  const caseStudies = [
    {
      client: 'Apex Fintech Global',
      metric: '350% Throughput Surge',
      service: 'High-Concurrency Payment Engine',
      desc: 'Architected a microservices payment router handling 20,000+ transactions per minute with sub-50ms latency and bank-grade encryption.',
      tags: ['Node.js', 'Redis', 'Kubernetes', 'AWS']
    },
    {
      client: 'OmniHealth AI Systems',
      metric: '99.4% Diagnostic Accuracy',
      service: 'HIPAA-Compliant AI Platform',
      desc: 'Built an intelligent patient triage and clinical data platform utilizing secure RAG LLM pipelines compliant with strict HIPAA guidelines.',
      tags: ['Python', 'FastAPI', 'PyTorch', 'GCP']
    },
    {
      client: 'Veloce Logistics & Supply',
      metric: '42% Cost Reduction',
      service: 'Custom ERP & Fleet Automation',
      desc: 'Replaced disjointed legacy spreadsheets with an end-to-end automated ERP system tracking real-time telemetry across 1,200 vehicles.',
      tags: ['React', 'Next.js', 'PostgreSQL', 'Docker']
    }
  ];

  // FAQs
  const faqs = [
    {
      q: 'Who owns the intellectual property (IP) and code of the project?',
      a: 'You retain 100% ownership of all source code, design assets, database schemas, and intellectual property. Full repository access and documentation are handed over immediately upon milestone completion.'
    },
    {
      q: 'How do you structure project communication and sprint delivery?',
      a: 'We operate in 2-week agile sprints. You will have a dedicated Slack channel, Jira/Linear task board access, weekly demo calls, and daily asynchronous standup updates.'
    },
    {
      q: 'Can you work with our existing in-house engineering team?',
      a: 'Yes. Our dedicated pods integrate seamlessly into your existing Git workflows, CI/CD pipelines, and project management tools, acting as an organic extension of your engineering department.'
    },
    {
      q: 'What happens after the product is launched in production?',
      a: 'Every project includes a minimum 30-day post-launch warranty covering bug fixes and system stabilization. We also offer 24/7 ongoing maintenance, SRE support, and continuous feature development retainers.'
    },
    {
      q: 'How do you guarantee data security and compliance?',
      a: 'We follow security-by-design standards including AES-256 encryption at rest, TLS 1.3 in transit, role-based access control, regular penetration testing, and compliance readiness for SOC2 Type II, ISO 27001, and GDPR.'
    }
  ];

  return (
    <div className="font-plus-jakarta bg-[#F8FAFC] text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white">
      
      {/* 1. STICKY UNIFIED BRAND NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 p-1 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:border-blue-300 transition-all flex-shrink-0">
              <img src="/aaa-logo.png" alt="AAA Technologies Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col flex-shrink-0">
              <span className="font-outfit font-black text-lg text-slate-900 tracking-tight flex items-center space-x-1.5 leading-none">
                <span>AAA</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">TECHNOLOGIES</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-semibold mt-1">
                Cloud • Software • AI Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href.replace('#', ''))}
                className="text-slate-600 hover:text-blue-600 text-xs uppercase tracking-wider font-bold transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap"
            >
              Client &amp; Staff Portal
            </Link>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
              className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-1.5 whitespace-nowrap"
            >
              <span>Start Project</span>
              <ArrowForwardIcon className="text-xs!" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-700 hover:text-blue-600 p-2 rounded-xl bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-3 shadow-xl"
            >
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleScroll(e, item.href.replace('#', ''));
                  }}
                  className="block text-slate-700 hover:text-blue-600 py-2 text-sm font-semibold border-b border-slate-100"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-bold text-slate-700 py-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  Client &amp; Staff Portal
                </Link>
                <a
                  href="#contact"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleScroll(e, 'contact');
                  }}
                  className="text-center text-xs font-bold text-white py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25"
                >
                  Request Technical Consultation
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC]">
        {/* Soft Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-indigo-300/15 to-cyan-300/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left">
              
              <div className="inline-flex self-center lg:self-start items-center space-x-2.5 bg-blue-50/80 border border-blue-200/80 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                <span className="text-[11px] font-outfit text-blue-700 uppercase tracking-widest font-bold">
                  AAA Technologies • Cloud-Native &amp; AI Systems
                </span>
              </div>
              
              <h1 className="font-outfit font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.08]!">
                Engineering Scalable <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600">
                  Digital Products &amp; Cloud Architectures
                </span>
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                We partner with ambitious startups and global enterprises to design, build, and deploy high-concurrency web applications, AI automations, and resilient cloud infrastructure with complete intellectual property ownership.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#contact"
                  onClick={(e) => handleScroll(e, 'contact')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 text-sm transform hover:-translate-y-0.5"
                >
                  <span>Schedule Technical Discovery</span>
                  <ArrowForwardIcon className="text-sm!" />
                </a>
                <a
                  href="#services"
                  onClick={(e) => handleScroll(e, 'services')}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 hover:text-blue-600 font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm shadow-sm"
                >
                  <span>Explore Capabilities</span>
                </a>
              </div>

              {/* Live Reliability Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
                <div className="space-y-0.5">
                  <div className="text-2xl font-black font-outfit text-blue-600">99.99%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Guaranteed Uptime SLA</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-black font-outfit text-slate-900">250+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Deployed Systems</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-black font-outfit text-slate-900">&lt; 24hr</div>
                  <div className="text-[11px] text-slate-500 font-medium">Rapid Sprint Start</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-black font-outfit text-blue-600">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Client IP Ownership</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-blue-200 via-indigo-100 to-slate-200 shadow-xl">
                <div className="relative rounded-[14px] overflow-hidden bg-slate-900 aspect-[16/10] border border-slate-200">
                  <img
                    src={itHeroBanner}
                    alt="Cloud & AI IT Ecosystem"
                    className="w-full h-full object-cover filter brightness-95 hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Live Telemetry Badge 1 */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-2 shadow-md">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-slate-800">API Gateway: <span className="text-blue-600">18ms Latency</span></span>
                  </div>

                  {/* Floating Live Telemetry Badge 2 */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 p-3 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <CloudIcon className="text-base!" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Microservices Cluster</div>
                        <div className="text-[10px] text-slate-500 font-mono">48/48 Pods Healthy (Kubernetes)</div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      SOC2 Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Tech Stat Mini-Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white border border-slate-200/90 p-3.5 rounded-xl shadow-xl backdrop-blur-md items-center space-x-3 z-20">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <VerifiedIcon className="text-xl!" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">CI/CD Production Rollout</div>
                  <div className="text-[10px] text-slate-500 font-mono">Zero-Downtime Blue/Green Deploy</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. TECH LOGOS / ECOSYSTEM BANNER */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Engineering Cloud Ecosystems With
            </span>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-slate-700 font-mono text-xs sm:text-sm font-semibold">
              <span className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                <CloudIcon className="text-base text-blue-600" />
                <span>AWS &amp; GCP</span>
              </span>
              <span className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                <CodeIcon className="text-base text-indigo-600" />
                <span>React 19 &amp; Next.js</span>
              </span>
              <span className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                <TerminalIcon className="text-base text-emerald-600" />
                <span>Node &amp; Python</span>
              </span>
              <span className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                <SmartToyIcon className="text-base text-purple-600" />
                <span>OpenAI &amp; RAG AI</span>
              </span>
              <span className="hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                <StorageIcon className="text-base text-amber-600" />
                <span>PostgreSQL &amp; Redis</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES SECTION */}
      <section className="py-20 bg-[#F8FAFC]" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Comprehensive Technology Capabilities
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              End-to-End IT Services &amp; Digital Engineering
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              From initial product ideation and system architecture to high-velocity full-stack engineering and 24/7 site reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-200/90 hover:border-blue-400/80 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all relative flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 text-blue-600 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    {item.tag && (
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-outfit font-bold text-base text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Explore Architecture</span>
                  <ArrowForwardIcon className="text-xs! ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ENGINEERING SHOWCASE & DEVOPS SECTION */}
      <section className="py-20 bg-white border-t border-slate-200 relative overflow-hidden" id="showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
                DevOps &amp; Continuous Delivery
              </span>
              <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900 leading-tight">
                Built for High Concurrency, Microseconds Latency &amp; Zero Downtime
              </h2>
              <div className="h-1 w-12 bg-blue-600 rounded" />
              
              <p className="text-slate-600 text-sm font-normal leading-relaxed">
                Modern enterprise applications cannot afford infrastructure bottlenecks. Our engineering pods design resilient cloud environments with real-time observability, automated container failover, and strict regression test suites.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200/90 p-4 rounded-xl hover:bg-blue-50/40 hover:border-blue-200 transition-all">
                  <CheckCircleIcon className="text-blue-600 text-lg mt-0.5!" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Automated CI/CD Pipeline Automation</h4>
                    <p className="text-[11px] text-slate-600 font-normal mt-0.5">Every pull request is automatically built, linted, tested, and staged before human approval.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200/90 p-4 rounded-xl hover:bg-blue-50/40 hover:border-blue-200 transition-all">
                  <CheckCircleIcon className="text-blue-600 text-lg mt-0.5!" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Security-First Architecture &amp; Data Encryption</h4>
                    <p className="text-[11px] text-slate-600 font-normal mt-0.5">AES-256-GCM encryption, TLS 1.3, least-privilege IAM, and automated secret rotations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200/90 p-4 rounded-xl hover:bg-blue-50/40 hover:border-blue-200 transition-all">
                  <CheckCircleIcon className="text-blue-600 text-lg mt-0.5!" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">24/7 Incident Observability &amp; Alerting</h4>
                    <p className="text-[11px] text-slate-600 font-normal mt-0.5">Prometheus, Grafana, and Datadog monitoring with automated PagerDuty escalation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-blue-200 via-indigo-100 to-slate-200 shadow-xl">
                <div className="relative rounded-[14px] overflow-hidden bg-slate-900 aspect-[16/10] border border-slate-200">
                  <img
                    src={itDevOpsShowcase}
                    alt="DevOps & Agile Sprint Telemetry"
                    className="w-full h-full object-cover filter brightness-95 hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-lg text-[10px] font-mono text-slate-800 shadow-md">
                    Live Sprint Telemetry • Continuous QA &amp; SRE
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. ENGINEERING TECH STACK TABS */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200" id="stack">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Modern Technology Ecosystem
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              Proven Technologies for Scalable Platforms
            </h2>
            <p className="text-slate-600 text-sm font-normal">
              We select battle-tested, high-performance frameworks and cloud platforms tailored to your business needs.
            </p>

            {/* Tech Category Selector Buttons */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { id: 'cloud', label: 'Cloud & DevOps' },
                { id: 'backend', label: 'Backend & Databases' },
                { id: 'frontend', label: 'Frontend & Mobile' },
                { id: 'ai', label: 'AI & Machine Learning' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                      : 'bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-sm'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {techCategories[activeTab].map((tech, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 hover:border-blue-400 p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-mono font-bold text-xs">
                    {tech.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{tech.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{tech.tag}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  Verified
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. DELIVERY LIFECYCLE (WORKFLOW) */}
      <section className="py-20 bg-white border-t border-slate-200" id="process">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Structured Engineering Process
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              Agile Product Delivery Lifecycle
            </h2>
            <p className="text-slate-600 text-sm font-normal">
              Predictable, transparent sprints delivering continuous code commits, automated QA, and seamless deployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryStages.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200 hover:border-blue-400 hover:bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center font-mono text-sm mb-5 shadow-md shadow-blue-500/20">
                    {step.num}
                  </div>
                  <h3 className="font-outfit font-bold text-base text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. ENGAGEMENT PLANS & PRICING */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200" id="plans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Flexible Partnership Models
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              IT Engagement &amp; Delivery Plans
            </h2>
            <p className="text-slate-600 text-sm font-normal">
              Choose from fixed-scope product builds, dedicated monthly engineering pods, or ongoing 24/7 maintenance retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  plan.highlight
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-600/15 lg:-translate-y-2'
                    : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="space-y-6">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-3 ${
                      plan.highlight
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {plan.badge}
                    </span>
                    <h3 className="font-outfit font-black text-lg text-slate-900 leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <div className="text-2xl font-black font-outfit text-slate-900">
                      {plan.price}
                    </div>
                    <div className="text-[11px] text-blue-600 font-semibold">
                      {plan.period}
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2 text-xs text-slate-700">
                        <CheckIcon className="text-xs text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <a
                    href="#contact"
                    onClick={(e) => handleScroll(e, 'contact')}
                    className={`block w-full py-2.5 text-center text-xs font-bold rounded-xl transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110 shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    Select Partnership
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. CASE STUDIES / TESTIMONIALS */}
      <section className="py-20 bg-white border-t border-slate-200" id="case-studies">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Engineering Impact
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              Proven Results Across Global Industries
            </h2>
            <p className="text-slate-600 text-sm font-normal">
              See how our digital solutions have unlocked measurable business scaling for our clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((study, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/90 hover:border-blue-400 hover:bg-white p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="text-sm!" />
                    ))}
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono text-blue-600 font-bold">
                      {study.service}
                    </div>
                    <div className="text-2xl font-black font-outfit text-slate-900 mt-1">
                      {study.metric}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 font-normal leading-relaxed italic">
                    "{study.desc}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{study.client}</span>
                  <div className="flex space-x-1">
                    {study.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[9px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200" id="faqs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
              Got Questions?
            </span>
            <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
              Frequently Asked Technical Questions
            </h2>
            <p className="text-slate-600 text-sm font-normal">
              Clear answers regarding intellectual property, sprint cadence, pricing models, and security.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left focus:outline-none"
                  >
                    <span className="font-outfit font-bold text-sm text-slate-900">
                      {faq.q}
                    </span>
                    <span className="text-blue-600">
                      {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 bg-slate-50/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. TECHNICAL CONSULTATION & DISCOVERY FORM */}
      <section className="py-20 bg-white border-t border-slate-200 relative overflow-hidden" id="contact">
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[300px] bg-blue-400/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Contact Info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-outfit uppercase tracking-widest text-blue-600 font-bold">
                Direct Engineering Collaboration
              </span>
              <h2 className="font-outfit font-black text-3xl sm:text-4xl text-slate-900">
                Let's Build Your Next Digital Product
              </h2>
              <div className="h-1 w-12 bg-blue-600 rounded" />
              
              <p className="text-slate-600 text-sm font-normal leading-relaxed">
                Connect with our senior engineering architects. We evaluate your requirements, suggest optimal tech stacks, and provide a detailed architectural roadmap within 24 business hours.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3.5 bg-slate-50 border border-slate-200/90 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <EmailIcon className="text-lg!" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Technical Inquiries</div>
                    <div className="text-sm font-bold text-slate-900">contact@aaatechnologies.ae</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-slate-50 border border-slate-200/90 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <PhoneIcon className="text-lg!" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Direct Support &amp; WhatsApp</div>
                    <div className="text-sm font-bold text-slate-900">+971 4 000 0000</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 bg-slate-50 border border-slate-200/90 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <LocationOnIcon className="text-lg!" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono font-semibold">Global Technology Hubs</div>
                    <div className="text-sm font-bold text-slate-900">San Francisco • London • Dubai Silicon Oasis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Project Inquiry Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-8 rounded-2xl shadow-xl">
              <h3 className="font-outfit font-black text-xl text-slate-900 mb-1">
                Request a Technical Discovery Call
              </h3>
              <p className="text-xs text-slate-500 mb-6 font-normal">
                Fill out your project details. Strict NDA guaranteed for all submitted materials.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleFormChange}
                      required
                      placeholder="Jane"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleFormChange}
                      required
                      placeholder="Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      placeholder="jane@company.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="+971 50 000 0000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleFormChange}
                      placeholder="Acme Corp"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Capability Needed</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleFormChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="Custom Software & SaaS Development">Custom Software &amp; SaaS Development</option>
                      <option value="Web & Mobile App Development">Web &amp; Mobile App Development</option>
                      <option value="AI & Intelligent Automation">AI &amp; Intelligent Automation</option>
                      <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure &amp; DevOps</option>
                      <option value="Enterprise CRM & ERP Solutions">Enterprise CRM &amp; ERP Solutions</option>
                      <option value="UI/UX Product Design">UI/UX Product Design</option>
                      <option value="24/7 Managed IT Support">24/7 Managed IT Support</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Budget Range</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleFormChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="$5,000 - $15,000">$5,000 - $15,000 (MVP Prototype)</option>
                      <option value="$15,000 - $50,000">$15,000 - $50,000 (Production Launch)</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000 (Full Platform Build)</option>
                      <option value="$100,000+">$100,000+ (Enterprise Transformation)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Launch Timeline</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleFormChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                      <option value="Immediate (< 1 Month)">Immediate (&lt; 1 Month)</option>
                      <option value="1 - 3 Months">1 - 3 Months</option>
                      <option value="3 - 6 Months">3 - 6 Months</option>
                      <option value="Flexible / Exploratory">Flexible / Exploratory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Project Brief &amp; Architecture Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Briefly describe your product goals, tech preferences, or current challenges..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={leadMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {leadMutation.isPending ? (
                    <span>Submitting Discovery Request...</span>
                  ) : (
                    <>
                      <span>Submit Technical Request</span>
                      <ArrowForwardIcon className="text-sm!" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 12. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm">
                  <img src="/aaa-logo.png" alt="AAA Technologies Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-outfit font-black text-base text-white tracking-tight">
                  AAA TECHNOLOGIES
                </span>
              </div>
              <p className="text-xs font-normal leading-relaxed text-slate-400">
                Full-stack digital engineering, cloud infrastructure modernization, and AI systems architecture for high-growth enterprises worldwide.
              </p>
              <div className="text-[11px] font-mono text-blue-400">
                SOC2 Type II • ISO 27001 Ready • AWS Advanced Partner
              </div>
            </div>

            {/* Column 2: Capabilities */}
            <div className="space-y-3">
              <h4 className="font-outfit font-bold text-xs text-white uppercase tracking-wider">Capabilities</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-400 transition-colors">Custom Software &amp; SaaS</a></li>
                <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-400 transition-colors">Web &amp; Mobile Applications</a></li>
                <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-400 transition-colors">AI &amp; Intelligent Automation</a></li>
                <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-400 transition-colors">Cloud &amp; DevOps Engineering</a></li>
                <li><a href="#services" onClick={(e) => handleScroll(e, 'services')} className="hover:text-blue-400 transition-colors">Enterprise CRM &amp; ERP</a></li>
              </ul>
            </div>

            {/* Column 3: Portals & Navigation */}
            <div className="space-y-3">
              <h4 className="font-outfit font-bold text-xs text-white uppercase tracking-wider">Access &amp; Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-blue-400 transition-colors">Client &amp; Staff CRM Portal</Link></li>
                <li><a href="#plans" onClick={(e) => handleScroll(e, 'plans')} className="hover:text-blue-400 transition-colors">Engagement Plans</a></li>
                <li><a href="#case-studies" onClick={(e) => handleScroll(e, 'case-studies')} className="hover:text-blue-400 transition-colors">Engineering Case Studies</a></li>
                <li><a href="#faqs" onClick={(e) => handleScroll(e, 'faqs')} className="hover:text-blue-400 transition-colors">Technical FAQs</a></li>
              </ul>
            </div>

            {/* Column 4: Global Hubs */}
            <div className="space-y-3">
              <h4 className="font-outfit font-bold text-xs text-white uppercase tracking-wider">Global Locations</h4>
              <div className="space-y-1.5 text-xs text-slate-400 font-normal">
                <div>• San Francisco, CA (HQ R&amp;D)</div>
                <div>• London, UK (European Hub)</div>
                <div>• Dubai Silicon Oasis, UAE (MENA)</div>
                <div>• Singapore (APAC Delivery)</div>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
            <div>
              &copy; {new Date().getFullYear()} AAA Technologies Global Inc. All Rights Reserved.
            </div>
            <div className="space-x-4">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Security &amp; Compliance</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
