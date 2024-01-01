import { useRef, useState } from "react";
import Window from "./Window";
export default function CreateComment(prop) {
  const [value, setValue] = useState("");
  const [expandMenu, setExpandMenu] = useState(false);
  const [validArea, setValidArea] = useState(false);
  const validation = useRef(null);
  const { nick, avatar, loginWindow, login, loadData } = prop;

  function setWindow() {
    setExpandMenu((prev) => !prev);
  }
  return (
    <div className="com_creator">
      <header className="intro">
        <div className="avatar">
          <img src={avatar} alt="avatar" />
        </div>
        <div className="content">
          <textarea
            ref={validation}
            value={value}
            onChange={(e) => {
              setValidArea(false)
              setValue(e.target.value)}}
            placeholder="What's up..."
            minLength={1}
            required
            title="check"
            maxLength={1500}></textarea>
          {validArea && <small className="rule">The comment cannot be empty!</small>}
        </div>
      </header>
      <button
        onClick={() => {
          if (!login) return loginWindow();
          if (!validation.current.checkValidity()) return setValidArea(true);
          setWindow();
        }}
        className="open_confrim_window">
        Add Comment
      </button>
      {expandMenu && (
        <Window
          nick={nick}
          avatar={avatar}
          content={value}
          loadData={loadData}
          closeWindow={setWindow}
        />
      )}
    </div>
  );
}
