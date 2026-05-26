"use client";

import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';

const aboutImage = "/photos/depart.webp";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-8"
          >
            About DOECE Thapathali
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="relative rounded-xl overflow-hidden shadow-xl mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={aboutImage} 
                alt="Department of Electronics and Computer Engineering"
                className="w-full h-auto object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-4 py-2 bg-rose-900/90 rounded-lg text-sm font-medium">
                  Thapathali Campus, IOE
                </span>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Department
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              <a href="https://doece.tcioe.edu.np/" target="_blank" rel="noopener noreferrer" className="text-rose-900 dark:text-rose-400 hover:underline font-medium">The Department of Electronics and Computer Engineering</a> (DOECE) at Thapathali Campus, 
              Institute of Engineering is one of the premier departments dedicated to providing 
              excellence in education in the fields of electronics, computing, and information technology.
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Established with a vision to produce competent engineers capable of addressing technological
              challenges, DOECE has consistently maintained high standards of academic excellence and 
              research innovation. Our faculty comprises experienced professionals and academics who 
              bring their expertise to the classroom, providing students with both theoretical knowledge 
              and practical insights.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-10">
              Prarambha 
            </h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Prarambha 2082 is the newest edition of the flagship fresher’s event organized by the seniors of DOECE at Thapathali Campus.
              Designed to warmly welcome new students into the DOECE family, the event is all about connection, celebration, and creating unforgettable first memories on campus.
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li> Connect with seniors, faculty, and new friends</li>
              <li>Enjoy games, music, performances, and nonstop fun</li>
              <li>Eat, dance, laugh, and make unforgettable memories</li>
              <li>Join exciting activities and social events</li>
              <li> Compete for the Mr. & Ms. Fresher titles</li>
              <li> Experience the vibrant spirit of DOECE</li>
            </ul>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              More than just a welcome program, Prarambha 2082 is a celebration of new beginnings. 
              It aims to create a friendly and supportive environment where students can feel connected, confident,
              and excited for their journey ahead at DOECE.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-orange-50 dark:bg-rose-900/20 rounded-xl p-8 border border-orange-100 dark:border-rose-800"
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Vision & Mission
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-rose-955 dark:text-rose-400 mb-2">
                Vision
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                To be a leading center for electronics and computer engineering education, producing innovative graduates
                who drive technological progress.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-rose-955 dark:text-rose-400 mb-2">
                Mission
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Provide quality, hands-on engineering education</li>
                <li>Encourage research and innovation</li>
                <li>Build strong industry connections for real-world learning</li>
                <li>Develop both technical and soft skills for success</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
