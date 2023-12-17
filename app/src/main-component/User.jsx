import Login from "../account/Login";
import Menu from "../profile/Menu";

export default function User({ user, session,menu }) {
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="avatar">
            <img className="medium" src={user["avatar"]} alt="profile image" />
          </div>
          <div className="account_description">
            <h2>{user["nick"]}</h2>
          </div>
        </header>
        <div className="info"></div>
      </div>
      <div className="user_com">
        <p>empty table</p>
      </div>

      {menu && <Menu />}
      {!session && <Login uncloseable={true}></Login>}
    </section>
  );
}
