import {
  createContext,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RenderComments from "./RenderComments";
import CreateComment from "./CreateComment";
export const ComSettings = createContext();

const ComShelf = memo(function ComShelf(props) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const element = useRef(null);

  //Set the observer to the last item and wait to see it.
  const defaultSettings = useMemo(() => {
    setComments([]);
    setPage(0);
    setLoading(true);
  }, [props.type]);

  useEffect(() => {
    const observer = new IntersectionObserver(spy);
    if (observer && element.current) {
      observer.observe(element.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [page]);

  function spy(e) {
    if (e[0].isIntersecting && loading) {
      loadComments();
    }
  }

  // Loading comments from database
  async function loadComments() {
    try {
      const response = await fetch(
        `http://localhost/comments?type=${props.type}&page=${page}`
      );
      if (!response.ok) return;
      const obj = await response.json();
      if (obj["comments_number"] === comments.length) setLoading(false);
      setPage((prev) => prev + 10);
      setComments((prev) => [...prev, ...obj["com"]]);
    } catch (err) {
      throw Error(`Error with donwload comments: ${err}`);
    }
  }
  // Version efficace
  const addCommentVS = useCallback((e) => {
    setComments((prev) => [e, ...prev]);
    setPage((prev) => prev + 1);
  }, []);

  // Version efficace
  function deleteComment(id) {
    const index = comments.findIndex((e) => e["id"] === id);
    setComments((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  return (
    <>
      {props.type === 0 && <CreateComment addCommentVS={addCommentVS} />}
      <ComSettings.Provider value={deleteComment}>
        <RenderComments data={comments} />
      </ComSettings.Provider>
      {loading && <p ref={element}>Loading...</p>}
      {!loading && !comments.length ? (
        <p className="empty_table">There is nothing</p>
      ) : null}
    </>
  );
});

export default ComShelf;
