import { useEffect, useState } from "react";
import Login from "../account/Login";
import Comment from "../news-comments/Comment";
import CreateComment from "../news-comments/CreateComment";

export default function News({ user, login }) {
  const [comments, setComments] = useState([]);
  const [loginWindow, setLoginloginWindow] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  // Load users comments
  async function loadComments() {
    try {
      const result = await fetch("http://localhost/comments");
      const obj = await result.json();
      const copy = obj.reverse();
      setComments(copy);
    } catch (err) {
      throw Error(`Error with comments :${err}`);
    }
  }

  // Login loginWindow
  function closeLoginWindow() {
    setLoginloginWindow(false);
  }
  
  function openLoginWindow() {
    setLoginloginWindow(true);
  }

  return (
    <section className="news">
      {loginWindow && <Login closeFn={closeLoginWindow} />}
      <CreateComment
        openLoginWindow={openLoginWindow}
        user={user}
        login={login}
        loadComments={loadComments}
      />
      <div className="comments">
        {!comments.length ? (
          <p>"No comments"</p>
        ) : (
          comments.map((e) => {
            return <Comment key={e["id"]} comData={e} loggedUserID={user["id"]} />;
          })
        )}
      </div>
    </section>
  );
}
