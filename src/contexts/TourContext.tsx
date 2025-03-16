import React, { createContext, useContext, useState } from "react";

interface TourContextType {
    navBarRun: boolean;
    setNavBarRun: React.Dispatch<React.SetStateAction<boolean>>;
    paperPanelRun: boolean;
    setPaperPanelRun: React.Dispatch<React.SetStateAction<boolean>>;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [paperPanelRun, setPaperPanelRun] = useState<boolean>(true);
    const [navBarRun, setNavBarRun] = useState<boolean>(false);

  return (
    <TourContext.Provider value={{ navBarRun, setNavBarRun, paperPanelRun, setPaperPanelRun }}>
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
