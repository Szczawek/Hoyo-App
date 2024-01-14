import { createContext, lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./main-component/Home"));
const Header = lazy(() => import("./main-component/Header"));
const Info = lazy(() => import("./main-component/Info"));
const News = lazy(() => import("./main-component/News"));
const EmptyUser = lazy(() => import("./main-component/EmptyUser"));
const User = lazy(() => import("./main-component/User"));
const Settings = lazy(() => import("./main-component/Settings"));
const Replies = lazy(() => import("./main-component/Replies"));
const NotFound = lazy(() => import("./main-component/NotFound"));

export const UserContext = createContext();
export default function App() {
  const [session, setSession] = useState(false);
  const [userData, setUserData] = useState({
    nick: "User",
    avatar: "/images/user.svg",
    likes: [],
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
      const obj = await response.json();
      setSession(true);
      if (obj["avatar"]) {
        const reader = new FileReader();
        reader.readAsDataURL(
          new Blob([new Uint8Array(obj["avatar"]["data"])], {
            type: "image/jpeg",
          })
        );
        reader.onload = () => {
          setUserData({ ...obj, avatar: reader.result });
        };
        return;
      }
      delete obj["avatar"];
      setUserData((prev) => ({ ...prev, ...obj }));
    } catch (err) {
      throw Error(
        `An attempt to check whether the user is logged in failed: ${err}`
      );
    }
  }
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <UserContext.Provider value={{ userData, verifyLogged }}>
          <Routes>
            <Route path="/" element={<Header user={userData} />}>
              <Route index element={<Home session={session} />} />
              <Route path="news" element={<News />} />
              <Route path="info" element={<Info />}>
                <Route path="check" element={<Settings />} />
              </Route>
              <Route
                path="empty-user"
                element={
                  <EmptyUser session={session} userNick={userData["nick"]} />
                }
              />
              <Route path="replies" element={<Replies userData={userData} />} />
              {session && <Route path="settings" element={<Settings />} />}
              <Route path=":nick//*" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </Suspense>
    </>
  );
}
