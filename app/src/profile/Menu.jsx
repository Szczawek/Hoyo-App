import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Menu({ closeMenu }) {
  const menu = useRef(null);
  const navigate = useNavigate();

  // Logout from account
  async function logout() {
    try {
      const res = await fetch("http://localhost/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return;
      navigate("/");
      window.location.reload();
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }
  return (
    <>
      <div className="menu">
        <ul
          className="menu_list"
          ref={menu}
          onBlur={(e) => {
            if (menu.current.contains(e.relatedTarget)) return;
            closeMenu();
          }}>
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
          <li>
            <Link onClick={() => setOpenMenu(false)} to={"edit-profile"}>
              EditProfile
            </Link>
          </li>
          <li>
            <Link to="settings">Settings</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
