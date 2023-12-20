import { Navigate } from "react-router-dom";
import Login from "../account/Login";
export default function EmptyUser({ session }) {
  if (session) return <Navigate to="/Szczawik" />;
  return (
    <section className="user">
      <div className="bg-img">
        <header className="profile">
          <div className="avatar big">
            <img src="images/user.svg" alt="profile image" />
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
      <p>Empty table...</p>
      <Login />
    </section>
  );
}
