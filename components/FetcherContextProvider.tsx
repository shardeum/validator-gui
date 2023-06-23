// FetcherContext.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { fetcher } from '../hooks/fetcher';
import { ToastContext } from './ToastContextProvider';

export const FetcherContext = createContext<typeof fetcher | null>(null);

export default function FetcherContextProvider({children}: { children: ReactNode }) {
  const {showErrorMessage} = useContext(ToastContext);

  function fetcherWithContext<T>(input: RequestInfo | URL, init: RequestInit): Promise<T> {
    return fetcher(input, init, showErrorMessage);
  }

  return (
    <FetcherContext.Provider value={fetcherWithContext}>{children}</FetcherContext.Provider>
  );
}
