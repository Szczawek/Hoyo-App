import { memo, useContext, useRef, useState } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import Login from "../account/Login";
import Window from "./Window";

const Creator = memo(function Creator({ addComment, reply }) {
  const [warning, setWarning] = useState(false);
  const [value, setValue] = useState("");
  const [validArea, setValidArea] = useState(false);
  const [loginWindow, setLoginWindow] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const validation = useRef(null);
  const { id, nick, avatar } = useContext(UserContext)["userData"];

  function setWindow() {
    setExpandMenu((prev) => !prev);
  }

  function closeLoginWindow() {
    setLoginWindow(false);
  }

  // Save comment in database
  async function createComment() {
    setWindow();
    const data = {
      ownerID: id,
      avatar,
      nick,
      content: value,
      reply,
    };
    try {
      const res = await fetch("https://localhost:443/create-comment", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) return setWarning(true);
      const comment = await res.json();
      addComment(comment);
      setValue("");
    } catch (err) {
      throw Error(`Error wtih #CREATOR ${err}`);
    }
  }

  return (
    <div className="creator">
      <header className="intro">
        <div className="link">
          <Link to={id ? `/${nick}` : "/empty-user"}>
            <div className="avatar">
              <img src={avatar} alt="avatar" />
            </div>
          </Link>
        </div>
        <div className="content">
          {warning && (
            <p className="creator-warning">Error durning adds a new comment</p>
          )}
          <textarea
            value={value}
            ref={validation}
            onChange={(e) => {
              setValidArea(false);
              setValue(e.target.value);
            }}
            placeholder="What's up..."
            minLength={1}
            required
            title="comment content"
            maxLength={1500}></textarea>
          {validArea && (
            <small className="rule">The comment cannot be empty!</small>
          )}
        </div>
      </header>
      <button
        onClick={() => {
          const regexp = /^\s*$/;
          const emptySpace = regexp.test(value);
          // In the standard settings, the ID does not exist, so if it does, it means that the user is logged in
          if (!id) return setLoginWindow(true);
          if (!validation.current.checkValidity() || emptySpace)
            return setValidArea(true);
          setWindow();
        }}
        className="confirm">
        Add Comment
      </button>
      {expandMenu && (
        <Window closeWindow={setWindow} addComment={createComment} />
      )}
      {loginWindow && <Login closeFn={closeLoginWindow} />}
    </div>
  );
});

export default Creator;
