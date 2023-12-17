import { useState } from "react";

export default function AddComment({
  openLoginWindow,
  user,
  login,
  loadComments,
}) {
  const [value, setValue] = useState("");
  const [window, setWindow] = useState(false);

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

  function confirmComment() {
    if (!login) {
      openLoginWindow(true);
      return;
    }
    setWindow(true);
  }
  return (
    <>
      {window && (
        <div className="com_window">
          <div className="container">
            <button
              className="add_com"
              onClick={() => {
                addComment();
                setWindow(false);
              }}>
              Add Comment <img src="images/check.svg" alt="add-comment" />
            </button>
            <button className="close_win" onClick={() => setWindow(false)}>
              Cancel <img src="images/close.svg" alt="cancel comment" />
            </button>
          </div>
        </div>
      )}

      <header className="com_creator">
        <div className="container">
          <div className="profile_img avatar">
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
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmComment();
          }}
          placeholder="Put your comment..."
          maxLength={1500}></textarea>
        <button className="add_comment" onClick={() => confirmComment()}>
          Add comment
        </button>
      </header>
    </>
  );
}
