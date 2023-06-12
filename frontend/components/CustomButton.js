export default function CustomButton({text, type="button", disabled=false, onClick, className="contract-btn"}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {text}
    </button>
  );
}
