import { useEffect, useState } from "react";
import Login from "../account/Login";
import ComShelf from "../comments/ComShelf";
// import CreateComment from "../news-comments/ss";
import CreateComment from "../comments/CreateComment.jsx";
export default function News({ user, login }) {
  const [loginWindow, setLoginWindow] = useState(false);
  const [loadData, setLoadData] = useState(true);

  function closeLoginWindow() {
    setLoginWindow(false);
  }

  function openLoginWindow() {
    setLoginWindow(true);
  }

  function statusData() {
    setLoadData(prev => !prev)
  }

  return (
    <section className="news">
      {loginWindow && <Login closeFn={closeLoginWindow} />}
      <CreateComment
      loadData={statusData}
        avatar={user["avatar"]}
        nick={user["nick"]}
        loginWindow={openLoginWindow}
        login={login}
      />
      <ComShelf id={0} status={loadData}/>
    </section>
  );
}
