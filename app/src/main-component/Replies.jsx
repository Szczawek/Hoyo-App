import { useEffect, useState } from "react";
import Comment from "../comment/Comment";
import Shelf from "../comment/Shelf";
import { useParams } from "react-router-dom";
export default function Replies() {
  const url = useParams();
  const [master, setMaster] = useState([]);

  useEffect(() => {
    async function loadMaster() {
      try {
        const response = await fetch("http://localhost/selected-comment", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ id: url["id"] }),
        });
        if (!response.ok) return alert("Error");
        const obj = await response.json();
        setMaster(obj);
      } catch (err) {
        throw Error(`Error with replies: ${err}`);
      }
    }
    loadMaster();
  }, [url["id"]]);
  return (
    <div className="replies">
      <Comment key={master["date"]} data={master} />
      <Shelf creator={true} type="reply" reply={url["id"]} />
    </div>
  );
}
