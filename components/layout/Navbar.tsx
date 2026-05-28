"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Calendar, Info, Home, Bell, Users, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { path: '/about', label: 'About', icon: <Info className="w-5 h-5" /> },
  { path: '/sponsor', label: 'Sponsors', icon: <Users className="w-5 h-5" /> },
  { path: '/schedule', label: 'Schedule', icon: <Calendar className="w-5 h-5" /> },
  { path: '/notices', label: 'Notices', icon: <Bell className="w-5 h-5" /> },
  { path: '/archives', label: 'Archives', icon: <Video className="w-5 h-5" /> },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Close menu when viewport becomes large (lg breakpoint = 1024px)
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <header 
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'py-3 bg-white/90 dark:bg-neutral-900/60 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-xl font-bold tracking-tight text-rose-900 dark:text-rose-400"
          >
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold">Prarambha 2082</span>
            </span>
          </Link>

          <div className="flex items-center lg:hidden gap-3">
            {/* <ThemeToggle /> */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={clsx(
                    'px-4 py-2 mx-1 rounded-full font-medium transition-all duration-200 flex items-center gap-2',
                    isActive 
                      ? 'text-rose-955 dark:text-rose-300 bg-orange-50 dark:bg-rose-900/30' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-rose-900 hover:bg-orange-50/50 dark:hover:text-rose-300 dark:hover:bg-rose-900/20'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            {/* <div className="ml-4"> */}
              {/* <ThemeToggle /> */}
            {/* </div> */}
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-white dark:bg-black border-t border-gray-100 dark:border-neutral-800 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={clsx(
                      'py-3 px-4 my-1 rounded-lg flex items-center gap-3 font-medium transition-colors',
                      isActive 
                        ? 'bg-orange-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-300' 
                        : 'text-gray-600 dark:text-gray-300'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
