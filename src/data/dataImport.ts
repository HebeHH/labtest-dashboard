import { AllResults } from '../types/labDataTypes';
import demoLabResults from './demoLabData';

// Default to using demo data
let labResults: AllResults = demoLabResults;

// Try to dynamically load the actual lab data if it exists
// This approach uses an async import with a try/catch,
// but initializes with demo data for immediate use
const loadActualData = async () => {
  try {
    // Using dynamic import to handle the case where the file might not exist
    const actualData = await import('./labData');
    if (actualData.default) {
      labResults = actualData.default;
      console.log('Using actual lab data');
    }
  } catch (error) {
    console.log('Lab data file not found, using demo data instead');
  }
};

// Try to load the actual data, but the app will use demo data
// until the actual data is loaded (if it exists)
loadActualData();

export default labResults; 