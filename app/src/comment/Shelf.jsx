import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Creator from "./Creator";
import Rendering from "./Rendering";
import loadComments from "./loadComments";
export const CommentFn = createContext();
export default function Shelf(props) {
  const [comments, setComments] = useState([]);
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const loadingElemet = useRef(null);
  const { creator, reply, type, id } = props;

  const addComment = useCallback((comment) => {
    setComments((prev) => [comment, ...prev]);
    setPage((prev) => prev + 1);
  }, []);
  function deleteComment(id) {
    const copy = [...comments];
    const index = copy.findIndex((e) => (e["id"] = id));
    copy.splice(index, 1);
    setComments(copy);
  }

  const defaultSettings = useMemo(() => {
    setComments([]);
    setPage(0);
    setLoading(true);
  }, [reply, id]);

  useEffect(() => {
    const observer = new IntersectionObserver(spy);
    if (observer && loadingElemet.current) {
      observer.observe(loadingElemet.current);
    }
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [page]);
  async function spy(e) {
    if (e[0].isIntersecting) {
      try {
        const res = await loadComments(page, type, reply, id);
        setComments((prev) => {
          const com = [...prev, ...res["comments"]];

          if (res["limit"] <= com.length) setLoading(false);
          return com;
        });
        setPage((prev) => prev + 8);
      } catch (err) {
        setWarning(true);
        console.error(err);
      }
    }
  }

  if (warning) return <p>Error with comments</p>;
  return (
    <div className="shelf">
      {creator && <Creator addComment={addComment} reply={reply} />}
      <CommentFn.Provider value={deleteComment}>
        <Rendering loading={loading} comments={comments} />
      </CommentFn.Provider>
      {loading && <p className="dynamic-title" ref={loadingElemet}>Loading...</p>}
    </div>
  );
}
