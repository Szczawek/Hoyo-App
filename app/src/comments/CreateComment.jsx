import { useContext, useRef, useState } from "react";
import Window from "./Window";
import Login from "../account/Login";
import { UserContext } from "../App";
export default function CreateComment(prop) {
  const [loginWindow, setLoginWindow] = useState(false);
  const [value, setValue] = useState("");
  const [expandMenu, setExpandMenu] = useState(false);
  const [validArea, setValidArea] = useState(false);
  const validation = useRef(null);
  const { avatar, nick, id } = useContext(UserContext)["userData"];
  const { loadData, addComment } = prop;

  function setWindow() {
    setExpandMenu((prev) => !prev);
  }

  function closeLoginWindow() {
    setLoginWindow(false);
  }

  function clearValue() {
    setValue("");
  }

  return (
    <>
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
                setValidArea(false);
                setValue(e.target.value);
              }}
              placeholder="What's up..."
              minLength={1}
              required
              title="check"
              maxLength={1500}></textarea>
            {validArea && (
              <small className="rule">The comment cannot be empty!</small>
            )}
          </div>
        </header>
        <button
          onClick={() => {
            // In the standard settings, the ID does not exist, so if it does, it means that the user is logged in
            if (!id) return setLoginWindow(true);
            if (!validation.current.checkValidity()) return setValidArea(true);
            setWindow();
          }}
          className="confirm">
          Add Comment
        </button>
        {expandMenu && (
          <Window
            cl={clearValue}
            nick={nick}
            avatar={avatar}
            content={value}
            loadData={loadData}
            closeWindow={setWindow}
            addComment={addComment}
          />
        )}
      </div>
      {loginWindow && <Login closeFn={closeLoginWindow} />}
    </>
  );
}
