import { useEffect, useState } from "react";
import ComShelf from "../comments/ComShelf";
import Comment from "../comments/Comment";
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
      <ComShelf
        type={0}
        addSource={"add-replies"}
        source={"replies"}
        commentID={url["id"]}
      />
    </div>
  );
}
