import { AllResults } from '../types/labDataTypes';

/**
 * Simplified function to load lab data from the demo files
 */
export async function loadLabData(): Promise<AllResults> {
  try {
    // Directly fetch the demo data files
    const labDataResponse = await fetch('/data/demo/labData.json');
    const additionalResponse = await fetch('/data/demo/additional.json');
    
    // Initialize with empty arrays
    const mergedData: AllResults = {
      tests: [],
      results: []
    };
    
    // Add data from labData.json if available
    if (labDataResponse.ok) {
      const labData = await labDataResponse.json();
      if (labData.tests) {
        mergedData.tests = [...mergedData.tests, ...labData.tests];
      }
      if (labData.results) {
        mergedData.results = [...mergedData.results, ...labData.results];
      }
    }
    
    // Add data from additional.json if available
    if (additionalResponse.ok) {
      const additionalData = await additionalResponse.json();
      if (additionalData.tests) {
        mergedData.tests = [...mergedData.tests, ...additionalData.tests];
      }
      if (additionalData.results) {
        mergedData.results = [...mergedData.results, ...additionalData.results];
      }
    }
    
    if (mergedData.tests.length > 0 || mergedData.results.length > 0) {
      console.log('Data loaded successfully:', 
        `${mergedData.tests.length} tests, ${mergedData.results.length} results`);
      return mergedData;
    }
    
    // If no data is found, return an empty dataset
    console.error('No lab data found in demo files');
    return { tests: [], results: [] };
  } catch (error) {
    console.error('Error in loadLabData:', error);
    return { tests: [], results: [] };
  }
}

// Function to check if we're running on the server side
export const isServer = () => typeof window === 'undefined'; 