interface LinkButtonProps {
  className: string;
}

function LinkButton({ className }: LinkButtonProps) {
  return (
    <div className={ className }>
      <button>Link</button>
    </div>
  )
}

export default LinkButton
