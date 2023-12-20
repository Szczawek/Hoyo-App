import { useEffect, useState } from "react";
import User from "./User";

export default function NotFound({ loggedUserID }) {
  const [exist, setExist] = useState(false);
  const [userData, setUserData] = useState();
  useEffect(() => {
    searchUser();
  }, []);

  async function searchUser() {
    try {
      const response = await fetch("http://localhost/users");
      const obj = await response.json();
      const user = obj.find(
        (e) =>
          e["nick"].toLowerCase() == location.pathname.slice(1).toLowerCase()
      );
      const ans = !user ? false : true;
      setUserData(user);
      setExist(ans);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }

  if (!exist) return <p>nothing</p>;

  return <User session={true} user={userData} loggedUserID={loggedUserID} />;
}
