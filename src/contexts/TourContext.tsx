import React, { createContext, useContext, useState } from "react";

interface TourContextType {
  run: boolean;
  setRun: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [run, setRun] = useState<boolean>(false);

  return (
    <TourContext.Provider value={{ run, setRun }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
};
