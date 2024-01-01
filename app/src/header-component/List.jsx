import { Link, useNavigate } from "react-router-dom";
import useLoadList from "./useLoadList";

export default function List({ value, fn }) {
  const navigate = useNavigate();
  const list = useLoadList(value);
  return (
    <ul className="list">
      {!list.length || value === "" ? (
        <li>Nothing</li>
      ) : (
        list.map((data, index) => {
          return (
            <li
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fn();
                  navigate(`/${data["nick"]}`);
                }
              }}
              tabIndex={0}
              key={index}>
              <Link onClick={fn} to={`/${data["nick"]}`} tabIndex={1}>
                {data["nick"]}
              </Link>
            </li>
          );
        })
      )}
    </ul>
  );
}
