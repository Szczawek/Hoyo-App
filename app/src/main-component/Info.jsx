import YouTube from "react-youtube";
import Account from "../account/Account";
import { useEffect, useRef, useState } from "react";

import DropGame from "./DropGame";
import { Navigate } from "react-router-dom";
export default function Info() {
  const [code, setCode] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  useEffect(() => {
    function printLetter(e) {
      e.preventDefault();
      console.log(e.clipboardData.getData("text"));
    }
    document.addEventListener("paste", printLetter);
    return () => document.removeEventListener("paste", printLetter);
  }, []);

  return (
    <div className="">
      <DropGame />
    </div>
  );
}
