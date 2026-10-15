import { useContext } from 'react';
import { ProcessedPatientsContext } from './ProcessedPatientsStore';

export function useProcessedPatients() {
  const context = useContext(ProcessedPatientsContext);
  if (!context) {
    throw new Error('useProcessedPatients 必須在 ProcessedPatientsProvider 內使用');
  }
  return context;
}
