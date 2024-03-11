import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function useSearchUser(data) {
  const [accountUser, setAccountUser] = useState([]);
  const url = useParams();
  useEffect(() => {
    load();
  }, [url["nick"], data]);

  async function load() {
    try {
      const response = await fetch(`https://localhost:443/users${url["nick"]}`);
      if (!response.ok)
        return console.error(`Error with users load: ${response.status}`);
      const data = (await response.json())[0];
      if (!data) return setAccountUser(null);
      if (!data["avatar"]) data["avatar"] = "/images/user.svg";
      setAccountUser(data);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }
  return accountUser;
}
