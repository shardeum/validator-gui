import React, { createContext, ReactNode, useState } from 'react';

const SelectedStrategyContext = createContext<{
  provider: any
}>({
  provider: null
});

const SelectedStrategyContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(availableStrategies[0]);
  const [action, setAction] = useState<TransactionAction>("deposit");

  return (
    <SelectedStrategyContext.Provider value={{selectedStrategy, setSelectedStrategy, action, setAction}}>
      {children}
    </SelectedStrategyContext.Provider>
  );
};

export { SelectedStrategyContext, SelectedStrategyContextProvider };
