import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./main-component/Home"));
const Header = lazy(() => import("./main-component/Header"));
const Info = lazy(() => import("./main-component/Info"));
const News = lazy(() => import("./main-component/News"));
const User = lazy(() => import("./main-component/User"));
const EmptyUser = lazy(() => import("./main-component/EmptyUser"));
const NotFound = lazy(() => import("./main-component/NotFound"));

export default function App() {
  const [session, setSession] = useState(false);
  const [userData, setUserData] = useState({
    nick: "User",
    avatar: "images/user.svg",
  });

  useEffect(() => {
    verifyLogged();
  }, []);

  // Check if the user is logged in
  async function verifyLogged() {
    try {
      const response = await fetch("http://localhost/logged", {
        credentials: "include",
      });
      if (!response.ok) return;

      setSession(true);
      const obj = await response.json();
      const loadUserDate = JSON.parse(obj);
      setUserData((prev) => ({
        ...prev,
        ...loadUserDate,
      }));
    } catch (err) {
      throw Error(
        `An attempt to check whether the user is logged in failed: ${err}`
      );
    }
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Header user={userData} />}>
            <Route path="/" element={<Home session={session} />} />
            <Route
              path="news"
              element={<News user={userData} login={session} />}
            />
            <Route path="info" element={<Info />} />
            <Route
              path="empty-user"
              element={
                <EmptyUser session={session} />
              }
            />
            <Route
              path="*"
              element={<NotFound loggedUserID={userData["id"]} />}
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
