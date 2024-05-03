import { useMemo, useState } from "react";
import Comment from "../comment/Comment";
import Shelf from "../comment/Shelf";
import useFetchComment from "../comment/useFetchComment";
import { Navigate, useParams } from "react-router-dom";
export default function Replies() {
  const url = useParams();
  const [count, setCount] = useState(true);
  const master = useFetchComment(url["id"], count);
  if (!master) return <Navigate to={"/news"} />;

  // To change
  function changeRepliesNO(type) {
    setCount((prev) => !prev);
    // switch (type) {
    //   case "Add":
    //     console.log("Add");
    //     setCount((prev) => prev + 1);
    //     break;
    //   case "Delete":
    //     console.log("delete");
    //     setCount((prev) => prev - 1);
    //     break;
    // }
  }
  return (
    <div className="replies">
      {Array.isArray(master) ? (
        <p className="dynamic-title">loading...</p>
      ) : (
        <Comment key={master["date"]} replies={count} data={master} />
      )}
      <Shelf
        creator={true}
        type="reply"
        repliesFN={changeRepliesNO}
        reply={url["id"]}
      />
    </div>
  );
}
