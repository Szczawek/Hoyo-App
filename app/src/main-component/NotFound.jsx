import { useEffect, useState } from "react";
import User from "./User";

export default function NotFound( ) {
  const [exist, setExist] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    searchUser();
  }, []);

  async function searchUser() {
    try {
      const response = await fetch(
        `http://localhost/users${location.pathname.slice(1)}`
      );
      if (!response.ok) return;
      const obj = await response.json();
      setExist(true);
      setUserData(obj);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }

  if (!exist) return <p>nothing</p>;

  return <User session={true} user={userData} refreshCom={searchUser} />;
}
