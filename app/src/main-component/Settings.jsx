import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate()
  // Delete account
  async function deleteAccount() {
    try {
      await fetch("https://localhost:443/remove", {method:"POST",credentials:"include"});
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
