import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Menu({ closeMenu }) {
  const [currentItem, setCurrentItem] = useState(0);
  const itemInList = useRef(null);
  const menu = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function focusItem(e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (e.key === "ArrowDown" && currentItem < 2)
          return setCurrentItem((prev) => prev + 1);

        if (e.key === "ArrowUp" && currentItem > 0)
          setCurrentItem((prev) => prev - 1);
      }
    }
    document.addEventListener("keydown", focusItem);

    if (itemInList.current) {
      itemInList.current.focus();
    }
    return () => {
      document.removeEventListener("keydown", focusItem);
    };
  }, [currentItem]);

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
    <div className="menu">
      <ul
        tabIndex={0}
        onBlur={(e) => {
          if (!menu.current.contains(e.relatedTarget)) {
            closeMenu();
          }
        }}
        ref={menu}
        className="menu_list">
        <li>
          <button
            ref={currentItem === 0 ? itemInList : null}
            onClick={() => logout()}>
            Logout
          </button>
        </li>
        <li>
          <Link
            ref={currentItem === 1 ? itemInList : null}
            onClick={() => setOpenMenu(false)}
            to={"edit-profile"}>
            EditProfile
          </Link>
        </li>
        <li>
          <Link ref={currentItem === 2 ? itemInList : null} to="settings">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
