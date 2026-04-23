import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Rocket,
  Brain,
  Globe,
  Zap,
  Heart,
  Truck,
  Smartphone,
  Shield,
  ChevronRight,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

const ambitions = [
  {
    icon: Brain,
    title: 'AI-Powered Diagnosis',
    description: 'Integrating artificial intelligence to provide preliminary health assessments and personalized medicine recommendations based on symptoms and medical history.',
    color: 'from-violet-500 to-purple-400',
    timeline: '2025 Q3',
  },
  {
    icon: Globe,
    title: 'Pan-India Expansion',
    description: 'Expanding our network to cover 100+ cities across India, ensuring every citizen has access to quality medicines within 30 minutes.',
    color: 'from-blue-500 to-cyan-400',
    timeline: '2025 Q4',
  },
  {
    icon: Zap,
    title: 'Drone Delivery',
    description: 'Pioneering autonomous drone delivery for emergency medicines, reducing delivery time to under 15 minutes in select zones.',
    color: 'from-amber-500 to-orange-400',
    timeline: '2026 Q2',
  },
  {
    icon: Heart,
    title: 'Telemedicine Platform',
    description: 'Launching video consultations with certified doctors, integrated seamlessly with medicine ordering for end-to-end healthcare.',
    color: 'from-red-500 to-pink-400',
    timeline: '2025 Q4',
  },
  {
    icon: Smartphone,
    title: 'Health Wearables Integration',
    description: 'Connecting with smartwatches and fitness trackers to monitor vitals and automatically suggest preventive care.',
    color: 'from-green-500 to-emerald-400',
    timeline: '2026 Q1',
  },
  {
    icon: Shield,
    title: 'Blockchain Authenticity',
    description: 'Implementing blockchain technology to verify medicine authenticity and track the entire supply chain.',
    color: 'from-indigo-500 to-blue-400',
    timeline: '2026 Q3',
  },
];

const milestones = [
  { year: '2024', label: 'Founded', value: 'Launch', icon: Rocket },
  { year: '2025', label: '50K Users', value: 'Growth', icon: TrendingUp },
  { year: '2026', label: '100 Cities', value: 'Scale', icon: Globe },
  { year: '2027', label: '1M Users', value: 'Impact', icon: Users },
];

export default function AmbitionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeAmbition, setActiveAmbition] = useState(0);

  return (
    <section
      ref={sectionRef}
      id="ambition"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-fastmed-surface/30 to-fastmed-navy" />
      
      {/* Decorative */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-fastmed-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-fastmed-cyan/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Target className="w-4 h-4 text-fastmed-cyan" />
            <span className="text-sm text-fastmed-text-muted">Future Roadmap</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our <span className="text-gradient">Ambition</span>
          </h2>
          <p className="text-fastmed-text-muted max-w-2xl mx-auto">
            We are building the future of healthcare delivery. Here's where we're headed.
          </p>
        </motion.div>

        {/* Milestones Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 
                          bg-gradient-to-r from-fastmed-cyan/50 via-fastmed-purple/50 to-fastmed-cyan/50" />
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="relative"
                >
                  <div className="glass-card p-6 rounded-2xl text-center relative 
                                hover:border-fastmed-cyan/30 transition-all cursor-pointer group">
                    {/* Dot on timeline */}
                    <div className="hidden lg:block absolute -top-3 left-1/2 -translate-x-1/2 
                                  w-6 h-6 rounded-full bg-fastmed-surface border-2 border-fastmed-cyan 
                                  group-hover:bg-fastmed-cyan transition-colors z-10" />
                    
                    <milestone.icon className="w-8 h-8 text-fastmed-cyan mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{milestone.year}</div>
                    <div className="text-sm text-fastmed-text-muted">{milestone.label}</div>
                    <div className="text-xs text-fastmed-cyan mt-1">{milestone.value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Ambition Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ambitions.map((ambition, i) => (
            <motion.div
              key={ambition.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setActiveAmbition(i)}
              className={`glass-card p-6 rounded-3xl cursor-pointer transition-all duration-300 ${
                activeAmbition === i ? 'border-fastmed-cyan/50 shadow-glow' : ''
              }`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ambition.color} 
                            flex items-center justify-center shadow-lg mb-5`}>
                <ambition.icon className="w-7 h-7 text-white" />
              </div>

              {/* Timeline badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                            bg-fastmed-cyan/10 border border-fastmed-cyan/20 mb-3">
                <Truck className="w-3 h-3 text-fastmed-cyan" />
                <span className="text-xs text-fastmed-cyan font-medium">{ambition.timeline}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{ambition.title}</h3>
              <p className="text-fastmed-text-muted text-sm leading-relaxed mb-4">
                {ambition.description}
              </p>

              {/* Learn more */}
              <div className="flex items-center gap-1 text-fastmed-cyan text-sm font-medium group">
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
            <Rocket className="w-10 h-10 text-fastmed-cyan mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Join Our Mission</h3>
            <p className="text-fastmed-text-muted mb-6">
              Be part of the healthcare revolution. Download FastMed today and experience 
              the future of medicine delivery.
            </p>
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 229, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
