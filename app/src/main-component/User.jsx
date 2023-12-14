import Login from "../account/Login";
import Menu from "../profile/Menu";

export default function User({ user, session }) {
  return (
    <section className="user">
      <header className="introduce_profile">
        <img className="avatar" src={user["avatar"]} alt="profile image" />
        <div className="account_description">
          <h2>{user["nick"]}</h2>
        </div>
      </header>
      <div className="user_content">
        <p>empty table</p>
      </div>

      <Menu />
      {!session && <Login uncloseable={true}></Login>}
    </section>
  );
}
