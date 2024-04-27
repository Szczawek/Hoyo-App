import { Link, useNavigate } from "react-router-dom";
import useLoadList from "./useLoadList";
import { useEffect, useRef, useState } from "react";

export default function List({ value, fn }) {
  const navigate = useNavigate();
  const list = useLoadList(value);
  const itemInList = useRef(null);
  const [currentItem, setCurrentItem] = useState(0);
// console.log(list.length)w
  useEffect(() => {
    function focusItem(e) {
      if (value === "") return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") e.preventDefault();
      switch (e.key) {
        case "ArrowDown":
          if (currentItem < list.length) setCurrentItem((prev) => prev + 1);
          break;
        case "ArrowUp":
          if (currentItem > 1) setCurrentItem((prev) => prev - 1);
          break;

        default:
          setCurrentItem(0);
      }
    }
    document.addEventListener("keydown", focusItem);
    if (itemInList.current) {
      itemInList.current.focus();
    }
    return () => {
      document.removeEventListener("keydown", focusItem);
    };
  }, [currentItem, list]);

  if (!list.length || value === "") return <p className="empty">Nothing</p>;
  return (
    <ul className="list">
      {list.map((data, index) => {
        return (
          <li key={index}>
            <Link
              className="users_list_link"
              ref={currentItem === index + 1 ? itemInList : null}
              onClick={() => fn()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fn();
                  navigate(`/${data["hashName"]}`);
                }
              }}
              to={`/${data["hashName"]}`}>
              <div className="avatar">
                <img src={data["avatar"]} alt="avatar" />
              </div>
              <div className="names">
                <p className="name">{data["nick"]}</p>
                <p className="hashName">@{data["hashName"]}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
