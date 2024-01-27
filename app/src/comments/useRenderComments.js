import { useEffect, useState } from "react";

export default function useRenderComments() {
  const [status, setStatus] = useState();
  useEffect(() => {
    document.addEventListener("scroll", handleLoad);
    return () => document.removeEventListener("scroll", handleLoad);
  }, []);
  function handleLoad() {
    const rect = document
      .querySelectorAll(".comment")[1]
      .getBoundingClientRect();
    if (200 < rect.y < 900) setStatus((prev) => !prev);
  }
  return status
}
