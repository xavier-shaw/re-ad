import "../../styles/Sidebar.css";
import { CommentedHighlight } from "./HighlightContainer";
import { PaperContext } from "../../contexts/PaperContext";
import { useContext } from "react";

interface SidebarProps {
  highlights: Array<CommentedHighlight>;
  resetHighlights: () => void;
}

const updateHash = (highlight: CommentedHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const Sidebar = ({
  highlights,
  resetHighlights,
}: SidebarProps) => {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { readRecords } = paperContext;

  const convertColorToRGBA = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  return (
    <div className="sidebar" style={{ width: "25%" }}>
      {/* Highlights list */}
      {highlights && (
        <ul className="sidebar__highlights">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="sidebar__highlight"
              onClick={() => {
                updateHash(highlight);
              }}
              style={{ backgroundColor: convertColorToRGBA(readRecords[highlight.readRecordId].color) }}
            >
              <div>
                {/* Highlight comment and text */}
                {highlight.content.text && (
                  <blockquote style={{ marginTop: "0.5rem" }}>
                    {`${highlight.content.text.slice(0, 90).trim()}…`}
                  </blockquote>
                )}

                {/* Highlight image */}
                {highlight.content.image && (
                  <div
                    className="highlight__image__container"
                    style={{ marginTop: "0.5rem" }}
                  >
                    <img
                      src={highlight.content.image}
                      alt={"Screenshot"}
                      className="highlight__image"
                    />
                  </div>
                )}
              </div>

              {/* Highlight page number */}
              <div className="highlight__location">
                Page {highlight.position.boundingRect.pageNumber}
              </div>
            </li>
          ))}
        </ul>
      )}

      {highlights && highlights.length > 0 && (
        <div style={{ padding: "0.5rem" }}>
          <button onClick={resetHighlights} className="sidebar__reset">
            Reset highlights
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;