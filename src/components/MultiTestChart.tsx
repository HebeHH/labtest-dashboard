"use client";

import React, { ReactElement } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  findTestByName, 
  getValidResultsWithDates, 
  formatDate,
  getColorForAcceptability,
  roundToDecimalPlaces,
  parseDate 
} from '../utils/dataUtils';
import labResults from '../data/labData';
import { OutcomeAcceptability } from '../types/labDataTypes';
import { format } from 'date-fns';

interface MultiTestChartProps {
  testNames: string[];
}

// Define interfaces for our chart data
interface ChartDataPoint {
  date: string;
  timestamp: number;
  [key: `value${number}`]: number;
  [key: `acceptability${number}`]: OutcomeAcceptability;
}

interface DotProps {
  cx?: number;
  cy?: number;
  r?: number;
  index?: number;
  payload: ChartDataPoint;
  value?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    payload: ChartDataPoint;
  }>;
  label?: string;
}

const colors = [
  '#4f46e5', // Indigo
  '#0ea5e9', // Sky
  '#059669', // Emerald
  '#d946ef', // Fuchsia
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#84cc16'  // Lime
];

const MultiTestChart: React.FC<MultiTestChartProps> = ({ testNames }) => {
  if (!testNames || testNames.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>Please select tests to display</p>
      </div>
    );
  }
  
  // Filter tests that exist and have valid results
  const validTests = testNames
    .map(name => ({
      name,
      test: findTestByName(labResults.tests, name),
      results: getValidResultsWithDates(labResults, name)
    }))
    .filter(item => item.test && item.results.length > 0);
  
  if (validTests.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No valid data available for the selected tests</p>
      </div>
    );
  }
  
  // Combine all dates from all tests
  const allDates = new Set<string>();
  validTests.forEach(testItem => {
    testItem.results.forEach(result => {
      allDates.add(formatDate(result.date));
    });
  });
  
  // Create a combined dataset with all dates
  const dateArray = Array.from(allDates).sort();
  const combinedData: Partial<ChartDataPoint>[] = dateArray.map(date => ({ 
    date,
    timestamp: parseDate(date).getTime() // Add timestamp for proper x-axis scaling
  }));
  
  // Add test results to the combined dataset
  validTests.forEach((testItem, testIndex) => {
    const testData: Record<string, number | string> = {};
    
    testItem.results.forEach(result => {
      const dateStr = formatDate(result.date);
      testData[dateStr] = result.value;
    });
    
    combinedData.forEach(dataPoint => {
      const dateStr = dataPoint.date as string;
      if (testData[dateStr] !== undefined) {
        dataPoint[`value${testIndex}`] = testData[dateStr] as number;
        dataPoint[`acceptability${testIndex}`] = testItem.results.find(
          r => formatDate(r.date) === dateStr
        )?.acceptability as OutcomeAcceptability || 'Acceptable';
      }
    });
  });
  
  const sortedData = combinedData.sort((a, b) => {
    return (a.timestamp as number) - (b.timestamp as number);
  });
  
  // Custom tooltip to show all values on hover
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const formattedDate = label ? format(new Date(label), 'dd MMM yyyy') : '';
      
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold">{formattedDate}</p>
          <div className="mt-2 space-y-2">
            {validTests.map((testItem, index) => {
              const payloadItem = payload.find(p => p.dataKey === `value${index}`);
              if (!payloadItem) return null;
              
              const acceptabilityKey = `acceptability${index}` as keyof ChartDataPoint;
              const acceptability = payloadItem.payload[acceptabilityKey] as OutcomeAcceptability;
              
              return (
                <div key={testItem.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm font-medium mr-2">{testItem.test?.name}:</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm">{roundToDecimalPlaces(payloadItem.value)} {testItem.test?.units}</span>
                    <span 
                      className="ml-2 px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getColorForAcceptability(acceptability) }}
                    >
                      {acceptability}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Multiple Tests Comparison
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Comparing trends for {validTests.map(t => t.test?.name).join(', ')}
        </p>
      </div>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sortedData}
            margin={{ top: 20, right: 60, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yyyy')}
              scale="time" 
            />
            
            {validTests.map((testItem, index) => {
              // Calculate domain for this test
              const values = testItem.results.map(r => r.value);
              const min = Math.min(...values) * 0.9;
              const max = Math.max(...values) * 1.1;
              
              // Get the range min/max from the target ranges if available
              let rangeMin = min;
              let rangeMax = max;
              
              if (testItem.test?.target?.range) {
                const ranges = testItem.test.target.range;
                const rangeBottoms = ranges.filter(r => r.bottom !== undefined).map(r => r.bottom!);
                const rangeTops = ranges.filter(r => r.top !== undefined).map(r => r.top!);
                
                if (rangeBottoms.length > 0) {
                  rangeMin = Math.min(rangeMin, ...rangeBottoms);
                }
                
                if (rangeTops.length > 0) {
                  rangeMax = Math.max(rangeMax, ...rangeTops);
                }
              }
              
              // Add some padding
              const padding = 0.1;
              const domainMin = rangeMin * (1 - padding);
              const domainMax = rangeMax * (1 + padding);
              
              return (
                <YAxis
                  key={`axis-${index}`}
                  yAxisId={`axis-${index}`}
                  orientation={index % 2 === 0 ? 'left' : 'right'}
                  domain={[domainMin, domainMax]}
                  tickFormatter={(value) => roundToDecimalPlaces(value).toString()}
                  label={{
                    value: testItem.test?.units,
                    angle: index % 2 === 0 ? -90 : 90,
                    position: index % 2 === 0 ? 'insideLeft' : 'insideRight',
                    dx: index % 2 === 0 ? -15 : 15,
                    dy: 0,
                    fontSize: 11,
                    fill: colors[index % colors.length]
                  }}
                  tick={{ fontSize: 10 }}
                  width={40}
                  stroke={colors[index % colors.length]}
                />
              );
            })}
            
            <Tooltip 
              content={<CustomTooltip />} 
              labelFormatter={(timestamp) => format(new Date(timestamp), 'dd MMM yyyy')}
            />
            <Legend />
            
            {validTests.map((testItem, index) => (
              <Line
                key={`line-${index}`}
                type="monotone"
                dataKey={`value${index}`}
                name={testItem.test?.name}
                yAxisId={`axis-${index}`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                connectNulls
                dot={(props: DotProps) => {
                  // If cx or cy are missing, render an empty circle at position 0,0
                  // This prevents the TypeScript error by always returning an element
                  const cx = props.cx ?? 0;
                  const cy = props.cy ?? 0;
                  
                  // When the actual values are missing, make the circle invisible
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
                  
                  const acceptabilityKey = `acceptability${index}` as keyof ChartDataPoint;
                  const acceptability = props.payload[acceptabilityKey] as OutcomeAcceptability;
                  if (!acceptability) {
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        fill={"#cccccc"}
                      />
                    );
                  }
                  
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={5}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      fill={getColorForAcceptability(acceptability)}
                    />
                  );
                }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MultiTestChart; 