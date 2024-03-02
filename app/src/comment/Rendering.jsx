import Comment from "./Comment";
export default function Rendering({ comments, loading }) {
  if (!comments[0] && !loading)
    return <p className="dynamic-title">There is no comments</p>;

  return (
    <>
      {comments.map((e) => {
        return <Comment key={e["date"]} data={e} />;
      })}
    </>
  );
}
