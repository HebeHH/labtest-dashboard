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
// Map of categories to keywords that should match tests in that category
export const testCategoryMap: Record<string, string[]> = {
  'Diabetes': ['hba1c', 'glucose', 'insulin', 'fructosamine', 'c-peptide', 'diabetes'],
  'Lipids': ['cholesterol', 'triglyceride', 'lipoprotein', 'apob', 'apolipoprotein'],
  'Kidney': ['creatinine', 'egfr', 'albumin', 'urea', 'uric acid', 'microalbumin', 'cystatin', 'kidney', 'renal'],
  'Thyroid': ['thyroid', 'thyroxine', 'triiodothyronine', 'thyroglobulin', 'tpo antibody'],
  'Liver': ['transaminase', 'alanine aminotransferase', 'aspartate aminotransferase', 'alkaline phosphatase', 'bilirubin', 'gamma gt', 'albumin', 'liver', 'hepatic'],
  'Blood Count': ['hemoglobin', 'hematocrit',  'platelet',  'neutrophil', 'lymphocyte', 'monocyte', 'eosinophil', 'basophil'],
  'Electrolytes': ['sodium', 'potassium', 'chloride', 'calcium', 'magnesium', 'phosphate', 'bicarbonate'],
  'Iron': ['iron', 'ferritin', 'transferrin', 'tibc', 'saturation'],
  'Inflammation': [ 'c-reactive protein', 'sedimentation', 'fibrinogen'],
  'Vitamins': ['vitamin', 'folate', 'folic acid', 'b12', 'cobalamin', 'vitamin d', '25-oh'],
  'Hormones': ['testosterone', 'estrogen', 'estradiol', 'progesterone', 'cortisol', 'prolactin', 'dhea', 'androgen'],
  'Other': []
};

export const getTestCategories = (data: AllResults): Record<string, string[]> => {
  // Initialize the categories with empty arrays
  const categories: Record<string, string[]> = {};
  
  // Initialize all categories from the map
  Object.keys(testCategoryMap).forEach(category => {
    categories[category] = [];
  });
  
  data.tests.forEach(test => {
    const testNameLower = test.name.toLowerCase();
    let categorized = false;
    
    // Check each category's keywords for a match
    for (const [category, keywords] of Object.entries(testCategoryMap)) {
      // Skip the "Other" category in this initial pass
      if (category === 'Other') continue;
      
      // Check if any keyword matches the test name
      if (keywords.some(keyword => testNameLower.includes(keyword))) {
        categories[category].push(test.name);
        categorized = true;
        break; // Assign to first matching category only
      }
    }
    
    // If not categorized elsewhere, put it in "Other"
    if (!categorized) {
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