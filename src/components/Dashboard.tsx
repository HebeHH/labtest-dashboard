"use client";

import React, { useState } from 'react';
import SingleTestChart from './SingleTestChart';
import MultiTestChart from './MultiTestChart';
import TestSelector from './TestSelector';
import ResultsTable from './ResultsTable';
import labResults from '../data/dataImport';
import { getUniqueTestNames } from '../utils/dataUtils';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Lab Test Dashboard
          </span>
        </h1>
        <p className="text-gray-600">
          Monitor and track your lab test results over time with interactive visualizations
        </p>
      </div>
      
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
          <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
            <div className="border-b border-blue-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {displayMode === 'single' 
                  ? 'Test Results Over Time'
                  : 'Multiple Test Comparison'
                }
              </h2>
            </div>
            <div className="p-6">
              {displayMode === 'single' && currentTest && (
                <SingleTestChart testName={currentTest} />
              )}
              
              {displayMode === 'multi' && multiTestNames.length > 0 && (
                <MultiTestChart testNames={multiTestNames} />
              )}
            </div>
          </div>
          
          {/* Results Table (only shown in single test mode) */}
          {displayMode === 'single' && currentTest && (
            <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
              <div className="border-b border-blue-50 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Detailed Results
                </h2>
              </div>
              <div className="p-6">
                <ResultsTable testName={currentTest} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 