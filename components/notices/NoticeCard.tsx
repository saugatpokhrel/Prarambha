"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Notice } from '../../types';
import clsx from 'clsx';

interface NoticeCardProps {
  notice: Notice;
}

const priorityConfig = {
  high: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    textColor: 'text-red-900 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  medium: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  low: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    textColor: 'text-gray-700 dark:text-gray-400',
    borderColor: 'border-gray-300 dark:border-gray-700',
  },
};

const NoticeCard: React.FC<NoticeCardProps> = ({ notice }) => {
  const config = priorityConfig[notice.priority];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        "rounded-xl p-6 border",
        config.bgColor,
        config.borderColor
      )}
    >
      <div className="flex items-start gap-4">
        <div className={clsx("p-2 rounded-full", config.bgColor)}>
          <span className={config.textColor}>{config.icon}</span>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className={clsx("text-lg font-semibold", config.textColor)}>
              {notice.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {notice.date}
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300">
            {notice.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NoticeCard;
