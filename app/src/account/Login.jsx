import { useState } from "react";
import CreateAccount from "./CreateAccount";
import LoginAccount from "./LoginAccount";
export default function Login({ closeFn, uncloseable }) {
  const [currentPage, setCurrentPage] = useState("login");
  function switchPage() {
    setCurrentPage((prev) => {
      const toSet = prev === "login" ? "creator" : "login";
      return toSet;
    });
  }
  return (
    <div className={`account${!uncloseable ? " cl" : ""}`}>
      <div className="container">
        <header>
          <h2>{currentPage === "login" ? "Login" : "Create Account"}</h2>
          {!uncloseable && (
            <button className="close" onClick={() => closeFn()}>
              <img src="/images/close.svg" alt="close button" />
            </button>
          )}
        </header>
        {currentPage === "login" && <LoginAccount nextPage={switchPage} />}
        {currentPage === "creator" && <CreateAccount nextPage={switchPage} />}
      </div>
    </div>
  );
}
