import { useEffect, useState } from "react";
import User from "./User";
import { useParams } from "react-router-dom";

export default function NotFound() {
  const [exist, setExist] = useState(false);
  const [userData, setUserData] = useState();
  const url = useParams()

  useEffect(() => {
    searchUser();
  }, [url]);

  async function searchUser() {
    try {
      const response = await fetch(
        `http://localhost/users${location.pathname.slice(1)}`
      );
      if (!response.ok) return setExist(false);
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
