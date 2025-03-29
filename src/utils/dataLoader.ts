import { AllResults } from '../types/labDataTypes';

/**
 * Attempts to load lab data from JSON files in the public directory
 */
export async function loadLabData(): Promise<AllResults> {
  try {
    // First, try to fetch data from real directory
    try {
      const realFiles = await fetch('/data/real/index.json');
      if (realFiles.ok) {
        const filesList = await realFiles.json();
        
        // Initialize with empty arrays
        const mergedData: AllResults = {
          tests: [],
          results: []
        };
        
        // Load and merge each file
        await Promise.all(filesList.map(async (filename: string) => {
          const response = await fetch(`/data/real/${filename}`);
          if (response.ok) {
            const data = await response.json();
            
            if (data.tests) {
              mergedData.tests = [...mergedData.tests, ...data.tests];
            }
            
            if (data.results) {
              mergedData.results = [...mergedData.results, ...data.results];
            }
          }
        }));
        
        if (mergedData.tests.length > 0 || mergedData.results.length > 0) {
          console.log('Using real lab data');
          return mergedData;
        }
      }
    } catch (error) {
      console.log('No real data found, falling back to demo data');
    }
    
    // Fall back to demo data
    try {
      // Try to load demo data directly
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
        console.log('Using demo lab data');
        return mergedData;
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
    }
    
    // If no data is found, return an empty dataset
    console.error('No lab data found');
    return { tests: [], results: [] };
  } catch (error) {
    console.error('Error in loadLabData:', error);
    return { tests: [], results: [] };
  }
}

// Function to check if we're running on the server side
export const isServer = () => typeof window === 'undefined'; 