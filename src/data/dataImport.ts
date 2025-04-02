import { AllResults } from '../types/labDataTypes';
import { loadLabData } from '../utils/dataLoader';

// Default to empty data structure
let labResults: AllResults = { tests: [], results: [] };

// Load data immediately
(async function() {
  try {
    const response = await loadLabData();
    
    // Update the labResults with the loaded data
    labResults = response.data;
  } catch (error) {
    console.error('Error loading lab data:', error);
  }
})();

export default labResults; 