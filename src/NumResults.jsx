export default function NumResults({ children }) {
  return (
    <p className="num-results">
      Found <strong>{children}</strong> results
    </p>
  );
}
