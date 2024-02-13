import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useSearchUser() {
  const [accountUser, setAccountUser] = useState(null);
  const url = useParams();

  useEffect(() => {
    load();
  }, [url["nick"]]);

  async function load() {
    try {
      const response = await fetch(`http://localhost/users${url["nick"]}`);
      if (!response.ok) return;
      const data = await response.json();
      if (!data["avatar"]) data["avatar"] = "/images/user.svg";
      setAccountUser(data);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }
  return accountUser;
}
