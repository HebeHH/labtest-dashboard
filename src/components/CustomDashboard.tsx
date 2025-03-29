"use client";

import React, { useState, useEffect } from 'react';
import SingleTestChart from './SingleTestChart';
import MultiTestChart from './MultiTestChart';
import labResults from '../data/labData';
import { getUniqueTestNames, parseDate } from '../utils/dataUtils';
import { format } from 'date-fns';

// Define graph types
type GraphType = 'single' | 'multi';

// Graph configuration interface
interface GraphConfig {
  id: string;
  type: GraphType;
  testNames: string[];
}

export const CustomDashboard: React.FC = () => {
  // State for collapsible sections
  const [dateRangeCollapsed, setDateRangeCollapsed] = useState<boolean>(false);
  const [addGraphCollapsed, setAddGraphCollapsed] = useState<boolean>(false);
  
  // State for date range
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [calculatedStartDate, setCalculatedStartDate] = useState<Date | null>(null);
  const [calculatedEndDate, setCalculatedEndDate] = useState<Date | null>(null);
  
  // State for graphs
  const [graphs, setGraphs] = useState<GraphConfig[]>([]);
  
  // State for adding new graphs
  const [graphType, setGraphType] = useState<GraphType>('single');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  
  // Get all available test names
  const availableTests = getUniqueTestNames(labResults);
  
  // Function to add a new graph
  const addGraph = () => {
    if (graphType === 'single' && selectedTests.length > 0) {
      // For single tests, add one graph for each selected test
      const newGraphs = selectedTests.map(testName => ({
        id: Date.now().toString() + Math.random().toString(36).substring(2), // Unique ID
        type: 'single' as GraphType,
        testNames: [testName]
      }));
      
      setGraphs([...graphs, ...newGraphs]);
      setSelectedTests([]);
    } else if (graphType === 'multi' && selectedTests.length > 0) {
      // For multi-test, add one graph with all selected tests
      const newGraph: GraphConfig = {
        id: Date.now().toString(),
        type: 'multi',
        testNames: [...selectedTests]
      };
      
      setGraphs([...graphs, newGraph]);
      setSelectedTests([]);
    }
  };
  
  // Function to remove a graph
  const removeGraph = (id: string) => {
    setGraphs(graphs.filter(graph => graph.id !== id));
  };
  
  // Function to move a graph up in the order
  const moveGraphUp = (index: number) => {
    if (index > 0) {
      const newGraphs = [...graphs];
      [newGraphs[index - 1], newGraphs[index]] = [newGraphs[index], newGraphs[index - 1]];
      setGraphs(newGraphs);
    }
  };
  
  // Function to move a graph down in the order
  const moveGraphDown = (index: number) => {
    if (index < graphs.length - 1) {
      const newGraphs = [...graphs];
      [newGraphs[index], newGraphs[index + 1]] = [newGraphs[index + 1], newGraphs[index]];
      setGraphs(newGraphs);
    }
  };
  
  // Function to toggle test selection
  const toggleTestSelection = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter(t => t !== testName));
    } else {
      // We now allow selecting multiple tests for single charts too
      setSelectedTests([...selectedTests, testName]);
    }
  };
  
  // Calculate date range based on all tests in all graphs
  useEffect(() => {
    if (graphs.length === 0) {
      setCalculatedStartDate(null);
      setCalculatedEndDate(null);
      return;
    }
    
    // Get all test names from all graphs
    const allTestNames = new Set<string>();
    graphs.forEach(graph => {
      graph.testNames.forEach(name => allTestNames.add(name));
    });
    
    // Find all dates for these tests
    const allDates: Date[] = [];
    
    allTestNames.forEach(testName => {
      const testResults = labResults.results.filter(r => r.test === testName && 'resultValid' in r.result && r.result.resultValid);
      testResults.forEach(result => {
        allDates.push(parseDate(result.date));
      });
    });
    
    if (allDates.length > 0) {
      // Sort dates
      allDates.sort((a, b) => a.getTime() - b.getTime());
      
      // Set min and max dates
      const minDate = allDates[0];
      const maxDate = allDates[allDates.length - 1];
      
      setCalculatedStartDate(minDate);
      setCalculatedEndDate(maxDate);
      
      // Also update the input fields
      setStartDate(format(minDate, 'yyyy-MM-dd'));
      setEndDate(format(maxDate, 'yyyy-MM-dd'));
    }
  }, [graphs]);
  
  // Handle manual date range changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    if (e.target.value) {
      setCalculatedStartDate(new Date(e.target.value));
    }
  };
  
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    if (e.target.value) {
      setCalculatedEndDate(new Date(e.target.value));
    }
  };
  
  // Toggle section collapse
  const toggleDateRangeCollapse = () => {
    setDateRangeCollapsed(!dateRangeCollapsed);
  };
  
  const toggleAddGraphCollapse = () => {
    setAddGraphCollapsed(!addGraphCollapsed);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Custom Dashboard
              </span>
            </h1>
            <a 
              href="/" 
              className="px-3 py-1 rounded text-sm bg-indigo-100 text-indigo-800 font-medium hover:bg-indigo-200 transition-colors"
            >
              Back to Main Dashboard
            </a>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Date Range Controls */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <button 
            className="w-full flex justify-between items-center p-6 text-left" 
            onClick={toggleDateRangeCollapse}
          >
            <h2 className="text-lg font-semibold text-gray-800">Date Range</h2>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transform transition-transform ${dateRangeCollapsed ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {!dateRangeCollapsed && (
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {calculatedStartDate && calculatedEndDate && (
                  <div className="flex items-end">
                    <p className="text-sm text-gray-500">
                      Showing data from {format(calculatedStartDate, 'dd MMM yyyy')} to {format(calculatedEndDate, 'dd MMM yyyy')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Add Graph Controls */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <button 
            className="w-full flex justify-between items-center p-6 text-left" 
            onClick={toggleAddGraphCollapse}
          >
            <h2 className="text-lg font-semibold text-gray-800">Add Graph</h2>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-500 transform transition-transform ${addGraphCollapsed ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {!addGraphCollapsed && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graph Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={graphType === 'single'}
                      onChange={() => setGraphType('single')}
                    />
                    <span className="ml-2">Individual Charts</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-indigo-600"
                      checked={graphType === 'multi'}
                      onChange={() => setGraphType('multi')}
                    />
                    <span className="ml-2">Combined Chart</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tests
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTests.map(testName => (
                    <label key={testName} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-indigo-600"
                        checked={selectedTests.includes(testName)}
                        onChange={() => toggleTestSelection(testName)}
                      />
                      <span className="ml-2 text-sm truncate">{testName}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <button
                  onClick={addGraph}
                  disabled={selectedTests.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add {graphType === 'single' ? selectedTests.length > 1 ? `${selectedTests.length} Individual Charts` : 'Chart' : 'Combined Chart'}
                </button>
                <span className="ml-2 text-sm text-gray-500">
                  {selectedTests.length === 0 
                    ? 'Please select at least one test.'
                    : graphType === 'single' 
                      ? `Selected ${selectedTests.length} test${selectedTests.length !== 1 ? 's' : ''}`
                      : `Selected ${selectedTests.length} test${selectedTests.length !== 1 ? 's' : ''} for combined chart`}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Graphs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphs.map((graph, index) => (
            <div key={graph.id} className="bg-white rounded-xl shadow-md relative">
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  {graph.type === 'single' 
                    ? `${graph.testNames[0]}`
                    : `Multiple Tests (${graph.testNames.length})`}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveGraphUp(index)}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                    title="Move Up"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveGraphDown(index)}
                    disabled={index === graphs.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                    title="Move Down"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeGraph(graph.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {graph.type === 'single' ? (
                <SingleTestChart 
                  testName={graph.testNames[0]} 
                  startDate={calculatedStartDate}
                  endDate={calculatedEndDate}
                />
              ) : (
                <MultiTestChart 
                  testNames={graph.testNames} 
                  startDate={calculatedStartDate}
                  endDate={calculatedEndDate}
                />
              )}
            </div>
          ))}
        </div>
        
        {graphs.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">
              No graphs added yet. Use the controls above to add graphs to your dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDashboard; 