import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Pattern {
  id: string;
  partNumber: string;
  usageCount: number;
  threshold: number;
  lastMaintenance: string;
  status: 'Good' | 'Warning' | 'Overdue';
}

export interface MaintenanceLog {
  id: string;
  patternId: string;
  type: string;
  remarks: string;
  date: string;
  technician: string;
}

interface PatternContextType {
  patterns: Pattern[];
  maintenanceLogs: MaintenanceLog[];
  incrementUsage: (patternId: string) => void;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'date' | 'technician'>) => void;
  searchPatterns: (query: string) => Pattern[];
}

const PatternContext = createContext<PatternContextType | undefined>(undefined);

// Dummy data
const initialPatterns: Pattern[] = [
  {
    id: 'PTN001',
    partNumber: 'ENG-V8-001',
    usageCount: 45,
    threshold: 50,
    lastMaintenance: '2024-01-15',
    status: 'Good'
  },
  {
    id: 'PTN002',
    partNumber: 'GEAR-TR-002',
    usageCount: 52,
    threshold: 50,
    lastMaintenance: '2024-01-10',
    status: 'Warning'
  },
  {
    id: 'PTN003',
    partNumber: 'BLOCK-CYL-003',
    usageCount: 75,
    threshold: 60,
    lastMaintenance: '2023-12-20',
    status: 'Overdue'
  },
  {
    id: 'PTN004',
    partNumber: 'VALVE-HEAD-004',
    usageCount: 30,
    threshold: 40,
    lastMaintenance: '2024-01-20',
    status: 'Good'
  },
  {
    id: 'PTN005',
    partNumber: 'PISTON-STD-005',
    usageCount: 38,
    threshold: 45,
    lastMaintenance: '2024-01-18',
    status: 'Good'
  },
  {
    id: 'PTN006',
    partNumber: 'HOUSING-PUMP-006',
    usageCount: 42,
    threshold: 40,
    lastMaintenance: '2024-01-12',
    status: 'Warning'
  },
  {
    id: 'PTN007',
    partNumber: 'FLANGE-PIPE-007',
    usageCount: 25,
    threshold: 35,
    lastMaintenance: '2024-01-22',
    status: 'Good'
  },
  {
    id: 'PTN008',
    partNumber: 'BRACKET-MOUNT-008',
    usageCount: 55,
    threshold: 50,
    lastMaintenance: '2024-01-05',
    status: 'Warning'
  },
  {
    id: 'PTN009',
    partNumber: 'COVER-ENGINE-009',
    usageCount: 18,
    threshold: 30,
    lastMaintenance: '2024-01-25',
    status: 'Good'
  },
  {
    id: 'PTN010',
    partNumber: 'SHAFT-DRIVE-010',
    usageCount: 68,
    threshold: 55,
    lastMaintenance: '2023-12-15',
    status: 'Overdue'
  }
];

const initialLogs: MaintenanceLog[] = [
  {
    id: 'LOG001',
    patternId: 'PTN001',
    type: 'Routine Inspection',
    remarks: 'Pattern in good condition, no issues found',
    date: '2024-01-15',
    technician: 'John Smith'
  },
  {
    id: 'LOG002',
    patternId: 'PTN002',
    type: 'Minor Repair',
    remarks: 'Small crack repaired, pattern ready for use',
    date: '2024-01-10',
    technician: 'Sarah Johnson'
  },
  {
    id: 'LOG003',
    patternId: 'PTN003',
    type: 'Major Overhaul',
    remarks: 'Complete restoration needed due to excessive wear',
    date: '2023-12-20',
    technician: 'Mike Wilson'
  }
];

export function PatternProvider({ children }: { children: ReactNode }) {
  const [patterns, setPatterns] = useState<Pattern[]>(initialPatterns);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(initialLogs);

  const updatePatternStatus = (pattern: Pattern): Pattern => {
    let status: Pattern['status'] = 'Good';
    
    if (pattern.usageCount >= pattern.threshold) {
      const daysSinceLastMaintenance = Math.floor(
        (new Date().getTime() - new Date(pattern.lastMaintenance).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastMaintenance > 30) {
        status = 'Overdue';
      } else {
        status = 'Warning';
      }
    }
    
    return { ...pattern, status };
  };

  const incrementUsage = (patternId: string) => {
    setPatterns(prev => prev.map(pattern => {
      if (pattern.id === patternId) {
        const updated = { ...pattern, usageCount: pattern.usageCount + 1 };
        return updatePatternStatus(updated);
      }
      return pattern;
    }));
  };

  const addMaintenanceLog = (log: Omit<MaintenanceLog, 'id' | 'date' | 'technician'>) => {
    const newLog: MaintenanceLog = {
      ...log,
      id: `LOG${String(maintenanceLogs.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      technician: 'Current User'
    };
    
    setMaintenanceLogs(prev => [newLog, ...prev]);
  };

  const searchPatterns = (query: string): Pattern[] => {
    if (!query.trim()) return patterns;
    
    const lowercaseQuery = query.toLowerCase();
    return patterns.filter(pattern => 
      pattern.id.toLowerCase().includes(lowercaseQuery) ||
      pattern.partNumber.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <PatternContext.Provider 
      value={{ 
        patterns, 
        maintenanceLogs, 
        incrementUsage, 
        addMaintenanceLog, 
        searchPatterns 
      }}
    >
      {children}
    </PatternContext.Provider>
  );
}

export function usePatterns() {
  const context = useContext(PatternContext);
  if (context === undefined) {
    throw new Error('usePatterns must be used within a PatternProvider');
  }
  return context;
}