'use client';

import CustomDashboard from '../../components/CustomDashboard';
import { useLabData } from '@/contexts/LabDataContext';

export default function CustomDashboardPage() {
  const { labData, isLoading, error } = useLabData();
  
  return (
    <main>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-700">Loading your lab data...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-1">Please check your data files and try again.</p>
        </div>
      ) : (
        <CustomDashboard labData={labData} />
      )}
    </main>
  );
} 