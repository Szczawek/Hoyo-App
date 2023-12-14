import { useState } from "react";

export default function AddComment({ openWindow, user, login, loadComments }) {
  const [value, setValue] = useState("");
  const [comentWindow, setCommentWindow] = useState(false);

  // Add comment to user account
  async function addComment() {
    const option = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content: value }),
    };
    try {
      const response = await fetch("http://localhost/add-comment", option);
      setValue("");
      loadComments();
    } catch (err) {
      throw Error(`Error with transfer to server: ${err}`);
    }
  }

  return (
    <>
      {comentWindow && (
        <div className="com_window">
          <div className="container">
            <button
              className="add_com"
              onClick={() => {
                addComment();
                setCommentWindow(false);
              }}>
              Add Comment
            </button>
            <button
              className="close_win"
              onClick={() => setCommentWindow(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <header className="com_creator">
        <div className="container">
          <div className="profile_img">
            <img
              className="medium"
              src={user["avatar"]}
              alt="Profile picture"
            />
          </div>
          <h2>{user["nick"]}</h2>
        </div>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          cols="50"
          rows="5"
          placeholder="Put your comment..."
          maxLength={1500}></textarea>
        <button
        className="add_comment"
          onClick={() => {
            if (!login) {
              openWindow(true);
              return;
            }
            setCommentWindow(true);
          }}>
          Add comment
        </button>
      </header>
    </>
  );
}
