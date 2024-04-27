import { useContext } from "react";
import { CommentFn } from "./Shelf";
import { useNavigate } from "react-router-dom";
export default function DeleteComment({ id, closeMenu}) {
  const { deleteComment, repliesFN } = useContext(CommentFn);
  const navigate = useNavigate();
  async function sendDeleteReq() {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    };
    try {
      const response = await fetch(
        "https://localhost:443/remove-comment",
        options
      );
      if (!response.ok) return alert("Error");
      closeMenu();
      if (!deleteComment) return navigate(-1);

      deleteComment(id);
      repliesFN("Delete")
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
