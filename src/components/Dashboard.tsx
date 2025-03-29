"use client";

import React, { useState } from 'react';
import SingleTestChart from './SingleTestChart';
import MultiTestChart from './MultiTestChart';
import TestSelector from './TestSelector';
import ResultsTable from './ResultsTable';
import labResults from '../data/labData';
import { getUniqueTestNames } from '../utils/dataUtils';
import Link from 'next/link';

const Dashboard: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [multiTestNames, setMultiTestNames] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'single' | 'multi'>('single');
  
  // Get default test if none selected (use HBA1c if available)
  const availableTests = getUniqueTestNames(labResults);
  
  const defaultTest = availableTests.find(name => name.includes('HBA1c')) || availableTests[0];
  
  // Use default test if none selected
  const currentTest = selectedTest || defaultTest;
  
  const handleSingleTestSelect = (testName: string) => {
    setSelectedTest(testName);
    setDisplayMode('single');
  };
  
  const handleMultiTestSelect = (testNames: string[]) => {
    setMultiTestNames(testNames);
    setDisplayMode('multi');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Lab Test Dashboard
              </span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 font-medium">
                Diabetes Monitoring
              </span>
              <Link 
                href="/custom-dashboard" 
                className="px-3 py-1 rounded text-sm bg-purple-100 text-purple-800 font-medium hover:bg-purple-200 transition-colors"
              >
                Custom Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar / Test Selector */}
          <div className="lg:col-span-1">
            <TestSelector
              onSelectTest={handleSingleTestSelect}
              onSelectMultiTests={handleMultiTestSelect}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Charts Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {displayMode === 'single' 
                  ? 'Test Results Over Time'
                  : 'Multiple Test Comparison'
                }
              </h2>
              
              {displayMode === 'single' && currentTest && (
                <SingleTestChart testName={currentTest} />
              )}
              
              {displayMode === 'multi' && multiTestNames.length > 0 && (
                <MultiTestChart testNames={multiTestNames} />
              )}
            </div>
            
            {/* Results Table (only shown in single test mode) */}
            {displayMode === 'single' && currentTest && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Detailed Results
                </h2>
                <ResultsTable testName={currentTest} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Lab Test Dashboard - All your medical data in one place
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard; 