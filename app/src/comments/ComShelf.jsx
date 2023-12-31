import { createContext, useEffect, useState } from "react";
import Comment from "./Comment";
export const LoadComments = createContext();

export default function ComShelf(props) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadComments();
  }, [props.id,props.status]);
  
  // Loading comments from server
  async function loadComments() {
    try {
      const response = await fetch(`http://localhost/comments${props.id}`);
      const obj = await response.json();
      setComments(obj.reverse());
    } catch (err) {
      throw Error(`${err}`);
    }
  }
  return (
    <div className="comments">
      {!comments.length ? (
        <p>There is nothing</p>
      ) : (
        <LoadComments.Provider value={{loadComments}}>
          <RenderComment comments={comments} />
        </LoadComments.Provider>
      )}
    </div>
  );
}

function RenderComment({ comments }) {
  return (
    <>
      {comments.map((e) => {
        return <Comment key={e["id"]} data={e} />;
      })}
    </>
  );
}
