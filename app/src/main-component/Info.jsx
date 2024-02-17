import React, { useState, useEffect, useCallback } from "react";
import RenderComments from "../comments/RenderComments";
let block = true;
export default function Info({ title = 0,...rest }) {
  console.log(rest)
  // const [comments, setComments] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [comLimit, setComLimit] = useState(0);
  // const [page, setPage] = useState(0);
  // useEffect(() => {
  //   return () => {
  //     setPage((prev) => prev + 5);
  //     setLoading(true);
  //     loadComments();
  //   };
  // }, []);
  // useEffect(() => {
  //   function handleScroll() {
  //     if (comments.length === comLimit && comLimit != 0) return;
  //     const fullHeight = document.documentElement.scrollHeight;
  //     const positionInWindow = document.documentElement.scrollTop;
  //     const windowHeight = window.innerHeight;
  //     // to    optimization
  //     if (
  //       positionInWindow + windowHeight === fullHeight &&
  //       comments.length <= comLimit
  //     ) {
  //       setLoading(true);
  //       setPage((prev) => prev + 5);
  //       loadComments();
  //       console.log("Download comments!");
  //     }
  //   }
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [page]);

  // async function loadComments() {
  //   try {
  //     const response = await fetch(
  //       `http://localhost/comments?type=${type}&page=${page}`
  //     );
  //     if (!response.ok) return;
  //     const obj = await response.json();
  //     setComLimit(obj["comments_number"]);
  //     setComments((prev) => [...prev, ...obj["com"]]);
  //   } catch (err) {
  //     throw Error(`Error with donwload comments: ${err}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  // return (
  //   <div className="info">
  //     <RenderComments data={comments} />
  //     {loading && <p>Loading...</p>}
  //   </div>
  // );

  return <p>Sssx</p>
}
