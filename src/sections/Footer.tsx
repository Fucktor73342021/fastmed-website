import { motion } from 'framer-motion';
import {
  Pill,
  Heart,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

const footerLinks = {
  company: [
    { name: 'About Us', href: '#founder' },
    { name: 'Our Team', href: '#founder' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  services: [
    { name: 'Medicine Delivery', href: '#' },
    { name: 'Prescription Upload', href: '#' },
    { name: 'Health Consultation', href: '#' },
    { name: 'Lab Tests', href: '#' },
    { name: 'Health Articles', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Privacy Policy', href: './privacy-policy.html', target: '_blank' },
    { name: 'Terms of Service', href: '#legal' },
    { name: 'Return Policy', href: '#' },
    { name: 'Contact Us', href: '#contact' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://x.com/nahid_hasan7334', label: 'Twitter/X', target: '_blank' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-fastmed-surface/50 border-t border-white/5">
      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto section-padding -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[600px] h-[600px] bg-fastmed-cyan/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get your <span className="text-gradient">medicines?</span>
            </h3>
            <p className="text-fastmed-text-muted max-w-xl mx-auto mb-8">
              Download the FastMed app now and experience healthcare at your fingertips. 
              Available on iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                className="btn-primary flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                App Store
              </motion.button>
              <motion.button
                className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold 
                         hover:bg-white/5 hover:border-fastmed-cyan/50 transition-all duration-300
                         flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                Google Play
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto section-padding pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <motion.a
              href="#"
              className="flex items-center gap-2 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fastmed-cyan to-fastmed-purple 
                            flex items-center justify-center shadow-glow">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Fast<span className="text-gradient">Med</span>
              </span>
            </motion.a>
            <p className="text-fastmed-text-muted text-sm leading-relaxed mb-6 max-w-sm">
              India's fastest medicine delivery platform. We bring pharmacies to your 
              doorstep, ensuring you never miss a dose.
            </p>
            
            {/* Contact mini */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-fastmed-cyan" />
                <span className="text-fastmed-text-muted">+91 9242545884</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-fastmed-cyan" />
                <span className="text-fastmed-text-muted">support.fastmed247@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-fastmed-cyan" />
                <span className="text-fastmed-text-muted">Ratanpur, Dhuliyan, Murshidabad, 742202</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.target || '_self'}
                  rel={social.target ? 'noopener noreferrer' : ''}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center
                           hover:border-fastmed-cyan/50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-fastmed-cyan" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-fastmed-text-muted text-sm hover:text-fastmed-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-fastmed-text-muted text-sm hover:text-fastmed-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={(link as Record<string, string>).target || '_self'}
                    rel={(link as Record<string, string>).target ? 'noopener noreferrer' : ''}
                    className="text-fastmed-text-muted text-sm hover:text-fastmed-cyan transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-fastmed-text-muted text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} FastMed. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-fastmed-text-muted text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-400 fill-red-400" /> in India
            </span>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl glass-card flex items-center justify-center
                       hover:border-fastmed-cyan/50 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5 text-fastmed-cyan" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
