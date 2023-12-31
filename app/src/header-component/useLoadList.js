import { useEffect, useState } from "react";

export default function useLoadList(value) {
  const [obj, setObj] = useState([]);
  useEffect(() => {
    fetch("http://localhost/users-list")
      .then((e) => e.json())
      .then((e) => setObj(e));
  }, []);
  return obj.filter((e) =>
    e["nick"].toLowerCase().startsWith(value.toLowerCase())
  );
}
