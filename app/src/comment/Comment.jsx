import { useContext, useState } from "react";
import { UserContext } from "../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import Like from "../comment/Like.jsx";
import ComMenu from "../comment/ComMenu.jsx";

export default function Comment({ data }) {
  const { id } = useContext(UserContext)["userData"];
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  function closeMenu() {
    setMenu(false);
  }

  return (
    <div
      className="comment"
      onClick={() => {
        navigate(`/replies/${data["id"]}`);
      }}>
      <header className="showcase">
        <div className="container" onClick={(e) => e.stopPropagation()}>
          <Link to={`/${data["nick"]}`}>
            <div className="info">
              <div className="avatar">
                <img src={data["avatar"]} alt="avatar" />
              </div>
              <div>
                <h3 className="nick">{data["nick"]}</h3>
                <p className="date">
                  {data["date"] ? data["date"].split("T")[0] : null}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="menu-container" onClick={(e) => e.stopPropagation()}>
          <button
            tabIndex={0}
            className="menu-btn"
            onClick={() => setMenu(true)}>
            <img src="/images/threedots.svg" alt="open menu" />
          </button>
          {menu && (
            <ComMenu
              closeMenu={closeMenu}
              authorization={id === data["ownerID"]}
              commentID={data["id"]}
            />
          )}
        </div>
      </header>
      <p className="content">{data["content"]}</p>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <Like comID={data["id"]} comLikes={data["likes"]} />
        <div className="com">
          <div className="svg-parent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-4q-37-8-67.5-27.5T600-720H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h404q-4 20-4 40t4 40H160v525l46-45h594v-324q23-5 43-13.5t37-22.5v360q0 33-23.5 56.5T800-240H240L80-80Zm80-720v480-480Zm600 80q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
            </svg>
          </div>
          <p className="num">{data["replies"]}</p>
        </div>
        <div className="share">
          <div className="svg-parent">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-640q17 0 28.5-11.5T760-760q0-17-11.5-28.5T720-800q-17 0-28.5 11.5T680-760q0 17 11.5 28.5T720-720ZM240-440q17 0 28.5-11.5T280-480q0-17-11.5-28.5T240-520q-17 0-28.5 11.5T200-480q0 17 11.5 28.5T240-440Zm480 280q17 0 28.5-11.5T760-200q0-17-11.5-28.5T720-240q-17 0-28.5 11.5T680-200q0 17 11.5 28.5T720-160Zm0-600ZM240-480Zm480 280Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
