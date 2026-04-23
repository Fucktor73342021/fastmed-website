import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Twitter, GraduationCap, Heart, Droplets, Stethoscope, Home } from 'lucide-react';

export default function FounderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-fastmed-surface/50 to-fastmed-navy" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fastmed-purple/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fastmed-cyan/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <GraduationCap className="w-4 h-4 text-fastmed-cyan" />
            <span className="text-sm text-fastmed-text-muted">Leadership</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Meet Our <span className="text-gradient">Founder</span>
          </h2>
          <p className="text-fastmed-text-muted max-w-2xl mx-auto">
            The visionary behind FastMed, on a mission to save lives through timely healthcare access.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-fastmed-cyan/30 to-fastmed-purple/30 
                            rounded-3xl blur-2xl scale-95" />
              
              {/* Image container */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative w-72 h-96 sm:w-80 sm:h-[28rem] rounded-3xl overflow-hidden 
                         border-2 border-white/10 shadow-2xl"
              >
                <img
                  src="/images/founder.png"
                  alt="Founder & CEO"
                  className="w-full h-full object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-fastmed-navy/80 via-transparent to-transparent" />
                
                {/* Name badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Founder & CEO</h3>
                  <p className="text-fastmed-cyan font-medium">FastMed</p>
                </div>
              </motion.div>

              {/* Floating stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="absolute -top-4 -right-4 glass-card p-4 rounded-2xl shadow-xl"
              >
                <div className="text-2xl font-bold text-white">21</div>
                <div className="text-xs text-fastmed-text-muted">Years Old</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 glass-card p-4 rounded-2xl shadow-xl"
              >
                <div className="text-2xl font-bold text-fastmed-cyan">B.Sc</div>
                <div className="text-xs text-fastmed-text-muted">Physics Hons.</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Founder Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Quote */}
            <div className="relative">
              <Quote className="absolute -top-4 -left-2 w-10 h-10 text-fastmed-cyan/20" />
              <p className="text-xl sm:text-2xl text-white/90 italic leading-relaxed pl-8">
                "Time should never decide who lives and who doesn't.
                We exist to make sure help reaches before it's too late."
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <p className="text-fastmed-text-muted leading-relaxed">
                A 21-year-old ambitious student from Murshidabad University, pursuing B.Sc Physics (Honours), 
                now working full-time as a developer and CEO.
              </p>
              <p className="text-fastmed-text-muted leading-relaxed">
                He is not building FastMed for profit — but to solve one of India's most critical problems: 
                the lack of organized, fast, and accessible healthcare systems.
              </p>
              <p className="text-fastmed-text-muted leading-relaxed">
                FastMed aims to go beyond medicine delivery — building a complete emergency ecosystem including:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-fastmed-text-muted text-sm">
                  <Droplets className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Blood SOS system</span>
                </li>
                <li className="flex items-center gap-2 text-fastmed-text-muted text-sm">
                  <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Oxygen SOS system</span>
                </li>
                <li className="flex items-center gap-2 text-fastmed-text-muted text-sm">
                  <Stethoscope className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Fast hospital connectivity</span>
                </li>
                <li className="flex items-center gap-2 text-fastmed-text-muted text-sm">
                  <Home className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Affordable stay options for patient families near hospitals</span>
                </li>
                <li className="flex items-center gap-2 text-fastmed-text-muted text-sm">
                  <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Real-time emergency response coordination</span>
                </li>
              </ul>
              <p className="text-white/90 font-medium leading-relaxed">
                This is not just a startup. This is a mission to save time — because time saves lives.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <motion.a
                href="mailto:nh73342021@gmail.com"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center
                         hover:border-fastmed-cyan/50 transition-colors"
              >
                <svg className="w-5 h-5 text-fastmed-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </motion.a>
              <motion.a
                href="https://x.com/nahid_hasan7334"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full glass-card flex items-center justify-center
                         hover:border-fastmed-cyan/50 transition-colors"
              >
                <Twitter className="w-5 h-5 text-fastmed-cyan" />
              </motion.a>
              <div className="ml-4 text-fastmed-text-muted text-sm">
                Connect with the founder — open to collaboration & mentorship
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
