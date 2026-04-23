import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Search,
  Home,
  ShoppingBag,
  User,
  Pill,
  Thermometer,
  Heart,
  Package,
  Baby,
  Eye,
  Plus,
  Clock,
  MapPin,
  ChevronRight,
  Star,
  TrendingUp,
  Stethoscope,
  Shield,
} from 'lucide-react';

const categories = [
  { name: 'Medicines', icon: Pill, color: 'from-blue-500 to-cyan-400' },
  { name: 'Fever & Cold', icon: Thermometer, color: 'from-red-500 to-orange-400' },
  { name: 'Vitamins', icon: Heart, color: 'from-green-500 to-emerald-400' },
  { name: 'First Aid', icon: Package, color: 'from-red-600 to-red-400' },
  { name: 'Baby Care', icon: Baby, color: 'from-pink-500 to-rose-400' },
  { name: 'Eye Care', icon: Eye, color: 'from-violet-500 to-purple-400' },
];

const popularMedicines = [
  {
    name: 'Paracetamol 500mg',
    price: 45,
    originalPrice: 60,
    tag: 'Bestseller',
    tagColor: 'bg-amber-500',
    image: '/images/med-paracetamol.png',
    rating: 4.8,
  },
  {
    name: 'Vitamin C 1000mg',
    price: 299,
    originalPrice: 399,
    tag: 'RX',
    tagColor: 'bg-red-500',
    image: '/images/med-vitaminc.png',
    rating: 4.6,
  },
  {
    name: 'First Aid Kit',
    price: 599,
    originalPrice: 799,
    tag: 'OTC',
    tagColor: 'bg-green-500',
    image: '/images/med-firstaid.png',
    rating: 4.9,
  },
  {
    name: 'Baby Care Set',
    price: 349,
    originalPrice: 499,
    tag: 'Popular',
    tagColor: 'bg-blue-500',
    image: '/images/med-babycare.png',
    rating: 4.7,
  },
];

const bottomNav = [
  { name: 'Home', icon: Home },
  { name: 'Search', icon: Search },
  { name: 'Orders', icon: ShoppingBag },
  { name: 'Profile', icon: User },
];

function MedicineCard({ medicine, index }: { medicine: typeof popularMedicines[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 
                 border border-gray-100 relative group cursor-pointer"
    >
      {/* Tag */}
      <div className={`absolute top-3 left-3 ${medicine.tagColor} text-white text-[10px] font-bold 
                      px-2 py-0.5 rounded-full uppercase tracking-wider`}>
        {medicine.tag}
      </div>

      {/* Image */}
      <div className="aspect-square rounded-xl bg-gradient-to-b from-gray-50 to-white 
                    flex items-center justify-center mb-3 overflow-hidden">
        <img
          src={medicine.image}
          alt={medicine.name}
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{medicine.name}</h4>
      
      {/* Rating */}
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span className="text-xs text-gray-500">{medicine.rating}</span>
      </div>

      {/* Price & Add */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-gray-900">Rs. {medicine.price}</span>
          <span className="text-xs text-gray-400 line-through">Rs. {medicine.originalPrice}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full bg-fastmed-navy flex items-center justify-center
                   hover:bg-fastmed-cyan transition-colors duration-200"
        >
          <Plus className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function AppUISection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section
      ref={sectionRef}
      id="app"
      className="relative py-20 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-fastmed-navy via-fastmed-surface to-fastmed-navy" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-fastmed-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-fastmed-purple/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Stethoscope className="w-4 h-4 text-fastmed-cyan" />
            <span className="text-sm text-fastmed-text-muted">Our App Interface</span>
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Experience the <span className="text-gradient">Future</span>
          </h2>
          <p className="text-fastmed-text-muted max-w-2xl mx-auto">
            A seamless, intuitive interface designed for speed and simplicity. 
            Order medicines in just a few taps.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="w-[340px] sm:w-[380px] bg-white rounded-[3rem] shadow-2xl overflow-hidden 
                          border-8 border-gray-800 relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-800 
                            rounded-b-2xl z-20" />
              
              {/* Status Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 pt-10 pb-6 px-5 
                            rounded-t-[2.5rem] relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute bottom-[-30%] left-[-10%] w-24 h-24 bg-white/10 rounded-full" />
                
                <div className="relative z-10">
                  <p className="text-white/80 text-sm mb-1">Good evening,</p>
                  <h3 className="text-white text-2xl font-bold mb-4">Divyanshu</h3>
                  
                  {/* 10-Min Delivery Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 
                             border border-white/20"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm">10-Minute Delivery*</p>
                      <div className="flex items-center gap-1 text-white/70 text-xs">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>Delivering to your location</span>
                      </div>
                      <p className="text-white/40 text-[9px] mt-1 leading-tight">
                        *10-minute delivery applicable after order dispatch, with accurate location and within 1-2 km from store.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 
                              shadow-sm border border-gray-100">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search medicines, vitamins..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Categories Grid */}
              <div className="px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-800">Categories</h4>
                  <button className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
                    See All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat, i) => (
                    <motion.button
                      key={cat.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl 
                               shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} 
                                    flex items-center justify-center shadow-lg`}>
                        <cat.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] font-medium text-gray-700">{cat.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Popular Medicines */}
              <div className="px-4 py-3 bg-gray-50 pb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-800">Popular Medicines</h4>
                  <button className="text-xs text-blue-600 font-medium flex items-center gap-0.5">
                    See All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {popularMedicines.map((med, i) => (
                    <MedicineCard key={med.name} medicine={med} index={i} />
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 
                            px-6 py-3 flex items-center justify-around z-10">
                {bottomNav.map((item) => (
                  <motion.button
                    key={item.name}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveTab(item.name)}
                    className={`flex flex-col items-center gap-1 ${
                      activeTab === item.name ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      activeTab === item.name ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className="text-[10px] font-medium">{item.name}</span>
                    {activeTab === item.name && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-0 w-8 h-0.5 bg-blue-600 rounded-full"
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Bottom padding for nav */}
              <div className="h-16 bg-gray-50" />
            </div>

            {/* Phone shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 
                          bg-black/20 blur-xl rounded-full" />
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-6 max-w-md"
          >
            <FeatureCard
              icon={Clock}
              title="30-Minute Delivery"
              description="Our network of local pharmacies ensures your medicines reach you within 30 minutes of ordering."
              color="from-blue-500 to-cyan-400"
              delay={0}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Track Your Order"
              description="Real-time tracking from pharmacy to your doorstep. Know exactly when your medicines will arrive."
              color="from-green-500 to-emerald-400"
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Verified Products"
              description="All medicines are sourced from licensed pharmacies and verified for authenticity."
              color="from-violet-500 to-purple-400"
              delay={0.2}
            />
            <FeatureCard
              icon={Heart}
              title="Health Reminders"
              description="Never miss a dose with personalized medication reminders and refill alerts."
              color="from-pink-500 to-rose-400"
              delay={0.3}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  delay: number;
}

function FeatureCard({
  icon: IconComponent,
  title,
  description,
  color,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02, x: 5 }}
      className="glass-card p-5 flex items-start gap-4 group cursor-pointer
               hover:border-fastmed-cyan/30 transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} 
                    flex items-center justify-center shadow-lg shrink-0
                    group-hover:shadow-glow transition-shadow`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="text-white font-semibold mb-1">{title}</h4>
        <p className="text-fastmed-text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
