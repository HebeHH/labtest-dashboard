"use client";

import React, { useState } from 'react';
import { getTestCategories } from '../utils/dataUtils';
import labResults from '../data/labData';

interface TestSelectorProps {
  onSelectTest: (testName: string) => void;
  onSelectMultiTests: (testNames: string[]) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({ onSelectTest, onSelectMultiTests }) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const categories = getTestCategories(labResults);
  
  const handleTestToggle = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };
  
  const handleSingleTestSelect = (testName: string) => {
    onSelectTest(testName);
  };
  
  const handleMultiTestSelect = () => {
    if (selectedTests.length > 0) {
      onSelectMultiTests(selectedTests);
    }
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category]
    });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Tests</h3>
        
        <div className="space-y-4">
          {Object.entries(categories).map(([category, tests]) => (
            <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => toggleCategory(category)}
              >
                <span className="font-medium text-gray-700">{category}</span>
                <svg
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${
                    expandedCategories[category] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {expandedCategories[category] && (
                <div className="p-4 space-y-3">
                  {tests.map(testName => {
                    const test = labResults.tests.find(t => t.name === testName);
                    return (
                      <div key={testName} className="flex items-start pb-3 border-b border-gray-100 last:border-0">
                        <div className="flex items-center h-5">
                          <input
                            id={`test-${testName}`}
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            checked={selectedTests.includes(testName)}
                            onChange={() => handleTestToggle(testName)}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <label htmlFor={`test-${testName}`} className="block text-sm font-medium text-gray-700 cursor-pointer">
                            {testName}
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {test?.description.substring(0, 100)}{test?.description.length && test.description.length > 100 ? '...' : ''}
                          </p>
                          <button
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            onClick={() => handleSingleTestSelect(testName)}
                          >
                            View Individual Chart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2">Selected tests: {selectedTests.length}</p>
          <button
            className={`w-full rounded-md py-2 px-4 font-medium text-white ${
              selectedTests.length > 0 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleMultiTestSelect}
            disabled={selectedTests.length === 0}
          >
            Compare Selected Tests
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSelector; 