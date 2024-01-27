import Menu from "../profile/Menu";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../App";
import follow from "../profile/follow";
export default function Profile({ user }) {
  const [message, setMessage] = useState();
  const { id } = useContext(UserContext)["userData"];
  const btn = useRef(null);
  
  // Anty spam button
  function slowDownBtn(e) {
    btn.current.disabled = true;
    setMessage(e["value"]);
    setTimeout(() => {
      setMessage();
      btn.current.disabled = false;
    }, 1000);
  }
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="container">
            <div className="avatar big">
              <img src={user["avatar"]} alt="profile image" />
            </div>
            {user["id"] ? (
              user["id"] === id ? (
                <Menu />
              ) : (
                <div className="follow_container">
                  <button
                    ref={btn}
                    onClick={() => follow(id, user["id"]).then(slowDownBtn)}>
                    Follow
                  </button>
                  {message != null ? (
                    message ? (
                      <small>Add follow</small>
                    ) : (
                      <small>Delete follow</small>
                    )
                  ) : null}
                </div>
              )
            ) : null}
          </div>
          <div className="account_description">
            <h2 className="nick">{user["nick"]}</h2>
            <p className="about">{user["about"]}</p>
          </div>
        </header>
      </div>
    </section>
  );
}
