import { useEffect, useState } from "react";

export default function useLoadList(value) {
  const [obj, setObj] = useState([]);
  useEffect(() => {
    async function loadUserList() {
      try {
        const res = await fetch(`https://localhost:443/account-list`);
        if (!res.ok) return console.error(res.status);
        const obj = await res.json();
        setObj(obj);
      } catch (err) {
        throw err;
      }
    }

    loadUserList();
  }, []);

  function filterUsers(e) {
    const findNick = e["nick"].toLowerCase().includes(value.toLowerCase());
    const findHashName = e["hashName"]
      .toLowerCase()
      .includes(value.toLowerCase());
    if (findNick || findHashName) return true;
    return false;
  }
  
  return obj.filter(filterUsers).slice(0,5);
}
