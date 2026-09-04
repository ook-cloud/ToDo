export const TodoButton = ({ text, onClick, filterValue }) => {
  const isActive = filterValue === text;

  return (
    <button
      type="button"
      className="button2"
      onClick={onClick}
      style={{
        backgroundColor: isActive ? "#3c82f6" : "#f3f4f6",
        color: isActive ? "white" : "black",
      }}
    >
      {text}
    </button>
  );
};
