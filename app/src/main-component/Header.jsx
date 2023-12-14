import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
export default function Header({ user }) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <header className="navigation_case">
        <button onClick={() => setOpenMenu(true)} className="hamburger_btn">
          <img src="images/hamburger.svg" alt="open menu btn" />
        </button>
        <nav className={!openMenu ? "navigation hamburger" : "navigation"}>
          <button className="mobile_only" onClick={() => setOpenMenu(false)}>
            <img src="images/close.svg" />
          </button>

          <label htmlFor="user_search">
            <input type="search" placeholder="Search..." id="user_search" />
          </label>

          <Link to="/">Home</Link>
          <Link to="info">Info</Link>
          <Link to="news">News</Link>
          <Link className="profile_link" to="user">
            <img
              className="medium "
              src={user["Avatar"]}
              alt="link to user profile"
            />
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}
