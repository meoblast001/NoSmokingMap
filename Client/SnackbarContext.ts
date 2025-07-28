import { createContext } from 'react';

export interface SnackbarInstance {
  message: string;
}

export interface SnackbarContextData {
  display: (data: SnackbarInstance) => void
}

export const SnackbarContext = createContext<SnackbarContextData>({ display: () => {} });
