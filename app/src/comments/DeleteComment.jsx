import { useContext } from "react";
import { ComSettings } from "./ComShelf";
export default function DeleteComment({ id, closeMenu }) {
  const performanceFn = useContext(ComSettings);
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
      performanceFn(id);
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
