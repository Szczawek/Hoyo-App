import Comment from "../comment/Comment";
import Shelf from "../comment/Shelf";
import useFetchComment from "../comment/useFetchComment";
import { Navigate, useParams } from "react-router-dom";
export default function Replies() {
  const url = useParams();
  const master = useFetchComment(url["id"]);
  if (!master) return <Navigate to={"/news"} />;

  return (
    <div className="replies">
      {Array.isArray(master) ? (
        <p className="dynamic-title">loading...</p>
      ) : (
        <Comment key={master["date"]} data={master} />
      )}
      <Shelf creator={true} type="reply" reply={url["id"]} />
    </div>
  );
}
