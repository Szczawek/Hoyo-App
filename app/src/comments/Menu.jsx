import { useContext, useEffect, useRef } from "react";
import { LoadComments } from "./ComShelf";
export default function Menu(prop) {
  const loadComments = useContext(LoadComments);
  const ul = useRef(null);
  const { fn, loggedUserID, commentID, commentUserID } = prop;

  useEffect(() => {
    ul.current.focus();
  }, []);
  return (
    <ul
      ref={ul}
      tabIndex={0}
      onBlur={(e) => {
        if (!ul.current.contains(e.relatedTarget)) fn();
      }}
      className="menu">
      <li>Check</li>
      {loggedUserID === commentUserID && (
        <li>
          <button
            className="trash"
            onClick={() => {
              deleteComment(commentID).then(() =>
                loadComments["loadComments"]()
              );
            }}>
            <img src="/images/remove.svg" alt="remove comment" />
            delete comment
          </button>
        </li>
      )}
    </ul>
  );
}

async function deleteComment(id) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  };
  try {
    const response = await fetch("http://localhost/remove-comment", options);
    if (response.ok) {
      alert("Removing comment");
    }
  } catch (err) {
    throw Error(`There was an error while deleting a comment: ${err}`);
  }
}
