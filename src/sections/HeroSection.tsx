import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, ArrowDown, Sparkles, Zap, Shield } from 'lucide-react';
import ThreeScene from '@/components/ThreeScene';

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <ThreeScene />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy/40 via-transparent to-fastmed-navy pointer-events-none" />

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: textOpacity, scale }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
        >
          <Sparkles className="w-4 h-4 text-fastmed-cyan" />
          <span className="text-sm text-fastmed-text-muted">
            Building trust across India, one delivery at a time
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6"
        >
          <span className="text-white">Fast</span>
          <span className="text-gradient">Med</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl sm:text-2xl md:text-3xl text-fastmed-text-muted mb-4 font-light"
        >
          Medicines delivered{' '}
          <span className="text-fastmed-cyan font-semibold">instantly</span>
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-base text-fastmed-text-muted/70 max-w-xl mx-auto mb-10"
        >
          Get your medicines delivered within 30 minutes. Upload prescriptions, 
          order OTC products, and track your delivery in real-time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            className="btn-primary text-base px-8 py-4 flex items-center gap-3"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 229, 255, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Download App
          </motion.button>
          <motion.button
            className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold 
                     hover:bg-white/5 hover:border-fastmed-cyan/50 transition-all duration-300
                     flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="w-5 h-5 text-fastmed-cyan" />
            Learn More
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[
            { value: '30', label: 'Min Delivery', icon: Zap },
            { value: '5K+', label: 'Medicines', icon: Shield },
            { value: '99%', label: 'Satisfaction', icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-fastmed-cyan" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-fastmed-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-fastmed-text-muted">Scroll to explore</span>
          <ArrowDown className="w-5 h-5 text-fastmed-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}
