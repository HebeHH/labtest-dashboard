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
import { Test, TestResult, AllResults } from '../types/labDataTypes';
import { 
  getResultsForTest, 
  findTestByName, 
  getColorForAcceptability, 
  getBackgroundColorForAcceptability,
  parseDate,
  formatDate,
  roundToDecimalPlaces
} from '../utils/dataUtils';
import { format } from 'date-fns';

interface SingleTestChartProps {
  testName: string;
  labData: AllResults;
  startDate?: Date | null;
  endDate?: Date | null;
}

const SingleTestChart: React.FC<SingleTestChartProps> = ({ testName, labData, startDate, endDate }) => {
  // Find test and its results
  const test = findTestByName(labData.tests, testName);
  const results = getResultsForTest(labData, testName).filter(r => 'resultValid' in r.result && r.result.resultValid);
  
  if (!test || results.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No data available for {testName}</p>
      </div>
    );
  }
  
  // Prepare data for the chart
  let chartData = results
    .map(result => {
      if (!('resultValid' in result.result) || !result.result.resultValid) {
        return null;
      }
      
      const date = parseDate(result.date);
      return {
        date: date, // Store actual Date object
        timestamp: date.getTime(), // Store timestamp for proper x-axis scaling
        formattedDate: result.date,
        value: result.result.result,
        acceptability: result.result.resultAcceptability,
        notes: result.resultNotes
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.date.getTime() - b!.date.getTime());
    
  // Filter data by date range if provided
  if (startDate && endDate) {
    chartData = chartData.filter(
      item => item!.date >= startDate && item!.date <= endDate
    );
  }
  
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
  
  // In case we have no values after filtering by date range
  if (values.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p>No data available for {testName} in the selected date range</p>
      </div>
    );
  }
  
  const dataMinValue = Math.min(...values);
  const dataMaxValue = Math.max(...values);
  
  // Get the range min/max from the target ranges
  const rangeMin = Math.min(
    ...ranges
      .filter(r => r.bottom !== undefined)
      .map(r => r.bottom!)
  );
  const rangeMax = Math.max(
    ...ranges
      .filter(r => r.top !== undefined)
      .map(r => r.top!)
  );
  
  // Determine X-axis domain (time range)
  let xDomain: Array<number | 'dataMin' | 'dataMax'> = ['dataMin', 'dataMax'];
  if (startDate && endDate) {
    xDomain = [startDate.getTime(), endDate.getTime()];
  }
  
  // Determine the chart min/max values to include both data points and full target ranges
  const padding = 0.1;
  const minValue = Math.min(dataMinValue, rangeMin) * (1 - padding);
  const maxValue = Math.max(dataMaxValue, rangeMax) * (1 + padding);
  
  // Create reference areas for target ranges that cover the entire chart height
  const referenceAreas = ranges.map((range, index) => {
    let y1, y2;
    
    if (range.bottom !== undefined && range.top !== undefined) {
      // Both bottom and top defined
      y1 = range.bottom;
      y2 = range.top;
    } else if (range.bottom !== undefined) {
      // Only bottom defined (upper range)
      y1 = range.bottom;
      y2 = maxValue;
    } else if (range.top !== undefined) {
      // Only top defined (lower range)
      y1 = minValue;
      y2 = range.top;
    } else {
      // Neither defined (shouldn't happen)
      return null;
    }
    
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
      const formattedDate = format(new Date(label), 'dd MMM yyyy');
      
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold">{formattedDate}</p>
          <p className="text-gray-700">
            Value: <span className="font-medium">{roundToDecimalPlaces(data.value)} {test.units}</span>
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
    <div className="p-4">
      <div className="mb-2">
        <p className="text-sm text-gray-600">{test.description}</p>
        <p className="text-xs text-gray-500 mt-1">{test.target.description}</p>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={startDate && endDate ? [startDate.getTime(), endDate.getTime()] : ['dataMin', 'dataMax']}
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM yyyy')}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              scale="time"
            />
            <YAxis 
              domain={[minValue, maxValue]}
              tickFormatter={(value) => roundToDecimalPlaces(value).toString()}
              tick={{ fontSize: 12 }}
              width={60}
              label={{
                value: test.units,
                angle: -90,
                position: 'insideLeft',
                dy: 45,
                dx: -10,
                fontSize: 12,
                fill: '#666'
              }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              labelFormatter={(timestamp) => format(new Date(timestamp), 'dd MMM yyyy')}
            />
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
                      key={`dot-empty-${props.index}`}
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
                    key={`dot-${props.index}`}
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