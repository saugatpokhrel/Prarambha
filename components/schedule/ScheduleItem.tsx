"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, User } from 'lucide-react';
import { ScheduleItem as ScheduleItemType } from '../../types';
import clsx from 'clsx';

interface ScheduleItemProps {
  item: ScheduleItemType;
  index: number;
  isLast: boolean;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ item, index, isLast }) => {
  const isEven = index % 2 === 0;
  
  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute top-6 bottom-0 left-5 w-0.5 bg-orange-200 dark:bg-orange-800"></div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="flex gap-6 mb-12"
      >
        {/* Timeline node */}
        <div className="relative z-10">
          <div className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            isEven 
              ? "bg-rose-900 dark:bg-rose-800" 
              : "bg-pink-600 dark:bg-pink-500"
          )}>
            <Clock className="w-5 h-5" />
          </div>
        </div>
        
        {/* Content */}
        <div className={clsx(
          "flex-1 bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-md",
          isEven 
            ? "border-l-4 border-rose-900 dark:border-rose-800" 
            : "border-l-4 border-pink-600 dark:border-pink-500"
        )}>
          <span className={clsx(
            "inline-block px-3 py-1 text-sm font-medium rounded-full mb-3",
            isEven 
              ? "text-rose-950 bg-orange-50 dark:text-rose-300 dark:bg-rose-900/30" 
              : "text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-900/30"
          )}>
            {item.time}
          </span>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {item.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {item.speaker && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {item.speaker}
              </div>
            )}
            
            {item.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {item.location}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleItem;
