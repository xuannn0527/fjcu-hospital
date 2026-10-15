import { createContext } from 'react';

export interface ProcessedPatient {
  patientId: string;
  name: string;
  medicalRecordNo: string;
  gender: string;
  age: number;
  triageLevel: number;
  complaint: string;
  riskPercent: number;
  decision: string;
  doctorNote: string;
  treatments: string[];
  processedAt: string;
  vitals?: Record<string, string | number>;
}

export interface ProcessedPatientsContextValue {
  processedPatients: ProcessedPatient[];
  archivePatient: (patient: ProcessedPatient) => void;
  isPatientProcessed: (patientId: string) => boolean;
}

export const ProcessedPatientsContext = createContext<ProcessedPatientsContextValue | null>(null);
