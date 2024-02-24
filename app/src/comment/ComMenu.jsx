import { useEffect, useRef } from "react";
import DeleteComment from "./DeleteComment";
export default function ComMenu(prop) {
  const ul = useRef(null);
  const { closeMenu, authorization, commentID } = prop;

  useEffect(() => {
    ul.current.focus();
  }, []);

  return (
    <ul
      ref={ul}
      tabIndex={0}
      onBlur={(e) => {
        if (!ul.current.contains(e.relatedTarget)) closeMenu();
      }}
      className="comment_menu">
      <li>Shere</li>
      {authorization && <DeleteComment id={commentID} closeMenu={closeMenu} />}
    </ul>
  );
}
