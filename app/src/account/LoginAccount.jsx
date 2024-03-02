import { useEffect, useRef, useState } from "react";

export default function LoginAccount({ nextPage }) {
  const [warningMessage, setWarningMessage] = useState(false);
  const [account, setAccount] = useState({ login: "", password: "" });
  const [eyelock, setEyelock] = useState(true);
  const inputPassword = useRef(null);

  useEffect(() => {
    setWarningMessage(false);
  }, [account]);
  function airplane(e) {
    e.preventDefault();
    fetch("http://localhost/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(account),
    })
      .then((e) => {
        if (!e.ok) {
          setWarningMessage(true);
          return;
        }
        alert("You have logged into your account!");
        window.location.reload();
      })
      .catch((err) => {
        throw err;
      });
  }

  // show password in the password input
  function showPassword() {
    const inp = inputPassword.current;
    if (inp.type === "password") {
      inp.type = "text";
      setEyelock(false);
      return;
    }
    setEyelock(true);
    inp.type = "password";
  }

  return (
    <>
      <form onSubmit={(e) => airplane(e)}>
        {warningMessage && (
          <small>Your email address or password is incorrect!</small>
        )}
        <label htmlFor="email">
          <input
            value={account["login"]}
            onChange={(e) => {
              setAccount((prev) => ({
                ...prev,
                login: e.target.value,
              }));
            }}
            placeholder="Enter your email..."
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>
        <label htmlFor="password">
          <input
            ref={inputPassword}
            value={account["password"]}
            onChange={(e) => {
              setAccount((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
            placeholder="Enter your password..."
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <button
            className="show-password"
            type="button"
            onClick={() => showPassword()}>
            {eyelock ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24">
                <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24">
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
              </svg>
            )}
          </button>
        </label>
        <button className="confirm" type="submit">
          Login
        </button>
      </form>
      <div className="control-panel">
        <p>Click to</p>
        <button className="conveyor" onClick={() => nextPage()}>
          {" "}
          Create Account
        </button>
      </div>
    </>
  );
}
