"use client";

import React, { useState, useEffect } from 'react';
import SingleTestChart from './SingleTestChart';
import MultiTestChart from './MultiTestChart';
import labResults from '../data/labData';
import { getUniqueTestNames, parseDate } from '../utils/dataUtils';
import { format } from 'date-fns';
import Link from 'next/link';

// Define graph types
type GraphType = 'single' | 'multi';

// Graph configuration interface
interface GraphConfig {
  id: string;
  type: GraphType;
  testNames: string[];
  expanded?: boolean; // Track if the graph is expanded
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
    if (index <= 0) return; // Can't move up if already at the top
    
    const newGraphs = [...graphs];
    const graphToMove = newGraphs[index];
    
    // If the graph is expanded, it should move up by a full row (2 positions or to the top)
    if (graphToMove.expanded) {
      // If it's at position 2 or greater, we move it up by 2 positions (one full row)
      if (index >= 2) {
        // Remove the graph from its current position
        newGraphs.splice(index, 1);
        // Insert it 2 positions up
        newGraphs.splice(index - 2, 0, graphToMove);
      } else {
        // It's at position 1, just move it to the top
        newGraphs.splice(index, 1);
        newGraphs.splice(0, 0, graphToMove);
      }
    } else {
      // For a non-expanded graph, check if the one above is expanded
      const graphAbove = newGraphs[index - 1];
      
      if (graphAbove.expanded) {
        // If the graph above is expanded, we need to move current graph up by one full row
        // which means above the expanded graph (so index - 2 if available)
        if (index >= 2) {
          // Remove the graph from its current position
          newGraphs.splice(index, 1);
          // Insert it above the expanded graph
          newGraphs.splice(index - 2, 0, graphToMove);
        } else {
          // Can't move further up, do nothing
          return;
        }
      } else {
        // Simple swap for non-expanded graphs
        [newGraphs[index - 1], newGraphs[index]] = [newGraphs[index], newGraphs[index - 1]];
      }
    }
    
