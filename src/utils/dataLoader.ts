import { AllResults } from '../types/labDataTypes';

/**
 * Load lab data according to the following rules:
 * 1. Check if real data exists and load it if available
 * 2. Only load demo data if no real data exists
 * 3. Always load from index.json files
 * 4. Merge data from multiple files if present
 */
export async function loadLabData(): Promise<AllResults> {
  try {
    // Initialize with empty arrays
    const mergedData: AllResults = {
      tests: [],
      results: []
    };
    
    // First check if real data exists
    const realIndexResponse = await fetch('/data/real/index.json');
    
    if (realIndexResponse.ok) {
      const realIndex = await realIndexResponse.json() as string[];
      
      // Check if the index is not empty
      if (realIndex.length > 0) {
        console.log('Real data available, loading files:', realIndex);
        
        // Load each real data file listed in the index
        for (const filename of realIndex) {
          const response = await fetch(`/data/real/${filename}`);
          
          if (response.ok) {
            const data = await response.json();
            // Merge data
            if (data.tests) {
              mergedData.tests = [...mergedData.tests, ...data.tests];
            }
            if (data.results) {
              mergedData.results = [...mergedData.results, ...data.results];
            }
          } else {
            console.warn(`Failed to load real data file: ${filename}`);
          }
        }
        
        // If we have loaded real data, return it and don't load demo data
        if (mergedData.tests.length > 0 || mergedData.results.length > 0) {
          console.log('Real data loaded successfully:', 
            `${mergedData.tests.length} tests, ${mergedData.results.length} results`);
          return mergedData;
        }
      }
    }
    
    // If we reach here, it means no real data was loaded successfully
    // Try to load demo data instead
    const demoIndexResponse = await fetch('/data/demo/index.json');
    
    if (demoIndexResponse.ok) {
      const demoIndex = await demoIndexResponse.json() as string[];
      
      if (demoIndex.length > 0) {
        console.log('No real data available, loading demo data files:', demoIndex);
        
        // Load each demo file listed in the index
        for (const filename of demoIndex) {
          const response = await fetch(`/data/demo/${filename}`);
          
          if (response.ok) {
            const data = await response.json();
            // Merge data
            if (data.tests) {
              mergedData.tests = [...mergedData.tests, ...data.tests];
            }
            if (data.results) {
              mergedData.results = [...mergedData.results, ...data.results];
            }
          } else {
            console.warn(`Failed to load demo data file: ${filename}`);
          }
        }
      }
    }
    
    if (mergedData.tests.length > 0 || mergedData.results.length > 0) {
      console.log('Demo data loaded successfully:', 
        `${mergedData.tests.length} tests, ${mergedData.results.length} results`);
      return mergedData;
    }
    
    // If no data is found, return an empty dataset
    console.error('No lab data found in either real or demo files');
    return { tests: [], results: [] };
  } catch (error) {
    console.error('Error in loadLabData:', error);
    return { tests: [], results: [] };
  }
}

// Function to check if we're running on the server side
export const isServer = () => typeof window === 'undefined'; 