import Menu from "../profile/Menu";
import { useContext } from "react";
import { UserContext } from "../App";
export default function Profile({ user }) {
  const { id } = useContext(UserContext)["userData"];
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="container">
            <div className="avatar big">
              <img src={user["avatar"]} alt="profile image" />
            </div>
            {user["id"] === id && <Menu />}
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
