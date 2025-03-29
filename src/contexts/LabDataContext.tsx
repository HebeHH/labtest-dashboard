'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AllResults } from '@/types/labDataTypes';
import { loadLabData } from '@/utils/dataLoader';

// Define the shape of the context
type LabDataContextType = {
  labData: AllResults;
  isLoading: boolean;
  error: string | null;
};

// Create the context with default values
const LabDataContext = createContext<LabDataContextType>({
  labData: { tests: [], results: [] },
  isLoading: true,
  error: null,
});

// Custom hook to access the lab data context
export const useLabData = () => useContext(LabDataContext);

// Provider component
export const LabDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [labData, setLabData] = useState<AllResults>({ tests: [], results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data when the provider mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadLabData();
        setLabData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading lab data:', err);
        setError('Failed to load lab data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <LabDataContext.Provider value={{ labData, isLoading, error }}>
      {children}
    </LabDataContext.Provider>
  );
};

export default LabDataContext; 