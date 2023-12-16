import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function NotFound() {
  // useEffect(() => {
  //   findUser();
  // }, []);
  // async function findUser() {
  //   const options = {
  //     method: "POST",
  //   };
  //   const value = location.pathname.slice(1)
  //   try {
  //     const response = await fetch(`http://localhost/users/${value}`, options);
  //     console.log(response.status);
  //   } catch (error) {
  //     throw Error(`Error with finding user: ${error}`);
  //   }
  // }
  // return <p>nothing</p>;
  return <Navigate to="/" />;
}
