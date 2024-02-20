import { useContext } from "react";
import { CommentFn } from "./Shelf";
export default function DeleteComment({ id, closeMenu }) {
  const deleteComment = useContext(CommentFn);
  async function sendDeleteReq() {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    };
    try {
      const response = await fetch("http://localhost/remove-comment", options);
      if (!response.ok) return alert("Error");
      deleteComment(id);
      closeMenu();
    } catch (err) {
      throw Error(`There was an error while deleting a comment: ${err}`);
    }
  }

  return (
    <li>
      <button className="trash" onClick={() => sendDeleteReq()}>
        <img src="/images/remove.svg" alt="remove comment" />
        delete comment
      </button>
    </li>
  );
}
