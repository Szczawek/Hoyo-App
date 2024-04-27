import { useMemo, useState } from "react";
import Comment from "../comment/Comment";
import Shelf from "../comment/Shelf";
import useFetchComment from "../comment/useFetchComment";
import { Navigate, useParams } from "react-router-dom";
export default function Replies() {
  const url = useParams();
  const master = useFetchComment(url["id"]);
  const [count,setCount] = useState(0)
  if (!master) return <Navigate to={"/news"} />;
  
  const num = useMemo(() => {
    return master["replies"];
  }, [master]);
  
  function changeRepliesNO(type) {
    switch (type) {
      case "Add":
        console.log("Add");
        setCount(prev => prev + 1)
        break;
      case "Delete":
        console.log("delete");
        setCount(prev => prev -1)
        break;
    }
  }
  console.log(count,"check  ")
  // console.log(num)
  return (
    <div className="replies">
      {Array.isArray(master) ? (
        <p className="dynamic-title">loading...</p>
      ) : (
        <Comment key={master["date"]} replies={num} data={master} />
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
