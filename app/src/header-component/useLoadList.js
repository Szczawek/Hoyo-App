import { useEffect, useState } from "react";

export default function useLoadList(value) {
  const [obj, setObj] = useState([]);
  useEffect(() => {
    async function loadUserList() {
      try {
        const res = await fetch("http://localhost/account-list");
        if (!res.ok) console.error(res.status);
        const obj = await res.json();
        setObj(obj);
      } catch (err) {
        throw err;
      }
    }

    loadUserList();
  }, []);
  return obj.filter((e) =>
    e["nick"].toLowerCase().startsWith(value.toLowerCase())
  );
}
