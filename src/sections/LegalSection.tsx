import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  ChevronDown,
  Lock,
  Eye,
  Database,
  Share2,
  Cookie,
  Scale,
  UserCheck,
  Ban,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const privacyItems = [
  {
    icon: Lock,
    title: 'Data Security',
    content: 'We employ bank-grade encryption (AES-256) to protect your personal and medical information. All data is stored on secure, SOC 2 compliant servers located in India.',
  },
  {
    icon: Eye,
    title: 'Information We Collect',
    content: 'We collect your name, contact details, delivery address, prescription uploads, order history, and device information to provide our services effectively.',
  },
  {
    icon: Database,
    title: 'Data Retention',
    content: 'Your personal data is retained for as long as necessary to provide our services. Prescription data is stored for 2 years as per regulatory requirements.',
  },
  {
    icon: Share2,
    title: 'Third-Party Sharing',
    content: 'We share your information only with licensed pharmacies for order fulfillment and delivery partners for logistics. We never sell your data to advertisers.',
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: 'We use cookies to enhance your browsing experience, remember preferences, and analyze site traffic. You can manage cookie preferences in your browser settings.',
  },
];

const termsItems = [
  {
    icon: Scale,
    title: 'Acceptance of Terms',
    content: 'By accessing or using FastMed, you agree to be bound by these Terms & Conditions. If you disagree with any part, you may not access the service.',
  },
  {
    icon: UserCheck,
    title: 'User Eligibility',
    content: 'You must be at least 18 years old to use FastMed. By using our service, you represent that you meet this requirement and have the legal capacity to enter into binding agreements.',
  },
  {
    icon: Ban,
    title: 'Prohibited Activities',
    content: 'Users may not misuse the platform for illegal drug trading, submit fraudulent prescriptions, or attempt to breach our security systems. Violation results in immediate account termination.',
  },
  {
    icon: AlertTriangle,
    title: 'Medical Disclaimer',
    content: 'FastMed is a medicine delivery platform, not a medical advisory service. Always consult healthcare professionals before taking medications. We are not liable for adverse drug reactions.',
  },
];

interface AccordionItemProps {
  item: typeof privacyItems[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, index, isOpen, onToggle }: AccordionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border-b border-white/5 last:border-0"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group"
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fastmed-cyan/10 flex items-center justify-center 
                        group-hover:bg-fastmed-cyan/20 transition-colors">
            <item.icon className="w-5 h-5 text-fastmed-cyan" />
          </div>
          <span className="text-white font-medium">{item.title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-fastmed-text-muted" />
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-fastmed-text-muted text-sm leading-relaxed pb-4 pl-[52px]">
              {item.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LegalSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const currentItems = activeTab === 'privacy' ? privacyItems : termsItems;

  return (
    <section
      ref={sectionRef}
      id="legal"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-fastmed-surface/50 to-fastmed-navy" />
      
      {/* Decorative */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-fastmed-cyan/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Scale className="w-4 h-4 text-fastmed-cyan" />
            <span className="text-sm text-fastmed-text-muted">Legal Information</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Transparency & <span className="text-gradient">Trust</span>
          </h2>
          <p className="text-fastmed-text-muted max-w-2xl mx-auto">
            Your trust is our foundation. Read our policies to understand how we protect your data and operate our platform.
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="glass-card p-1.5 rounded-2xl flex gap-1">
            <motion.button
              onClick={() => { setActiveTab('privacy'); setOpenItems([0]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'privacy'
                  ? 'bg-fastmed-cyan text-fastmed-navy shadow-glow'
                  : 'text-fastmed-text-muted hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </motion.button>
            <motion.button
              onClick={() => { setActiveTab('terms'); setOpenItems([0]); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'terms'
                  ? 'bg-fastmed-cyan text-fastmed-navy shadow-glow'
                  : 'text-fastmed-text-muted hover:text-white'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              Terms & Conditions
            </motion.button>
          </div>
        </motion.div>

        {/* Content Cards */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-8 rounded-3xl h-full">
              {activeTab === 'privacy' ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fastmed-cyan to-blue-500 
                                flex items-center justify-center mb-6 shadow-glow">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Privacy Policy</h3>
                  <p className="text-fastmed-text-muted leading-relaxed mb-6">
                    At FastMed, we value your privacy. This policy outlines how we collect, use, 
                    and protect your personal information when you use our platform.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-cyan" />
                      <span className="text-fastmed-text-muted">Last updated: January 2025</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-cyan" />
                      <span className="text-fastmed-text-muted">Compliant with IT Act 2000</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-cyan" />
                      <span className="text-fastmed-text-muted">GDPR-aligned practices</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fastmed-purple to-violet-500 
                                flex items-center justify-center mb-6 shadow-lg">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Terms & Conditions</h3>
                  <p className="text-fastmed-text-muted leading-relaxed mb-6">
                    Welcome to FastMed! These terms govern your use of our platform and services. 
                    Please read them carefully before using our application.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-purple" />
                      <span className="text-fastmed-text-muted">Effective from: Jan 2025</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-purple" />
                      <span className="text-fastmed-text-muted">Jurisdiction: Delhi, India</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-fastmed-purple" />
                      <span className="text-fastmed-text-muted">Arbitration clause included</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-6 rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentItems.map((item, i) => (
                    <AccordionItem
                      key={item.title}
                      item={item}
                      index={i}
                      isOpen={openItems.includes(i)}
                      onToggle={() => toggleItem(i)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Full Privacy Policy CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-6 rounded-2xl max-w-lg mx-auto inline-flex flex-col items-center gap-4">
            <p className="text-fastmed-text-muted text-sm">
              Have questions about our policies?{' '}
              <a href="#contact" className="text-fastmed-cyan hover:underline">
                Contact our support team
              </a>
            </p>
            <motion.a
              href="./privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full 
                       bg-fastmed-cyan/10 border border-fastmed-cyan/30 
                       text-fastmed-cyan font-medium text-sm
                       hover:bg-fastmed-cyan/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4" />
              View Full Privacy Policy
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
