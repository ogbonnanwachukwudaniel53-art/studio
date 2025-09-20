
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SchoolContextType {
  schoolName: string;
  setSchoolName: (name: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: ReactNode }) => {
  const [schoolName, setSchoolName] = useState("EduResult Pro High School");

  const value = {
    schoolName,
    setSchoolName,
  };

  return (
    <SchoolContext.Provider value={value}>
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (context === undefined) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
