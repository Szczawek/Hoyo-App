import { memo, useContext, useRef, useState } from "react";
import Window from "./Window";
import Login from "../account/Login";
import { UserContext } from "../App";
import addComment from "./addComment";
import { Link } from "react-router-dom";
const CreateComment = memo(function CreateComment({ addCommentVS }) {
  const [loginWindow, setLoginWindow] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const [validArea, setValidArea] = useState(false);
  const validation = useRef(null);
  const [value, setValue] = useState("");
  const { avatar, nick, id } = useContext(UserContext)["userData"];

  function setWindow() {
    setExpandMenu((prev) => !prev);
  }

  function closeLoginWindow() {
    setLoginWindow(false);
  }

  function sendCom() {
    addComment({nick,value,avatar}).then((e) => {
      if (typeof e !== "object") return alert("Error");
      setValue("");
      setWindow();
      addCommentVS(e);
    });
  }

  return (
    <>
      <div className="com_creator">
        <header className="intro">
          <Link to={id ? `/${nick}` : "/empty-user"}>
            <div className="avatar">
              <img src={avatar} alt="avatar" />
            </div>
          </Link>
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
        {expandMenu && <Window closeWindow={setWindow} sendCom={sendCom} />}
      </div>
      {loginWindow && <Login closeFn={closeLoginWindow} />}
    </>
  );
});

export default CreateComment;
