import Login from "../account/Login";
import Menu from "../profile/Menu";
import Comment from "../news-comments/Comment";
import { useContext } from "react";
import { UserContext } from "../App";

export default function User({ session, user, refreshCom }) {
  const loggedUser = useContext(UserContext);

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
        {!user["comments"] ? (
          <p>empty table</p>
        ) : (
          user["comments"].map((e) => {
            return <Comment key={e["id"]} comData={e} refreshCom={refreshCom}/>;
          })
        )}
      </div>
      {user["id"] === loggedUser["id"] && <Menu />}
      {!session && <Login uncloseable={true}></Login>}
    </section>
  );
}
