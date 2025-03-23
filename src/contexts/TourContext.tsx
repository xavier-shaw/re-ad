import React, { createContext, useEffect, useState } from "react";
import { Step } from "react-joyride";

type TourContextType = {
  navBarRun: boolean;
  setNavBarRun: React.Dispatch<React.SetStateAction<boolean>>;
  paperPanelRun: boolean;
  setPaperPanelRun: React.Dispatch<React.SetStateAction<boolean>>;
  steps: Step[];
}

const STEPS: Step[] = [
  {
    target: '.upload-pdf',
    content: 'Get started by uploading your first PDF!',
    placement: 'bottom',
    data: {
      show: "paper"
    }
  },
  {
    target: '.start-highlight',
    content: 'Get started by highlighting your first highlight! You can also hold option and take a screenshot as a highlight',
    placement: 'right',
    data: {
      show: "paper"
    }
  },
  {
    target: '.start-highlight',
    content: 'Each highlight you make will create a node corresponding to that node and the current read you are on. With this node, you are able to link them to other nodes, generate summaries & definitions, as well as take your own notes.',
    placement: 'right',
    data: {
      show: "paper"
    }
  },
  {
    target: ".setting-up-first-read",
    content: "Get started with setting up your first read here! Different reads should be mapped to different intentions.",
    placement: "bottom",
    data: {
      show: "navbar"
    }
  },
  {
    target: ".active-read",
    content: "You can see what read you are currently on. Any highlight will be associated with the selected read. Use this to also toggle between your reads.",
    placement: "left-end",
    data: {
      show: "navbar"
    }
  },
];

export const TourContext = createContext<TourContextType | null>(null);

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const [paperPanelRun, setPaperPanelRun] = useState<boolean>(true);
  const [navBarRun, setNavBarRun] = useState<boolean>(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (paperPanelRun) {
      setSteps(STEPS.filter(step => step.data?.show === "paper"));
    } 
    else if (navBarRun) {
      setSteps(STEPS.filter(step => step.data?.show === "navbar"));
    }
  }, [paperPanelRun, navBarRun]);

  return (
    <TourContext.Provider
      value={{
        navBarRun,
        setNavBarRun,
        paperPanelRun,
        setPaperPanelRun,
        steps
      }}>
      {children}
    </TourContext.Provider>
  );
};