'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllResults } from '@/types/labDataTypes';
import { loadLabData } from '@/utils/dataLoader';

// Define the shape of the context
type LabDataContextType = {
  labData: AllResults;
  isLoading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => Promise<void>;
};

// Create the context with default values
const LabDataContext = createContext<LabDataContextType>({
  labData: { tests: [], results: [] },
  isLoading: true,
  error: null,
  isDemo: false,
  refetch: async () => {},
});

// Custom hook to access the lab data context
export const useLabData = () => useContext(LabDataContext);

// Provider component
export const LabDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [labData, setLabData] = useState<AllResults>({ tests: [], results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const fetchData = async () => {
    console.log('Fetching lab data...');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loadLabData();
      const data = response.data;
      
      if (!data || (!data.tests?.length && !data.results?.length)) {
        console.error('No data received from loadLabData');
        setError('No lab data found. Please check your data files.');
      } else {
        console.log(`Successfully loaded data: ${data.tests.length} tests, ${data.results.length} results`);
        setLabData(data);
        setIsDemo(response.isDemo);
      }
    } catch (err) {
      console.error('Error loading lab data:', err);
      setError('Failed to load lab data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when the provider mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <LabDataContext.Provider value={{ labData, isLoading, error, isDemo, refetch: fetchData }}>
      {children}
    </LabDataContext.Provider>
  );
};

export default LabDataContext; 