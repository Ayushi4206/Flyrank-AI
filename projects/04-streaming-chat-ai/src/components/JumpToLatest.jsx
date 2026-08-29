function JumpToLatest({ onClick }) {
  return (
    <button
      className="jump-to-latest"
      onClick={onClick}
      type="button"
    >
      ↓ Jump to latest
    </button>
  );
}

export default JumpToLatest;