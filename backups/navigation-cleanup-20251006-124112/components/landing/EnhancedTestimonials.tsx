'use client';

import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  metrics: {
    roas?: string;
    time?: string;
    growth?: string;
  };
}

interface EnhancedTestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

export function EnhancedTestimonials({ testimonials, className = '' }: EnhancedTestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [testimonials.length, isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45
    })
  };

  return (
    <motion.section
      ref={ref}
      className={`py-20 px-4 relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-gray-900 dark:text-white">Loved by</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-animate">
              Marketers Worldwide
            </span>
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            See what industry leaders are saying about PulseBridge.ai
          </motion.p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          className="relative h-96 sm:h-80 md:h-96"
          variants={itemVariants}
        >
          {/* Navigation buttons */}
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            onClick={prevTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            onClick={nextTestimonial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Testimonial slides */}
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentIndex}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.4 },
                rotateY: { duration: 0.4 }
              }}
              className="absolute inset-0 flex items-center justify-center perspective-1000"
            >
              <TestimonialCard testimonial={testimonials[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation dots */}
        <motion.div
          className="flex justify-center space-x-3 mt-12"
          variants={itemVariants}
        >
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8'
                  : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* Auto-play indicator */}
        <motion.div
          className="flex justify-center mt-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <motion.div
              className={`w-2 h-2 rounded-full ${
                isAutoPlaying ? 'bg-green-400' : 'bg-gray-400'
              }`}
              animate={isAutoPlaying ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="max-w-4xl mx-auto px-8">
      <motion.div
        className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
        whileHover={{ scale: 1.02, rotateY: 2 }}
        transition={{ duration: 0.3 }}
      >
        {/* Avatar section */}
        <motion.div
          className="flex-shrink-0 relative"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-lg" />
          
          {/* Avatar */}
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/20">
            {testimonial.avatar}
          </div>
          
          {/* Rating stars */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content section */}
        <div className="flex-1 text-center md:text-left">
          {/* Quote icon */}
          <Quote className="w-8 h-8 text-blue-400 mb-4 mx-auto md:mx-0" />
          
          {/* Quote text */}
          <motion.p
            className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-6 italic leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            "{testimonial.quote}"
          </motion.p>
          
          {/* Author info and metrics */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.div
              className="mb-4 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="font-bold text-lg text-gray-900 dark:text-white">
                {testimonial.author}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {testimonial.role}, {testimonial.company}
              </p>
            </motion.div>
            
            {/* Metrics badges */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center md:justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {testimonial.metrics.roas && (
                <span className="px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-bold text-sm border border-green-400/30">
                  {testimonial.metrics.roas}
                </span>
              )}
              {testimonial.metrics.time && (
                <span className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 font-medium text-sm border border-blue-400/30">
                  {testimonial.metrics.time}
                </span>
              )}
              {testimonial.metrics.growth && (
                <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 font-medium text-sm border border-purple-400/30">
                  {testimonial.metrics.growth}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}