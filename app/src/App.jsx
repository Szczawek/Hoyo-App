import { createContext, lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./main-component/Home"));
const Header = lazy(() => import("./main-component/Header"));
const Info = lazy(() => import("./main-component/Info"));
const News = lazy(() => import("./main-component/News"));
const EmptyUser = lazy(() => import("./main-component/EmptyUser"));
const User = lazy(() => import("./main-component/User"));
const Replies = lazy(() => import("./main-component/Replies"));
const Settings = lazy(() => import("./main-component/Settings"));
const NotFound = lazy(() => import("./main-component/NotFound"));
const Account = lazy(() => import("./account/Account"));
const Empty = lazy(() => import("./main-component/Empty"));
import LoginAccount from "./account/LoginAccount";
import ConfirmEmail from "./account/ConfirmEmail";
import CreateAccount from "./account/CreateAccount";
import NotFoundAcc from "./account/NotFoundAcc";
export const UserContext = createContext();
const std = {
  nick: "User",
  avatar: "/images/user.svg",
  likes: [],
};
export default function App() {
  // to change in the future
  const [confrimCodePath, setConfirmCodePath] = useState(true);
  const [userData, setUserData] = useState(std);

  useEffect(() => {
    verifyLogged();
  }, []);

  // Check if the user is logged in
  async function verifyLogged() {
    try {
      const response = await fetch("https://localhost:443/logged", {
        credentials: "include",
      });
      if (!response.ok) return setUserData(std);
      const obj = await response.json();
      if (!obj["avatar"]) obj["avatar"] = "/images/user.svg";
      setUserData(obj);
    } catch (err) {
      throw Error(
        `An attempt to check whether the user is logged in failed: ${err}`
      );
    }
  }

  // After editing the profile data, it updates the user data without unnecessarily downloading the data from the db again
  function updateUserData(e) {
    const copy = { ...userData };
    setUserData((prev) => ({ ...prev, ...e }));
  }

  // It does the same thing as the "updateUserData" function, but with likes
  function updateLikes(boolean, id) {
    const { likes } = userData;
    const copy = [...likes];

    if (boolean) {
      const index = copy.findIndex((e) => e === id);
      copy.splice(index, 1);
    } else {
      copy.push(id);
    }
    setUserData((prev) => ({ ...prev, likes: copy }));
  }

  // update followers
  function updateFollowers(id) {
    const { following } = userData;
    const index = following.findIndex((e) => e === id);
    const copy = [...following];
    if (index !== -1) {
      copy.splice(index, 1);
    } else {
      copy.push(id);
    }
    setUserData((prev) => ({
      ...prev,
      following: copy,
    }));
  }

  function protectPath() {
    setConfirmCodePath((prev) => !prev);
  }
  return (
    <>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <UserContext.Provider
          value={{
            userData,
            updateUserData,
            updateLikes,
            updateFollowers,
            verifyLogged,
          }}>
          <Routes>
            <Route path="/" element={<Header user={userData} />}>
              <Route path="/" element={<Empty />} />
              <Route path="home" element={<Home session={userData["id"]} />} />
              <Route path="news" element={<News />} />
              <Route path="info" element={<Info />} />
              <Route path="empty-user/" element={<EmptyUser data={userData} />}>
                <Route index element={<LoginAccount />} />
                <Route
                  path="create-account"
                  element={<CreateAccount openConfrimGate={protectPath} />}
                />
                {confrimCodePath && (
                  <Route
                    path="confirm-email"
                    closeConfirmGate={protectPath}
                    element={<ConfirmEmail />}
                  />
                )}
                <Route path="*" element={<NotFoundAcc />} />
              </Route>
              <Route path="settings" element={<Settings />} />
              <Route path=":nick//*" element={<User data={userData} />}></Route>
              <Route path="replies/:id" element={<Replies />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </UserContext.Provider>
      </Suspense>
    </>
  );
}
