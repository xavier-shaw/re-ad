// import React, { useState } from "react";
// import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

// const steps: Step[] = [
//   {
//     target: "#nav-home", // Target the element by ID or class
//     content: "This is the home button, click here to go back.",
//   },
//   {
//     target: "#dashboard",
//     content: "Here is your dashboard where you see your data.",
//   },
//   {
//     target: "#settings",
//     content: "Click here to customize your preferences.",
//   },
// ];

// const Onboarding: React.FC = () => {
//   const [run, setRun] = useState(true);

//   const handleJoyrideCallback = (data: CallBackProps) => {
//     const { status } = data;
//     if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
//       setRun(false);
//       localStorage.setItem("onboardingCompleted", "true"); // Save completion
//     }
//   };

//   return (
//     <Joyride
//       steps={steps}
//       run={run}
//       continuous
//       showProgress
//       showSkipButton
//       callback={handleJoyrideCallback}
//     />
//   );
// };

// export default Onboarding;
