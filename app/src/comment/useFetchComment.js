import { useEffect, useState } from "react";

export default function useFetchComment(id) {
  const [comment, setComment] = useState([]);
  useEffect(() => {
    async function loadMaster() {
      try {
        const response = await fetch("http://localhost/selected-comment", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        });
        if (!response.ok) return alert("Error");
        const obj = await response.json();
        setComment(obj[0]);
      } catch (err) {
        throw Error(`Error with replies: ${err}`);
      }
    }
    loadMaster();
  }, [id]);

  return comment;
}
