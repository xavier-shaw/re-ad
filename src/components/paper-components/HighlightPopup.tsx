import type { ViewportHighlight } from "react-pdf-highlighter-extended";
import { ReadHighlight } from "./HighlightContainer";
import "../../styles/HighlightPopup.css";

interface HighlightPopupProps {
    highlight: ViewportHighlight<ReadHighlight>;
}

const HighlightPopup = ({ highlight }: HighlightPopupProps) => {
    return highlight.comment ? (
        <div className="Highlight__popup">{highlight.comment}</div>
    ) : (
        <div className="Highlight__popup">Comment has no Text</div>
    );
};

export default HighlightPopup;