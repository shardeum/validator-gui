// FetcherContext.tsx
import React, { createContext, ReactNode, useContext } from 'react'
import { fetcher } from '../hooks/fetcher'
import { ToastContext } from './ToastContextProvider'

type FetchFunction = <T>(input: RequestInfo | URL, init?: RequestInit, contextDescription?: string) => Promise<T>

// Create a context that can hold a fetch function or null.
export const FetcherContext = createContext<FetchFunction | null>(null)

// Component that provides a fetch function with additional context capabilities to its children.
export default function FetcherContextProvider({ children }: { children: ReactNode }) {
  const { showErrorMessage } = useContext(ToastContext)

  // A wrapper function that adds context description to the fetcher function.
  function fetcherWithContext<T>(
    input: RequestInfo | URL,
    init?: RequestInit,
    contextDescription = 'fetching data'
  ): Promise<T> {
    return fetcher(input, init || {}, showErrorMessage, contextDescription)
  }

  // Render the provider component, passing the fetcherWithContext function to its children.
  return (
    <FetcherContext.Provider value={fetcherWithContext}>
      {children}
    </FetcherContext.Provider>
  )
}
