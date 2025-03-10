// import { useState, useRef } from "react";
// import { PdfLoader, PdfHighlighter, PdfHighlighterUtils } from "react-pdf-highlighter-extended";
// import ExpandableTip from "./ExpandableTip";

// export const myPdfHighlighter = () => {
//     const [highlights, setHighlights] = useState<Array<Highlight>>([]);

//     /** Refs for PdfHighlighter utilities
//      * These contain numerous helpful functions, such as scrollToHighlight,
//      * getCurrentSelection, setTip, and many more
//      */
//     const highlighterUtilsRef = useRef<PdfHighlighterUtils>();

//     return (
//         <PdfLoader document={url}>
//             {(pdfDocument) => (
//                 <PdfHighlighter
//                     enableAreaSelection={(event) => event.altKey}
//                     pdfDocument={pdfDocument}
//                     utilsRef={(_pdfHighlighterUtils) => {
//                         highlighterUtilsRef.current = _pdfHighlighterUtils;
//                     }}
//                     selectionTip={<ExpandableTip />} // Component will render as a tip upon any selection
//                     highlights={highlights}
//                 >
//                     {/* User-defined HighlightContainer component goes here */}
//                 </PdfHighlighter>
//             )}
//         </PdfLoader>
//     );
// }
