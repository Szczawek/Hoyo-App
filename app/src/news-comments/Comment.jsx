import { useNavigate } from "react-router-dom";

export default function Comment({ comData, loggedUserID, downloadComments }) {
  const navigate = useNavigate();

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

  function searchUser(nick) {
    navigate(`/${nick}`);
  }

  async function like() {
    if (!loggedUserID) {
      alert("You can't give a like to a comment if you're not logged in!");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userID: loggedUserID,
        commentID: comData["id"],
      }),
    };
    try {
      await fetch("http://localhost/like", options);
      downloadComments()
    } catch (error) {
      throw Error(`Error wtih likes: ${error}}`);
    }
  }

  return (
    <div className="comment">
      <header>
        <div className="introduction">
          <button
            onClick={() => searchUser(comData["nick"])}
            className="avatar small">
            <img src={comData["avatar"]} alt="User profile picture" />
          </button>
          <div>
            <button onClick={() => searchUser(comData["nick"])}>
              <h3 className="nick">{comData["nick"]}</h3>
            </button>
            <p className="date">{comData["date"]}</p>
          </div>
        </div>
        {comData["userID"] == loggedUserID && (
          <button onClick={() => removeComment()} className="remove_com">
            <img src="images/remove.svg" alt="close img button" />
          </button>
        )}
      </header>
      <p className="com_text">{comData["content"]}</p>
      <button className="likes" onClick={() => like()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24">
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
        </svg>
        {comData["likes"]}
      </button>
    </div>
  );
}
