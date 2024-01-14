import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "./List";
export default function SearchBar() {
  const [value, setValue] = useState("");
  const [expandList, setExpandList] = useState(false);
  const label = useRef(null);
  const input = useRef(null);
  const navigate = useNavigate();

  function defaultSettings() {
    setValue("");
    setExpandList(false);
  }

  return (
    // BŁĄD DO POPRAWY Z DROP LIST
    // BŁĄD DO POPRAWY Z DROP LIST
    // BŁĄD DO POPRAWY Z DROP LIST
    // BŁĄD DO POPRAWY Z DROP LIST
    // PRAWDOPODOBNIE PRZEZ LAZY LOADING COMPONENT
    <label
      className="search_container"
      ref={label}
      onBlur={(e) => {
        if (!label.current.contains(e.relatedTarget)) setExpandList(false);
      }}
      onFocus={() => {
        setExpandList(true);
      }}
      htmlFor="user_search">
      <input
        ref={input}
        id="user_search"
        type="search"
        placeholder="Find user..."
        autoComplete="off"
        pattern="\w*"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.checkValidity()) {
            defaultSettings();
            input.current.blur();
            navigate(`/${e.target.value}`);
          }
        }}
      />
      {expandList && <List fn={defaultSettings} value={value} />}
    </label>
  );
}
