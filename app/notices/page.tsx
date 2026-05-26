"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import NoticeCard from '@/components/notices/NoticeCard';
import { Notice } from '../../types';

const noticesData: Notice[] = [
  {
    id: '1',
    title: 'Welcome Program Date Announcement Coming Soon',
    content: 'The official date for the Prarambha will be announced within the next two weeks. Stay tuned for updates!',
    date: 'May 25, 2026',
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Venue Confirmation',
    content: 'Event venue details will be shared shortly through official notices',
    date: 'May 25, 2026',
    priority: 'low'
  },
  {
    id: '3',
    title: 'Call for Student Volunteers',
    content: 'We are looking for enthusiastic students to help organize and run Prarambha. If interested, please submit your application by May 8, 2025.',
    date: 'May 25, 2026',
    priority: 'high'
  },
  {
    id: '4',
    title: 'Sponsorship Opportunities Available',
    content: 'Organizations interested in sponsoring Prarambha can find details about various sponsorship packages on our website. Limited slots available.',
    date: 'March 1, 2026',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Event Committee Formation',
    content: 'The organizing committee for Prarambha 2082 has been formed. Committee members will meet next week to finalize the event details.',
    date: 'March 1, 2026',
    priority: 'low'
  },
];

export default function NoticesPage() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  
  const filteredNotices = filter === 'all' 
    ? noticesData
    : noticesData.filter(notice => notice.priority === filter);
  
  return (
    <PageTransition>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Notices & Updates
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Stay informed with the latest announcements regarding the Welcome Program.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800'
              }`}
            >
              All Notices
            </button>
            <button 
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'high' 
                  ? 'bg-rose-900 text-white dark:bg-rose-800 dark:text-white' 
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30'
              }`}
            >
              High Priority
            </button>
            <button 
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'medium' 
                  ? 'bg-yellow-600 text-white dark:bg-yellow-500 dark:text-white' 
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30'
              }`}
            >
              Medium Priority
            </button>
            <button 
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'low' 
                  ? 'bg-gray-600 text-white dark:bg-gray-700 dark:text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:hover:bg-gray-900/50'
              }`}
            >
              Low Priority
            </button>
          </motion.div>
          
          <div className="space-y-6">
            {filteredNotices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
            
            {filteredNotices.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                No notices match the selected filter.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
