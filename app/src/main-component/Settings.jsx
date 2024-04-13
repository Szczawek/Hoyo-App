import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useContext } from "react";

export default function Settings() {
  const { verifyLogged } = useContext(UserContext);
  const navigate = useNavigate();
  // Delete account
  async function deleteAccount() {
    try {
      const res = await fetch("https://localhost:443/delete-account", {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) return console.log(res.status);
      verifyLogged();
      navigate("/");
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }
  return (
    <div className="settings">
      <h2>Settings</h2>
      <ul>
        <li>
          <button onClick={() => deleteAccount()}>Delete Account</button>
        </li>
      </ul>
    </div>
  );
}
