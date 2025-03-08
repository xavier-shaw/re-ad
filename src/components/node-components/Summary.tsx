import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SummaryProps {
  className: string,
  text: string;
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

function Summary ({ className, text }: SummaryProps) {
  const [summary, setSummary] = useState<string>("");

  // useEffect(() => {
  //   const fetchSummary = async () => {
  //     if (!text) return;
  //     try {
  //       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
  //       const response = await model.generateContent(`Summarize this in three sentences or less or if it's a single word/phrase give the definition: "${text}"`);
  //       const result = await response.response;
  //       setSummary(result.text() || "No summary available.");
  //     } catch (error) {
  //       console.error("Error fetching summary:", error);
  //       setSummary("Failed to fetch summary.");
  //     }
  //   };

  //   fetchSummary();
  // }, [text]);

  return (
    <div className={ className }>
      <p>Definition/summary</p>
      <p style={{ fontStyle: "italic" }}>{text}</p>
      <p>(From Gemini) {summary || "Generating summary..."}</p>
    </div>
  );
};

export default Summary;
