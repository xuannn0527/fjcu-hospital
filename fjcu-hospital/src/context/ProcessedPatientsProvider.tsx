import { useEffect, useState, type ReactNode } from 'react';
import { ProcessedPatientsContext, type ProcessedPatient } from './ProcessedPatientsStore';

const STORAGE_KEY = 'fjcu-processed-patients';

const readProcessedPatients = (): ProcessedPatient[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error('已歸檔病患資料格式錯誤');
    return parsed as ProcessedPatient[];
  } catch (error) {
    console.error('讀取已處理病患歸檔失敗:', error);
    return [];
  }
};

export function ProcessedPatientsProvider({ children }: { children: ReactNode }) {
  const [processedPatients, setProcessedPatients] = useState<ProcessedPatient[]>(readProcessedPatients);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(processedPatients));
    } catch (error) {
      console.error('儲存已處理病患歸檔失敗:', error);
    }
  }, [processedPatients]);

  const archivePatient = (patient: ProcessedPatient) => {
    setProcessedPatients((current) => [
      patient,
      ...current.filter((item) => item.patientId !== patient.patientId),
    ]);
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
