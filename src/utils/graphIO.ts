export function exportGraph({ highlights, nodes, edges, readRecords }: {
  highlights: any[],
  nodes: any[],
  edges: any[],
  readRecords: any
}) {
  const data = { highlights, nodes, edges, readRecords };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "re-ad-graph-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function importGraph(file: File, setGraphState: (data: any) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      setGraphState(data);
    } catch (err) {
      alert("Invalid file format");
    }
  };
  reader.readAsText(file);
} 