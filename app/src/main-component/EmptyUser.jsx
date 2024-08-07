import { Navigate } from "react-router-dom";
import Account from "../account/Account";
export default function EmptyUser({ data }) {
  if (data["id"]) return <Navigate to={`/${data["hashName"]}`} />;
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="avatar big">
            <img src="/images/user.svg" alt="profile image" />
          </div>
          <div className="account_description">
            <h2>User</h2>
            <ul>
              <li>-</li>
              <li>-</li>
            </ul>
          </div>
        </header>
      </div>
      <Account />
    </section>
  );
}
