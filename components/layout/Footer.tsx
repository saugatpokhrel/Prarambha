"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2082);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Prarambha
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A special event organized by your seniors at the Department of Electronics and Computer Engineering at Thapathali Campus, IOE.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/prarambha.tcioe?igsh=bjk5M2NnbXJmODc3" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-900 dark:text-rose-400 transition-colors hover:bg-rose-200 dark:hover:bg-rose-900/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  Event Schedule
                </Link>
              </li>
              <li>
                <Link href="/sponsor" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  Our Sponsors
                </Link>
              </li>
              <li>
                <Link href="/notices" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  Notices & Updates
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-rose-900 dark:text-rose-400 mt-0.5 mr-3 flex-shrink-0" />
                <a 
                  href="https://tcioe.edu.np/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors"
                >
                  Thapathali Campus, Institute of Engineering<br />
                  Kathmandu, Nepal
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-rose-900 dark:text-rose-400 mr-3 flex-shrink-0" />
                <button 
                  onClick={() => copyToClipboard('+977-9821799650')}
                  className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {copied ? 'Copied!' : '+977-9821799650'}
                </button>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-rose-900 dark:text-rose-400 mr-3 flex-shrink-0" />
                <a href="mailto:prarambha.tcioe@gmail.com" className="text-gray-600 dark:text-gray-400 hover:text-rose-900 dark:hover:text-rose-400 transition-colors">
                  prarambha.tcioe@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {currentYear} Prarambha 2082. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
