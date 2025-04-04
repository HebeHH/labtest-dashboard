"use client";

import React from 'react';
import { getResultsForTest, findTestByName, getColorForAcceptability, roundToDecimalPlaces } from '../utils/dataUtils';
import { OutcomeAcceptability, AllResults } from '../types/labDataTypes';

interface ResultsTableProps {
  testName: string;
  labData: AllResults;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ testName, labData }) => {
  const test = findTestByName(labData.tests, testName);
  const results = getResultsForTest(labData, testName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!test || results.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-50 text-center">
        <p className="text-gray-500">No results found for {testName}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-blue-100">
        <thead className="bg-blue-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Result
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-blue-50">
          {results.map((result, index) => {
            const isValid = 'resultValid' in result.result && result.result.resultValid;
            
            // Determine status and display value
            let status: OutcomeAcceptability | 'Invalid' = 'Invalid';
            let displayValue = 'Invalid Result';
            
            if (isValid) {
              status = (result.result as any).resultAcceptability;
              displayValue = `${roundToDecimalPlaces((result.result as any).result)} ${test.units}`;
            }
            
            return (
              <tr key={`${result.test}-${result.date}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {displayValue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isValid ? (
                    <span 
                      className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                      style={{ backgroundColor: getColorForAcceptability(status as OutcomeAcceptability) }}
                    >
                      {status}
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-400 text-white">
                      Invalid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  <div className="tooltip relative group">
                    <div className="truncate max-w-xs">
                      {result.resultNotes}
                    </div>
                    {result.resultNotes && (
                      <div className="tooltip-text invisible group-hover:visible absolute z-10 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg left-0 mt-2">
                        {result.resultNotes}
                        {result.additionalInfo && (
                          <>
                            <hr className="my-2 border-gray-600" />
                            {result.additionalInfo}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Target Ranges:</h4>
        <div className="space-y-2">
          {test.target.range.map((range, index) => {
            let rangeText = '';
            
            if (range.bottom !== undefined && range.top !== undefined) {
              rangeText = `${range.bottom} to ${range.top} ${test.units}`;
            } else if (range.bottom !== undefined) {
              rangeText = `Above ${range.bottom} ${test.units}`;
            } else if (range.top !== undefined) {
              rangeText = `Below ${range.top} ${test.units}`;
            }
            
            return (
              <div key={index} className="flex items-center">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getColorForAcceptability(range.value) }}
                ></span>
                <span className="text-sm">
                  <span className="font-medium">{range.value}:</span> {rangeText}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">{test.target.description}</p>
      </div>
    </div>
  );
};

export default ResultsTable; 