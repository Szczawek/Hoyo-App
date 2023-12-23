import { useState } from "react";

export default function CreateComment({
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
      openLoginWindow();
      return;
    }
    setWindow(true);
  }
  return (
    <>
      {window && (
        <div className="window">
          <div className="sub_window">
            <button
              className="confirme_comment"
              onClick={() => {
                addComment();
                setWindow(false);
              }}>
              Add Comment <img src="images/check.svg" alt="create comment" />
            </button>
            <button className="cancel_comment" onClick={() => setWindow(false)}>
              Cancel <img src="images/close.svg" alt="cancel comment" />
            </button>
          </div>
        </div>
      )}

      <header className="create_comment">
        <div className="avatar medium">
          <img src={user["avatar"]} alt="profile img" />
        </div>
        <textarea
          className="content"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmComment();
          }}
          placeholder="What's up..."
          maxLength={1500}></textarea>
        <button className="open_window" onClick={() => confirmComment()}>
          Add comment
        </button>
      </header>
    </>
  );
}
