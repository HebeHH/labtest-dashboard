"use client";

import React, { useState } from 'react';
import SingleTestChart from './SingleTestChart';
import MultiTestChart from './MultiTestChart';
import TestSelector from './TestSelector';
import ResultsTable from './ResultsTable';
import { getUniqueTestNames } from '../utils/dataUtils';
import { AllResults, Test, TestResult } from '../types/labDataTypes';
import { useLabData } from '../contexts/LabDataContext';

interface DashboardProps {
  tests: Test[];
  results: TestResult[];
}

const Dashboard: React.FC<DashboardProps> = ({ tests, results }) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [multiTestNames, setMultiTestNames] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'single' | 'multi'>('single');
  
  // Access the lab data context to check if we're using demo data
  const { isDemo } = useLabData();
  
  // Use the lab data from props
  const labData: AllResults = { tests, results };
  
  // Get default test if none selected (use HBA1c if available)
  const availableTests = getUniqueTestNames(labData);
  
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
      
      {/* Demo Data Indicator */}
      {isDemo && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Demo Data</h3>
              <div className="mt-1 text-sm text-amber-700">
                <p>
                  You are currently viewing sample demonstration data. These values do not represent real patient data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar / Test Selector */}
        <div className="lg:col-span-1">
          <TestSelector
            onSelectTest={handleSingleTestSelect}
            onSelectMultiTests={handleMultiTestSelect}
            labData={labData}
          />
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Charts Section */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden">
            <div className="border-b border-blue-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {displayMode === 'single' 
                  ? `Test Results Over Time: ${currentTest}`
                  : 'Multiple Test Comparison'
                }
              </h2>
            </div>
            <div className="p-6">
              {displayMode === 'single' && currentTest && (
                <SingleTestChart testName={currentTest} labData={labData} />
              )}
              
              {displayMode === 'multi' && multiTestNames.length > 0 && (
                <MultiTestChart testNames={multiTestNames} labData={labData} />
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
                <ResultsTable testName={currentTest} labData={labData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 