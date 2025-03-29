"use client";

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Legend
} from 'recharts';
import { Test, TestResult } from '../types/labDataTypes';
import { 
  findTestByName, 
  getResultsForTest, 
  getColorForAcceptability, 
  getBackgroundColorForAcceptability,
  parseDate,
  formatDate
} from '../utils/dataUtils';
import labResults from '../data/labData';

interface SingleTestChartProps {
  testName: string;
}

const SingleTestChart: React.FC<SingleTestChartProps> = ({ testName }) => {
  // Find test and its results
  const test = findTestByName(labResults.tests, testName);
  const results = getResultsForTest(labResults, testName).filter(r => 'resultValid' in r.result && r.result.resultValid);
  
  if (!test || results.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No data available for {testName}</p>
      </div>
    );
  }
  
  // Prepare data for the chart
  const chartData = results
    .map(result => {
      if (!('resultValid' in result.result) || !result.result.resultValid) {
        return null;
      }
      
      return {
        date: parseDate(result.date),
        formattedDate: result.date,
        value: result.result.result,
        acceptability: result.result.resultAcceptability,
        notes: result.resultNotes
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.date.getTime() - b!.date.getTime());
  
  // Find the range values for reference areas
  const ranges = test.target.range.sort((a, b) => {
    if (a.bottom !== undefined && b.bottom !== undefined) {
      return a.bottom - b.bottom;
    }
    if (a.top !== undefined && b.top !== undefined) {
      return a.top - b.top;
    }
    return 0;
  });
  
  // Calculate min and max values for the chart
  const values = chartData.map(d => d!.value);
  const minValue = Math.min(...values) * 0.9;
  const maxValue = Math.max(...values) * 1.1;
  
  // Create reference areas for target ranges
  const referenceAreas = ranges.map((range, index) => {
    const y1 = range.bottom !== undefined ? range.bottom : minValue;
    const y2 = range.top !== undefined ? range.top : maxValue;
    
    return (
      <ReferenceArea
        key={`range-${index}`}
        y1={y1}
        y2={y2}
        fill={getBackgroundColorForAcceptability(range.value)}
        fillOpacity={0.3}
      />
    );
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold">{data.formattedDate}</p>
          <p className="text-gray-700">
            Value: <span className="font-medium">{data.value} {test.units}</span>
          </p>
          <p className="mt-1">
            <span 
              className="px-2 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: getColorForAcceptability(data.acceptability) }}
            >
              {data.acceptability}
            </span>
          </p>
          {data.notes && (
            <p className="mt-2 text-xs text-gray-600">{data.notes}</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
        <p className="text-sm text-gray-600">{test.description}</p>
        <p className="text-xs text-gray-500 mt-1">{test.target.description}</p>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              domain={[minValue, maxValue]} 
              unit={test.units}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            {referenceAreas}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={(props) => {
                if (!props.cx || !props.cy) {
                  return (
                    <circle
                      cx={0}
                      cy={0}
                      r={0}
                      fill="none"
                      stroke="none"
                    />
                  );
                }
                
                const acceptability = props.payload.acceptability;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={6}
                    stroke="white"
                    strokeWidth={2}
                    fill={getColorForAcceptability(acceptability)}
                  />
                );
              }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SingleTestChart; 