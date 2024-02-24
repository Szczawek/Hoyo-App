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
          {/* TO CHANGE */}
          {/* TO CHANGE */}
          {/* TO CHANGE */}
          {/* TO CHANGE */}
          <Link to={`/${data["nick"]}`}>
            <div className="info">
              <div className="avatar">
                <img src={data["avatar"]} alt="avatar" />
              </div>
              <div>
                <h3 className="nick">{data["nick"]}</h3>
                <p className="date">{data["date"]}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="menu-container" onClick={(e) => e.stopPropagation()}>
          <button tabIndex={0} className="menu-btn" onClick={() => setMenu(true)}>
            <img
              src="/images/threedots.svg"
              alt="open menu"
            />
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
        <button className="com">
          <img src="/images/comment.svg" alt="open replies" />
        </button>
      </div>
    </div>
  );
}
