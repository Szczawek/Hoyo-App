import { useEffect, useState } from "react";
import User from "./User";

export default function NotFound() {
  const [exist, setExist] = useState(false);
  const [userData, setUserData] = useState({});
  const [userComments, setUserComments] = useState("");
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
      if (ans) downloadComments(user["id"]);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }

  async function downloadComments(userID) {
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: userID }),
    };

    try {
      const response = await fetch("http://localhost/user-comments", options);
      const obj = await response.json();
      setUserComments(obj);
    } catch (error) {
      throw Error(`Error with comments: ${error}`);
    }
  }
  if (!exist) return <p>nothing</p>;

  return <User session={true} user={userData} comments={userComments} />;
}
