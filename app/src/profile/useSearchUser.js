import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useSearchUser() {
  const [userExist, setUserExist] = useState();
  const [accountUser, setAccountUser] = useState();
  const url = useParams();
  useEffect(() => {
    load();
  }, [url]);
  async function load() {
    try {
      const response = await fetch(`http://localhost/users${url["nick"]}`);
      if (!response.ok) return setUserExist(false);
      const data = await response.json();
      setUserExist(true);
      if (data["avatar"]) {
        const reader = new FileReader();
        reader.readAsDataURL(
          new Blob([new Uint8Array(data["avatar"]["data"])], {
            type: "image/jpeg",
          })
        );
        reader.onload = () => {
          setAccountUser({ ...data, avatar: reader.result });
          return;
        };
      }
      setAccountUser({ ...data, avatar: "/images/user.svg" });
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }
  return { userExist: userExist, accountUser: accountUser };
}
