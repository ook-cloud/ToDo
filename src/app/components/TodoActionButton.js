export const TodoActionButton = ({
  disabled,
  onClick,
  className,
  text,
  type = "button",
}) => {
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
};
