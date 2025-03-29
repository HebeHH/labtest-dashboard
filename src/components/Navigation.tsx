"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                <path d="M8 6h8"></path>
                <path d="M8 10h8"></path>
                <path d="M8 14h6"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Lab Results Dashboard</span>
            </Link>
          </div>
          
          <nav className="flex items-center">
            <ul className="flex space-x-1">
              <li>
                <Link 
                  href="/" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/' 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/custom-dashboard" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === '/custom-dashboard' 
                      ? 'bg-white/20 text-white' 
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Custom Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation; 