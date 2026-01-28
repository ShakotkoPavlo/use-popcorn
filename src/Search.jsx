import { useRef } from "react";
import { useKey } from "./useKey";

export default function Search({ query, setQuery }) {
  const refEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === refEl.current) return;
    refEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={refEl}
    />
  );
}
