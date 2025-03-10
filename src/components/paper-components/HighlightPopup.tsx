import type { ViewportHighlight } from "react-pdf-highlighter-extended";
import { CommentedHighlight } from "./HighlightContainer";
import "../../styles/HighlightPopup.css";

interface HighlightPopupProps {
    highlight: ViewportHighlight<CommentedHighlight>;
}

const HighlightPopup = ({ highlight }: HighlightPopupProps) => {
    return highlight.comment ? (
        <div className="Highlight__popup">{highlight.comment}</div>
    ) : (
        <div className="Highlight__popup">Comment has no Text</div>
    );
};

export default HighlightPopup;