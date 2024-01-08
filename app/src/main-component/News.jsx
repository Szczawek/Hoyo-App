import { useState } from "react";

import ComShelf from "../comments/ComShelf";
import addComment from "../comments/addComment";

import CreateComment from "../comments/CreateComment.jsx";
export default function News({ login }) {
  const [loadData, setLoadData] = useState(true);

  function statusData() {
    setLoadData((prev) => !prev);
  }

  return (
    <section className="news">
      <CreateComment
        loadData={statusData}
        login={login}
        addComment={addComment}
      />
      <ComShelf id={0} status={loadData} />
    </section>
  );
}
