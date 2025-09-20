
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface ResultsContextType {
  areResultsOnHold: boolean;
  setAreResultsOnHold: (isOnHold: boolean) => void;
}

// Create the context with a default value
const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

// Create a provider component
export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [areResultsOnHold, setAreResultsOnHold] = useState(false); // Default to released

  const value = {
    areResultsOnHold,
    setAreResultsOnHold,
  };

  return (
    <ResultsContext.Provider value={value}>
      {children}
    </ResultsContext.Provider>
  );
};

// Create a custom hook for easy consumption of the context
export const useResults = () => {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
};

    