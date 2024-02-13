import { useEffect, useState } from "react";
let arrayLenght = 0;
export default function useRenderComments(type) {
  const [comments, setComments] = useState([]);
  const [postion, setPosition] = useState(0);
  useEffect(() => {
    async function loadComments() {
      try {
        const response = await fetch(
          `http://localhost/comments?type=${type}&start=${postion}&end=${
            postion + 5
          }`
        );
        const obj = await response.json();
        arrayLenght += obj.lenght;
        setComments(obj);
      } catch (err) {
        throw err;
      }
    }
    loadComments();
  }, [postion]);
  function handleLoad() {
    if ((arrayLenght >= postion && arrayLenght !== 0) || true) {
      const rect = document
        .querySelectorAll(".comment")
        [postion + 4].getBoundingClientRect();
      if (rect.y - 900 < 0) {
        setPosition((prev) => prev + 5);
      }
    }
  }

  useEffect(() => {
    document.addEventListener("scroll", handleLoad);
    return () => document.removeEventListener("scroll", handleLoad);
  }, [comments]);
  return comments;
}
