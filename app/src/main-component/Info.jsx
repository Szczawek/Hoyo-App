  import YouTube from "react-youtube";
  import Account from "../account/Account";
  import { useEffect, useState } from "react";

  import DropGame from "./DropGame";
  import { Navigate } from "react-router-dom";
  export default function Info() {
    useEffect(() => {
      function printLetter(e) {
        e.preventDefault();
        console.log(e.clipboardData.getData("text"));
      }
      document.addEventListener("paste", printLetter);
      return () => document.removeEventListener("paste", printLetter);
    }, []);
    return (
      <div contentEditable className="info">
        <DropGame />
        <div style={{width:"400px",aspectRatio:"1/1",backgroundColor:"red"}} className=""></div>
      </div>
    );
  }
