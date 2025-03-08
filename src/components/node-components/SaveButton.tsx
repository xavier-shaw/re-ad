interface SaveButtonProps {
  className: string;
}

function SaveButton({ className }: SaveButtonProps) {
  return (
    <div className={ className }>
      <button>Save</button>
    </div>
  )
}

export default SaveButton
