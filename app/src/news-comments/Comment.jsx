export default function Comment({ comData, current }) {
  async function removeComment() {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: comData["id"] }),
    };
    try {
      const response = await fetch("http://localhost/remove-comment", options);
      if (response.ok) {
        alert("The comment was removed successfully.");
        window.location.reload();
      }
    } catch (error) {
      throw Error(`The server isn't responding: ${err}`);
    }
  }
  return (
    <div className="comment">
      <header>
        <div className="profile_img ">
          <img
            className="small"
            src={comData["avatar"]}
            alt="User profile picture"
          />
        </div>
        <div>
          <h3 className="nick">{comData["nick"]}</h3>
          <p className="date">{comData["date"]}</p>
        </div>
        {comData["userID"] == current && (
          <button onClick={() => removeComment()} className="remove_com">
            <img src="images/remove.svg" alt="close img button" />
          </button>
        )}
      </header>
      <p className="com_text">{comData["content"]}</p>
    </div>
  );
}
