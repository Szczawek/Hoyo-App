import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function NotFound() {
  // useEffect(() => {
  //   async function findUser() {
  //     const value = "test";
  //     try {
  //       const response = await fetch(`http://localhost/users/${value}`);
  //       console.log(response);
  //     } catch (error) {
  //       throw Error(`Error with finding user: ${error}`);
  //     }
  //     findUser()
  //   }
  // }, []);
  return <Navigate to="/" />;
}
