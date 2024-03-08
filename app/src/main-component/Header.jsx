import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import SearchBar from "../header-component/SearchBar";

export default function Header({ user }) {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <header className="navigation_case">
        <button onClick={() => setOpenMenu(true)} className="hamburger_btn">
          <img src="/images/hamburger.svg" alt="open menu btn" />
        </button>
        <nav className={!openMenu ? "navigation hamburger" : "navigation"}>
          <div className="mobile_only">
            <button onClick={() => setOpenMenu(false)}>
              <img src="/images/close.svg" className="medium" />
            </button>
          </div>
          <SearchBar />
          <ul className="links">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="info">Info</NavLink>
            </li>
            <li>
              <NavLink to="news">News</NavLink>
            </li>
            <li className="profil_link">
              <NavLink className="avatar medium" to="empty-user">
                <img src={user["avatar"]} alt="link to user profile" />
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
