interface ReferencesProps {
  className: string;
}

function References({ className }: ReferencesProps) {
  return (
    <div className={`references-container ${className}`}>
      <h3 className="references-title">References in Paper</h3>
      <p className="references-placeholder">No references found.</p>
    </div>
  );
}

export default References;
