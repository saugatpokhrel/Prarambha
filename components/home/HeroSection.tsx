"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const heroImages = [
  "/photos/bctBoys.jpg",
  "/photos/bctGirls.jpeg",
  "/photos/beiGroup.jpg",
  "/photos/bctGroup.jpg",
  "/photos/beiSenior.jpeg",
  "/photos/bctSenior.jpeg",
];

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black min-h-screen flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 to-rose-900/80 dark:from-rose-955/30 dark:to-gray-900 z-0"></div>
      
      <div className="absolute top-20 right-0 w-72 h-72 bg-pink-300/10 dark:bg-pink-700/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-900/10 dark:bg-rose-700/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-10 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1 relative group rounded-2xl p-[1px] bg-gradient-to-b from-orange-200/50 to-rose-200/50 dark:from-neutral-800/60 dark:to-rose-900/30 backdrop-blur-md shadow-xl"
          >
            <div className="bg-white/70 dark:bg-black/60 rounded-[15px] p-6 sm:p-8 md:p-10 relative overflow-hidden">
              {/* Inner ambient glows behind text */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 dark:bg-orange-500/15 rounded-full filter blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 dark:bg-rose-500/15 rounded-full filter blur-2xl pointer-events-none"></div>

              <div className="relative z-10">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-rose-900 dark:text-rose-300 bg-orange-50 dark:bg-rose-900/30 rounded-full"
                >
                  <span className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2" />
                    <span>Coming Soon</span>
                  </span>
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6"
                >
                  <span className="block">Your First Step</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 to-orange-500 dark:from-rose-400 dark:to-orange-300">
                    Prarambha 
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-900 to-orange-500 dark:from-rose-400 dark:to-orange-300">
                    2k82
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 md:pr-10"
                >
                  Organized by your Seniors of Department of Electronics and Computer Engineering at Thapathali Campus, IOE.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link 
                    href="/schedule" 
                    className="px-6 py-3 bg-rose-900 text-white font-medium rounded-lg shadow-md hover:bg-rose-955 transition-colors duration-200 flex items-center group"
                  >
                    View Schedule
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link 
                    href="/about" 
                    className="px-6 py-3 bg-white dark:bg-neutral-900 text-rose-900 dark:text-rose-400 font-medium border border-orange-200 dark:border-neutral-800 rounded-lg hover:bg-orange-50 dark:hover:bg-neutral-800 transition-colors duration-200"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-900/20 to-transparent z-10"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={heroImages[currentImageIndex]} 
                alt="DOECE Welcome Program"
                className="w-full h-auto max-h-[500px] object-cover object-center rounded-2xl"
              />
            </div>
            
            {/* Floating badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white dark:bg-neutral-900 rounded-lg px-4 py-2 shadow-lg flex items-center space-x-2"
            >
              <span className="w-3 h-3 bg-black rounded-full"></span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Join Us</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-5 right-5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg"
            >
              <span className="text-sm font-medium text-rose-900 dark:text-rose-400">2025 Edition</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
