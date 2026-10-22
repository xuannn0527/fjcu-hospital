import { useState, type ReactNode } from 'react';
import {
  ProcessedPatientsContext,
  type ProcessedPatient,
} from './ProcessedPatientsStore';

interface ProcessedPatientsProviderProps {
  children: ReactNode;
}

export function ProcessedPatientsProvider({ children }: ProcessedPatientsProviderProps) {
  const [processedPatients, setProcessedPatients] = useState<ProcessedPatient[]>([]);

  const archivePatient = (patient: ProcessedPatient) => {
    setProcessedPatients((currentPatients) =>
      currentPatients.some((currentPatient) => currentPatient.patientId === patient.patientId)
        ? currentPatients
        : [...currentPatients, patient],
    );
  };

  const isPatientProcessed = (patientId: string) =>
    processedPatients.some((patient) => patient.patientId === patientId);

  return (
    <ProcessedPatientsContext.Provider
      value={{ processedPatients, archivePatient, isPatientProcessed }}
    >
      {children}
    </ProcessedPatientsContext.Provider>
  );
}
