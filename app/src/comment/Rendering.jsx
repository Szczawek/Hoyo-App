import Comment from "./Comment";
export default function Rendering({ comments }) {
  if (!comments[0]) return <p>There is no comments...</p>;

  return (
    <>
      {comments.map((e) => {
        return <Comment key={e["date"]} data={e} />;
      })}
    </>
  );
}
