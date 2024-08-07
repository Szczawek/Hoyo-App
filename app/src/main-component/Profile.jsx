import Menu from "../profile/Menu";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { NavLink } from "react-router-dom";
import Follow from "../profile/Follow";
import addFollow from "../profile/addFollow";

const Profile = memo(function Profile({ user }) {
  const [message, setMessage] = useState();
  const [menu, setMenu] = useState(false);
  const { userData, updateFollowers } = useContext(UserContext);
  const { id, following } = userData;
  const [accountFollowed, setAccountFollowed] = useState(false);
  const btn = useRef(null);
  useEffect(() => {
    if (id) {
      const followed = following.find((e) => e === user["id"]);
      setAccountFollowed(followed);
    }
  }, [following, message]);

  // close/open manu
  function menuDoor() {
    setMenu((prev) => !prev);
  }

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
      <div className="bg-img"></div>
      <header className="profile">
        <div className="baner">
          <img src={user["baner"]} className="baner-img" alt="baner" />
          <div className="container">
            <div className="avatar big">
              <img src={user["avatar"]} alt="profile image" />
            </div>
            {user["id"] !== id ? (
              <div className="follow_container">
                <button
                  disabled={id ? false : true}
                  ref={btn}
                  onClick={() =>
                    addFollow(id, user["id"]).then((e) => {
                      slowDownBtn(e);
                      updateFollowers(user["id"]);
                    })
                  }>
                  {accountFollowed ? "followed" : "follow"}
                </button>
                <div className="message">
                  {message ? (
                    <small>Add follow</small>
                  ) : message !== undefined ? (
                    <small>Delete follow</small>
                  ) : null}
                </div>
              </div>
            ) : !menu ? (
              <button
                tabIndex={0}
                onClick={() => menuDoor()}
                className="open_menu_btn">
                <img src="/images/settings.svg" alt="Open Settings" />
              </button>
            ) : (
              <Menu closeMenu={menuDoor} />
            )}
          </div>
        </div>
        <div className="account_description">
          <h2 className="nick">{user["nick"]}</h2>
          <small>@{user["hashName"]}</small>
          <p className="about">{user["about"]}</p>
        </div>
        <Follow followers={user["followers"]} following={user["following"]} />
        <ul className="profile_tabs">
          <li>
            <NavLink to={""} end>
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink to={"likes"}>Likes</NavLink>
          </li>
          <li>
            <NavLink to={"owner-replies"}>Replies</NavLink>
          </li>
        </ul>
      </header>
    </section>
  );
});

export default Profile;
