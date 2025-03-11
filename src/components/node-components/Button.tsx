interface ButtonProps {
  className: string;
  text: string;
  onClick: () => void;
}

function Button({ className, text, onClick }: ButtonProps) {
  return (
    <button className={className} style={{ color: "white" }} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
