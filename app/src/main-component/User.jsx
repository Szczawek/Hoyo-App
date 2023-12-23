import Login from "../account/Login";
import Menu from "../profile/Menu";
import Comment from "../news-comments/Comment";
import { useEffect, useState } from "react";

export default function User({ user, session, loggedUserID }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (session) userComments();
  }, []);

  async function userComments() {

    try {
      const response = await fetch(
        `http://localhost/user-comments${user["id"]}`
      );
      const obj = await response.json();
      const mod = obj.map((e) => ({
        ...e,
        nick: user["nick"],
        avatar: user["avatar"],
      }));
      setComments(mod.reverse());
    } catch (error) {
      throw Error(`Can't download a comments: ${error}`);
    }
  }

  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="avatar big">
            <img src={user["avatar"]} alt="profile image" />
          </div>
          <div className="account_description">
            <h2>{user["nick"]}</h2>
            <p>{user["about"]}</p>
          </div>
        </header>
      </div>
      <div className="comments">
        {!comments ? (
          <p>empty table</p>
        ) : (
          comments.map((e) => {
            return (
              <Comment key={e["id"]} comData={e} loggedUserID={loggedUserID} downloadComments={userComments} />
            );
          })
        )}
      </div>
      {user["id"] === loggedUserID && <Menu />}
      {!session && <Login uncloseable={true}></Login>}
    </section>
  );
}