    setGraphs(newGraphs);
  };
  
  // Function to move a graph down in the order
  const moveGraphDown = (index: number) => {
    if (index >= graphs.length - 1) return; // Can't move down if already at the bottom
    
    const newGraphs = [...graphs];
    const graphToMove = newGraphs[index];
    
    // If the graph is expanded, it should move down by a full row (2 positions)
    if (graphToMove.expanded) {
      // Check if there's room to move down by 2 positions
      if (index + 2 < newGraphs.length) {
        // Remove the graph from its current position
        newGraphs.splice(index, 1);
        // Insert it 2 positions down
        newGraphs.splice(index + 2, 0, graphToMove);
      } else {
        // It's close to the bottom, just move it to the end
        newGraphs.splice(index, 1);
        newGraphs.push(graphToMove);
      }
    } else {
      // For a non-expanded graph, check if the one below is expanded
      const graphBelow = newGraphs[index + 1];
      
      if (graphBelow.expanded) {
        // If the graph below is expanded, we need to move current graph down by one full row
        // which means below the expanded graph
        if (index + 2 < newGraphs.length) {
          // Remove the graph from its current position
          newGraphs.splice(index, 1);
          // Insert it below the expanded graph
          newGraphs.splice(index + 2, 0, graphToMove);
        } else {
          // It would be at the end, just move it there
          newGraphs.splice(index, 1);
          newGraphs.push(graphToMove);
        }
      } else {
        // Simple swap for non-expanded graphs
        [newGraphs[index], newGraphs[index + 1]] = [newGraphs[index + 1], newGraphs[index]];
      }
    }
    
    setGraphs(newGraphs);
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
  
  // Function to toggle graph expansion
  const toggleGraphExpansion = (id: string) => {
    setGraphs(graphs.map(graph => 
      graph.id === id ? { ...graph, expanded: !graph.expanded } : graph
    ));
  };
  
  // Organize graphs into rows, considering expanded state
  const organizeGraphsIntoRows = () => {
    const graphsPerRow = 2; // Number of graphs per row when not expanded
    let rows: GraphConfig[][] = [];
    let currentRow: GraphConfig[] = [];
    
    // Create a copy of graphs to avoid modifying the state directly
    const graphsCopy = [...graphs];
    
    // Organize graphs into rows
    graphsCopy.forEach((graph, index) => {
      if (graph.expanded) {
        // If the current row has items, add it to rows
        if (currentRow.length > 0) {
          rows.push([...currentRow]);
          currentRow = [];
        }
        
        // Add the expanded graph as its own row
        rows.push([graph]);
      } else {
        // Add the graph to the current row
        currentRow.push(graph);
        
        // If the row is full, add it to rows and start a new row
        if (currentRow.length === graphsPerRow) {
          rows.push([...currentRow]);
          currentRow = [];
        }
      }
    });
    
    // Add the last row if it has any items
    if (currentRow.length > 0) {
      rows.push([...currentRow]);
    }
    
    return rows;
  };
  
  // Get the organized rows
  const graphRows = organizeGraphsIntoRows();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Custom Dashboard
          </span>
        </h1>
        <p className="text-gray-600">
          Create your personalized dashboard with the tests that matter most to you
        </p>
      </div>
      
      {/* Date Range Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden mb-6">
        <button 
          className="w-full flex justify-between items-center p-6 text-left" 
          onClick={toggleDateRangeCollapse}
        >
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-blue-500 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H16C17.1046 18 18 17.1046 18 16V6C18 4.89543 17.1046 4 16 4H15V3C15 2.44772 14.5523 2 14 2C13.4477 2 13 2.44772 13 3V4H7V3C7 2.44772 6.55228 2 6 2ZM16 8H4V16H16V8Z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800">Date Range</h2>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-blue-500 transform transition-transform ${dateRangeCollapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {!dateRangeCollapsed && (
          <div className="px-6 pb-6 border-t border-blue-50 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {calculatedStartDate && calculatedEndDate && (
                <div className="sm:col-span-2">
                  <div className="flex items-center px-3 py-2 bg-blue-50 rounded-md">
                    <svg className="h-4 w-4 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      {format(calculatedStartDate, 'dd MMM yyyy')} - {format(calculatedEndDate, 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Graph Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-50 overflow-hidden mb-6">
        <button 
          className="w-full flex justify-between items-center p-6 text-left" 
          onClick={toggleAddGraphCollapse}
        >
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-blue-500 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 11C2 10.4477 2.44772 10 3 10H17C17.5523 10 18 10.4477 18 11C18 11.5523 17.5523 12 17 12H3C2.44772 12 2 11.5523 2 11Z" />
              <path d="M10 2C10.5523 2 11 2.44772 11 3V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V3C9 2.44772 9.44772 2 10 2Z" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-800">Add Graph</h2>
          </div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-blue-500 transform transition-transform ${addGraphCollapsed ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        {!addGraphCollapsed && (
          <div className="border-t border-blue-50">
            {/* Graph Type Tabs */}
            <div className="flex border-b border-blue-50">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                  graphType === 'single' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-blue-50/30'
                }`}
                onClick={() => setGraphType('single')}
              >
                Individual Charts
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                  graphType === 'multi' 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-blue-50/30'
                }`}
                onClick={() => setGraphType('multi')}
              >
                Combined Chart
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="flex items-center justify-between">
                  <span className="block text-sm font-medium text-gray-700">
                    Select Tests
                    {selectedTests.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {selectedTests.length} selected
                      </span>
                    )}
                  </span>
                  {selectedTests.length > 0 && (
                    <button 
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedTests([])}
                    >
                      Clear selection
                    </button>
                  )}
                </label>
                <div className="mt-2 p-3 border border-blue-100 rounded-md bg-blue-50/20 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableTests.map(testName => (
                      <label key={testName} className="inline-flex items-start cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-0.5 form-checkbox text-blue-600 rounded"
                          checked={selectedTests.includes(testName)}
                          onChange={() => toggleTestSelection(testName)}
                        />
                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {testName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm text-gray-500">
                  {graphType === 'single'
                    ? 'Creates a separate chart for each selected test'
                    : 'Creates one chart comparing all selected tests'}
                </span>
                <button
                  onClick={addGraph}
                  disabled={selectedTests.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add {graphType === 'single' 
                    ? selectedTests.length > 1 ? `${selectedTests.length} Charts` : 'Chart' 
                    : 'Combined Chart'
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Graphs Layout - Organized by Rows */}
      {graphRows.length > 0 ? (
        <div className="space-y-6">
          {graphRows.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className={`grid ${row.length === 1 && row[0].expanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
              {row.map(graph => {
                const isExpanded = graph.expanded;
                
                return (
                  <div 
                    key={graph.id}
                    className={`bg-white rounded-xl shadow-sm border border-blue-50 relative ${isExpanded ? 'col-span-full' : ''}`}
                  >
                    <div className="flex justify-between items-center p-4 border-b border-blue-50">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {graph.type === 'single' 
                          ? `${graph.testNames[0]}`
                          : `Multiple Tests (${graph.testNames.length})`}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleGraphExpansion(graph.id)}
                          className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                          title={isExpanded ? "Shrink" : "Expand"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            {isExpanded ? (
                              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => moveGraphUp(graphs.findIndex(g => g.id === graph.id))}
                          disabled={graphs.findIndex(g => g.id === graph.id) === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors"
                          title="Move Up"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveGraphDown(graphs.findIndex(g => g.id === graph.id))}
                          disabled={graphs.findIndex(g => g.id === graph.id) === graphs.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors"
                          title="Move Down"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeGraph(graph.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          title="Remove"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className={isExpanded ? 'h-[500px]' : 'h-auto'}>
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
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-blue-50 p-12 text-center">
          <p className="text-gray-500">
            No graphs added yet. Use the controls above to add graphs to your dashboard.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomDashboard; 