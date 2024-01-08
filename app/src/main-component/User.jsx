import { useEffect, useState } from "react";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

export default function User({ nick }) {
  const [exist, setExist] = useState(false);
  const [userData, setUserData] = useState();
  const url = useParams();

  useEffect(() => {
    searchUser();
  }, [url["nick"]]);
  async function searchUser() {
    try {
      const response = await fetch(`http://localhost/users${url["nick"]}`);
      if (!response.ok) return setExist(false);
      const obj = await response.json();
      setExist(true);
      setUserData(obj);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }
  if (!exist) return <p>nothing</p>;

  return (
    <>
      {nick === userData["nick"] && <Outlet />}
      <Profile session={true} user={userData} refreshCom={searchUser} />;
    </>
  );
}
