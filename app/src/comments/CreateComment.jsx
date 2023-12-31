import { useState } from "react";
import Window from "./Window";
export default function CreateComment(prop) {
  const [value, setValue] = useState("");
  const [expandMenu, setExpandMenu] = useState(false);
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
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What's up..."
          minLength={1}
          maxLength={1500}></textarea>
      </header>
      <button
        onClick={() => {
          if (!login) return loginWindow();
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
