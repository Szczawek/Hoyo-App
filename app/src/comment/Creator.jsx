import { memo, useContext, useRef, useState } from "react";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import Account from "../account/Account";
import Window from "./Window";

const Creator = memo(function Creator({ addComment, reply, repliesFN }) {
  const [warning, setWarning] = useState(false);
  const [value, setValue] = useState("");
  const [validArea, setValidArea] = useState(false);
  const [loginWindow, setLoginWindow] = useState(false);
  const [expandMenu, setExpandMenu] = useState(false);
  const validation = useRef(null);
  const { id, nick, avatar, hashName } = useContext(UserContext)["userData"];
  const navigate = useNavigate();
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
      hashName,
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
      if (typeof repliesFN === "function") repliesFN("Add");
      setValue("");
    } catch (err) {
      throw Error(`Error wtih #CREATOR ${err}`);
    }
  }

  return (
    <div className="creator">
      <header className="intro">
        <div className="link">
          <Link to={id ? `/${hashName}` : "/empty-user"}>
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
            name="comment value"
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
          if (!id) return navigate("/empty-user");
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
      {loginWindow && <Account closeFn={closeLoginWindow} />}
    </div>
  );
});

export default Creator;
