import { memo } from "react";
import Comment from "./Comment";
const RenderComments = memo(function RenderComments({ data }) {
  return (
    <>
      {data.map((e) => {
        return <Comment key={e["date"]} data={e} />;
      })}
    </>
  );
});
export default RenderComments;
