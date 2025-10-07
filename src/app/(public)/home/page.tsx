'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, TrendingUp, Shield, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900">
      {/* Animated Northern Lights Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Aurora Layers */}
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(45deg, 
              transparent 30%, 
              rgba(16, 185, 129, 0.3) 40%, 
              rgba(59, 130, 246, 0.4) 50%, 
              rgba(167, 139, 250, 0.3) 60%, 
              transparent 70%
            )`
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            backgroundSize: ['100% 100%', '120% 120%']
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
        
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(-45deg, 
              transparent 20%, 
              rgba(34, 197, 94, 0.4) 35%, 
              rgba(99, 102, 241, 0.3) 50%, 
              rgba(236, 72, 153, 0.3) 65%, 
              transparent 80%
            )`
          }}
          animate={{
            backgroundPosition: ['100% 0%', '0% 100%'],
            backgroundSize: ['110% 110%', '130% 130%']
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 2
          }}
        />

        {/* Floating Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="p-6">
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Autopilot</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/"
                className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium transition-all duration-300"
              >
                Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <motion.div 
                className="inline-flex items-center px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-medium mb-8"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(16, 185, 129, 0.3)',
                    '0 0 40px rgba(16, 185, 129, 0.5)',
                    '0 0 20px rgba(16, 185, 129, 0.3)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Marketing Automation
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Marketing on
                <motion.span 
                  className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  Autopilot
                </motion.span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your advertising with AI that never sleeps. Optimize campaigns across 
                Google, Meta, LinkedIn, and more with autonomous intelligence.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/dashboard"
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center"
                >
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/campaigns"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300"
                >
                  View Campaigns
                </Link>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Instant Optimization",
                  description: "AI algorithms optimize your campaigns in real-time for maximum ROI"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Performance Analytics",
                  description: "Advanced insights and predictions to stay ahead of market trends"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Enterprise Security",
                  description: "Bank-level security with SOC 2 compliance and data protection"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                >
                  <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer 
          className="p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p className="text-slate-400">
            Trusted by marketing teams worldwide • Built with ❤️ by Autopilot
          </p>
        </motion.footer>
      </div>
    </div>
  );
}