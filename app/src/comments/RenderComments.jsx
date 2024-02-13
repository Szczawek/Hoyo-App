import { memo } from "react";
import Comment from "./Comment";
const RenderComments = memo(function RenderComments({ data }) {
  return (
    <div className="comments">
      {data.map((e) => {
        return <Comment key={e["date"]} data={e} />;
      })}
    </div>
  );
});
export default RenderComments;
