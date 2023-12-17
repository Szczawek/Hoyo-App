import { useEffect, useState } from "react";
import Login from "../account/Login";
import Comment from "../news-comments/Comment";
import AddComment from "../news-comments/AddComment";

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
  function closeloginWindow() {
    setLoginloginWindow(false);
  }
  
  function openloginWindow() {
    setLoginloginWindow(true);
  }

  return (
    <section className="news">
      {loginWindow && <Login closeFn={closeloginWindow} />}
      <AddComment
        openloginWindow={openloginWindow}
        user={user}
        login={login}
        loadComments={loadComments}
      />
      <div className="comments">
        {!comments.length ? (
          <p>"No comments"</p>
        ) : (
          comments.map((e) => {
            return <Comment key={e["id"]} comData={e} current={user["id"]} />;
          })
        )}
      </div>
    </section>
  );
}
