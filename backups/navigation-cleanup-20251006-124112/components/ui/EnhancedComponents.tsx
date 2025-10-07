'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Simple stub implementations for disabled EnhancedComponents
export const Button = motion.button;
export const Card = motion.div;
export const Badge = motion.span;
export const Spinner = () => <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />;
export const Avatar = motion.div;
export const Progress = motion.div;