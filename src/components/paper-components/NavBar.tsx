import React, { useState, useContext } from "react";
import "../../styles/NavBar.css";
import { PaperContext } from "../../contexts/PaperContext";

interface CheckboxItem {
  id: number;
  label: string;
  color: string;
}

export default function NavBar() {
  const paperContext = useContext(PaperContext);
  if (!paperContext) {
    throw new Error("PaperContext not found");
  }
  const { setCurrentColor } = paperContext;

  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>([
    { id: 1, label: "Item 1", color: "red" },
    { id: 2, label: "Item 2", color: "blue" },
  ]);

  const addCheckbox = () => {
    const newId = checkboxes.length + 1;
    const newCheckbox: CheckboxItem = {
      id: newId,
      label: `Item ${newId}`,
      color: newId % 2 === 0 ? "green" : "orange",
    };
    setCheckboxes([...checkboxes, newCheckbox]);
  };

  const handleCheckboxChange = (color: string) => {
    setCurrentColor(color);
  };

  return (
    <div className="NavBar">
      <h3>Navbar</h3>
      <div className="highlights">
        {checkboxes.map((checkbox) => (
          <div key={checkbox.id}>
            <label>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(checkbox.color)}
                style={{ marginRight: "8px", accentColor: checkbox.color }}
              />
              {checkbox.label}
            </label>
          </div>
        ))}
        <div>
          <button onClick={addCheckbox} style={{ border: "none", cursor: "pointer" }}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}
