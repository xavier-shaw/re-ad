interface ButtonProps {
  className: string;
  text: string;
  onClick: () => void;
}

function Button({ className, text, onClick }: ButtonProps) {
  return (
    <div className={className}>
      <button onClick={onClick}>{text}</button>
    </div>
  );
}

export default Button;
