import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  CheckCircle,
} from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 9242545884',
    description: 'Available 24/7 for emergencies',
    color: 'from-green-500 to-emerald-400',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'support.fastmed247@gmail.com',
    description: 'We reply within 2 hours',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Ratanpur, Dhuliyan, Murshidabad, 742202',
    description: 'West Bengal, India',
    color: 'from-red-500 to-orange-400',
  },
  {
    icon: Clock,
    label: 'Working Hours',
    value: '24/7 Service',
    description: 'Medicines never sleep',
    color: 'from-violet-500 to-purple-400',
  },
];

const quickLinks = [
  { icon: Headphones, label: 'Founder Email', value: 'nh73342021@gmail.com' },
  { icon: MessageCircle, label: 'Twitter/X', value: '@nahid_hasan7334' },
  { icon: Globe, label: 'Website', value: 'www.fastmed.in' },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-fastmed-surface/30 to-fastmed-navy" />
      
      {/* Decorative */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fastmed-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fastmed-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Headphones className="w-4 h-4 text-fastmed-cyan" />
            <span className="text-sm text-fastmed-text-muted">Get in Touch</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-fastmed-text-muted max-w-2xl mx-auto">
            We are here to help. Reach out to us for any queries, support, or partnership opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="glass-card p-5 rounded-2xl flex items-start gap-4 
                         hover:border-fastmed-cyan/30 transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} 
                              flex items-center justify-center shadow-lg shrink-0
                              group-hover:shadow-glow transition-shadow`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-fastmed-text-muted uppercase tracking-wider mb-1">
                    {info.label}
                  </p>
                  <p className="text-white font-semibold">{info.value}</p>
                  <p className="text-fastmed-text-muted text-sm">{info.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="glass-card p-6 rounded-2xl mt-6"
            >
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <div key={link.label} className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-fastmed-cyan" />
                    <div>
                      <p className="text-white text-sm">{link.label}</p>
                      <p className="text-fastmed-text-muted text-xs">{link.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-2">Send us a Message</h3>
              <p className="text-fastmed-text-muted text-sm mb-8">
                Fill out the form below and we will get back to you as soon as possible.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Message Sent!</h4>
                  <p className="text-fastmed-text-muted text-center">
                    Thank you for reaching out. We will respond within 2 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-fastmed-text-muted mb-2">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                                 text-white placeholder-fastmed-text-muted/50
                                 focus:outline-none focus:border-fastmed-cyan/50 focus:ring-1 
                                 focus:ring-fastmed-cyan/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-fastmed-text-muted mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                                 text-white placeholder-fastmed-text-muted/50
                                 focus:outline-none focus:border-fastmed-cyan/50 focus:ring-1 
                                 focus:ring-fastmed-cyan/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-fastmed-text-muted mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                               text-white placeholder-fastmed-text-muted/50
                               focus:outline-none focus:border-fastmed-cyan/50 focus:ring-1 
                               focus:ring-fastmed-cyan/50 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-fastmed-text-muted mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                               text-white placeholder-fastmed-text-muted/50 resize-none
                               focus:outline-none focus:border-fastmed-cyan/50 focus:ring-1 
                               focus:ring-fastmed-cyan/50 transition-all"
                      placeholder="Tell us more about your query..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-3 py-4"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0, 229, 255, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
