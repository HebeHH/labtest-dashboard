import { parse, format } from 'date-fns';
import { Test, TestResult, AllResults, OutcomeAcceptability } from '../types/labDataTypes';

/**
 * Finds a test by its name in the tests array
 */
export const findTestByName = (tests: Test[], name: string): Test | undefined => {
  return tests.find(test => test.name === name);
};

/**
 * Gets all results for a specific test
 */
export const getResultsForTest = (data: AllResults, testName: string): TestResult[] => {
  return data.results.filter(result => result.test === testName);
};

/**
 * Parses a date string in format 'dd MMM yyyy' to a JavaScript Date object
 */
export const parseDate = (dateString: string): Date => {
  return parse(dateString, 'dd MMM yyyy', new Date());
};

/**
 * Formats a date for display
 */
export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM yyyy');
};

/**
 * Sorts test results by date (newest first)
 */
export const sortResultsByDate = (results: TestResult[]): TestResult[] => {
  return [...results].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Gets unique test names from results
 */
export const getUniqueTestNames = (data: AllResults): string[] => {
  const testNames = new Set<string>();
  data.results.forEach(result => testNames.add(result.test));
  return Array.from(testNames);
};

/**
 * Groups test results by test name
 */
export const groupResultsByTest = (data: AllResults): Record<string, TestResult[]> => {
  const grouped: Record<string, TestResult[]> = {};
  
  data.results.forEach(result => {
    if (!grouped[result.test]) {
      grouped[result.test] = [];
    }
    grouped[result.test].push(result);
  });
  
  // Sort each group by date
  Object.keys(grouped).forEach(test => {
    grouped[test] = sortResultsByDate(grouped[test]);
  });
  
  return grouped;
};

/**
 * Gets the color for a specific outcome acceptability
 */
export const getColorForAcceptability = (acceptability: OutcomeAcceptability): string => {
  switch (acceptability) {
    case 'Excellent':
      return '#10b981'; // Emerald-500
    case 'Acceptable':
      return '#f59e0b'; // Amber-500
    case 'Bad':
      return '#ef4444'; // Red-500
    default:
      return '#6b7280'; // Gray-500
  }
};

/**
 * Gets the specific background color for a range with a specific acceptability
 */
export const getBackgroundColorForAcceptability = (acceptability: OutcomeAcceptability): string => {
  switch (acceptability) {
    case 'Excellent':
      return 'rgba(16, 185, 129, 0.2)'; // Emerald with opacity
    case 'Acceptable':
      return 'rgba(245, 158, 11, 0.2)'; // Amber with opacity
    case 'Bad':
      return 'rgba(239, 68, 68, 0.2)'; // Red with opacity
    default:
      return 'rgba(107, 114, 128, 0.2)'; // Gray with opacity
  }
};

/**
 * Gets valid results with dates for a specific test
 */
export const getValidResultsWithDates = (data: AllResults, testName: string): Array<{date: Date, value: number, acceptability: OutcomeAcceptability}> => {
  return data.results
    .filter(result => result.test === testName && 'resultValid' in result.result && result.result.resultValid === true)
    .map(result => ({
      date: parseDate(result.date),
      value: 'result' in result.result ? result.result.result : 0,
      acceptability: 'resultAcceptability' in result.result ? result.result.resultAcceptability : 'Bad'
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

/**
 * Gets all test categories (grouped by related tests)
 */
export const getTestCategories = (data: AllResults): Record<string, string[]> => {
  // This is a simple categorization based on test name patterns
  const categories: Record<string, string[]> = {
    'Diabetes': [],
    'Lipids': [],
    'Kidney': [],
    'Thyroid': [],
    'Liver': [],
    'Other': []
  };
  
  data.tests.forEach(test => {
    const name = test.name.toLowerCase();
    
    if (name.includes('hba1c')) {
      categories['Diabetes'].push(test.name);
    } else if (name.includes('cholesterol') || name.includes('triglyceride') || name.includes('ldl')) {
      categories['Lipids'].push(test.name);
    } else if (name.includes('creatinine') || name.includes('egfr') || name.includes('albumin')) {
      categories['Kidney'].push(test.name);
    } else if (name.includes('thyroid') || name.includes('thyroxine') || name.includes('tsh')) {
      categories['Thyroid'].push(test.name);
    } else if (name.includes('transaminase') || name.includes('alt') || name.includes('ast')) {
      categories['Liver'].push(test.name);
    } else {
      categories['Other'].push(test.name);
    }
  });
  
  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });
  
  return categories;
};

/**
 * Rounds a number to the specified number of decimal places
 */
export const roundToDecimalPlaces = (num: number, decimalPlaces: number = 2): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}; 