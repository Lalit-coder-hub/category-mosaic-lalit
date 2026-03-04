import React, { createContext, useContext, useState, useMemo } from 'react';
import { TrendRawData, TrendScored } from '@/lib/types';
import { scoreTrends } from '@/lib/scoring';
import { defaultTrends } from '@/lib/default-data';

interface DataContextType {
  rawData: TrendRawData[];
  trends: TrendScored[];
  setRawData: (data: TrendRawData[]) => void;
  warnings: string[];
  setWarnings: (w: string[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rawData, setRawData] = useState<TrendRawData[]>(defaultTrends);
  const [warnings, setWarnings] = useState<string[]>([]);

  const trends = useMemo(() => scoreTrends(rawData), [rawData]);

  return (
    <DataContext.Provider value={{ rawData, trends, setRawData, warnings, setWarnings }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
