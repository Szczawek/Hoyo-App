import { createContext, useEffect, useState } from "react";
import RenderComments from "./RenderComments";
import useRenderComments from "./useRenderComments";
export const LoadComments = createContext();
export default function ComShelf(props) {
  const [comments, setComments] = useState([]);
  const testRender = useRenderComments();
  useEffect(() => {
    async function loadComments(type) {
      try {
        const response = await fetch(
          `http://localhost/comments?type=${type}&start=0&end=5`
        );
        const obj = await response.json();
        setComments(obj.reverse());
      } catch (err) {
        throw Error(`${err}`);
      }
    }
    loadComments(props.type);
  }, [props.status, props.type]);

  // Efficient updating of comments
  function updateComments(id) {
    const copy = [...comments];
    const index = copy.find((e) => e["id"] === id);
    copy.splice(index, 1);
    setComments(copy);
  }

  // ZAMIENIĆ useEffect na to 
  // function addCommet(obj) {
  //   setComments((prev) => [obj, ...prev]);
  // }

  if (!comments.length) return <p className="empty_table">There is nothing</p>;
  return (
    <div className="comments">
      <LoadComments.Provider value={{ updateComments }}>
        <RenderComments data={comments} />
      </LoadComments.Provider>
    </div>
  );
}
