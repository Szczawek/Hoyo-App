import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const options = {
    method: "POST",
    credentials: "include",
  };

  // Logout from account
  async function logout() {
    try {
      await fetch("http://localhost/logout", options);
      navigate("/");
      window.location.reload();
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }

  // Delete account
  async function deleteAccount() {
    try {
      await fetch("http://localhost/remove", options);
      navigate("/")
      window.location.reload();
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }

  return (
    <div className="menu">
      {openMenu ? (
        <ul className="menu_list">
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
          <li>Edit profile</li>
          <li>
            <button onClick={() => deleteAccount()}>Delete Account</button>
          </li>
        </ul>
      ) : (
        <button onClick={() => setOpenMenu(true)} className="open_menu_btn">
          <img src="images/settings.svg" alt="" />
        </button>
      )}
    </div>
  );
}
