import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Menu() {
  const [openMenu, setOpenMenu] = useState(false);
  const menu = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    if (menu.current) menu.current.focus();
  }, [openMenu]);

  const options = {
    method: "POST",
    credentials: "include",
  };

  // Logout from account
  async function logout() {
    try {
      const res = await fetch("http://localhost/logout", options);
      if (!res.ok) return;
      navigate("/");
      window.location.reload();
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }



  return (
    <div className="menu">
      {openMenu ? (
        <ul
          ref={menu}
          tabIndex={0}
          className="menu_list"
          onBlur={(e) => {
            if (e.target.contains(e.relatedTarget)) return;
            setOpenMenu(false);
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
            <Link to="/settings">Settings</Link>
          </li>
     
        </ul>
      ) : (
        <button onClick={() => setOpenMenu(true)} className="open_menu_btn">
          <img src="/images/settings.svg" alt="" />
        </button>
      )}
    </div>
  );
}
