import { useEffect, useState } from "react";
import Timer from "./Timer";
import sendCreateReq from "./sendCreateReq";
import { useNavigate } from "react-router-dom";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const accountData = JSON.parse(localStorage.getItem("accountData"));
  const [code, setCode] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  useEffect(() => {
    return () => sendCode();
  }, []);
  
  // Send Confirm Code
  async function sendCode() {
    console.log("tlkapsdada")
    try {
      const res = await fetch("https://localhost:443/send-confirm-code", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok)
        return console.error(
          `An error with generating confirm-code: ${res.status}`
        );
    } catch (err) {
      throw err;
    }
  }
  // DODAĆ POBIERANIE CZASU ILE JESZCZE UTRZYMAHJĄ SIĘ CIASTECZKA

  async function confrimCode(e) {
    e.preventDefault();
    let codeToCheck = "";

    for (const [key, value] of Object.entries(code)) {
      codeToCheck += value;
    }
    codeToCheck = Number(codeToCheck);
    try {
      const res = await fetch("https://localhost:443/confirm-code", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ codeToCheck }),
      });
      if (!res.ok) return console.error(`Invalid code: ${res.status}`);
      await sendCreateReq(accountData);
      navigate(`/${accountData["nick"]}`);
      window.location.reload()
    } catch (err) {
      throw err;
    }
  }
  return (
    <form className="container confirm_email" onSubmit={(e) => confrimCode(e)}>
      <header>
        <h3>Confrim Email With Code:</h3>
        <p>Enter your code from your email</p>
      </header>
      <div>
        <div className="enter_code">
          {[...new Array(6)].map((e, index) => {
            return (
              <label key={index} htmlFor={`box-${index}`}>
                <input
                  required
                  value={code[`${index}`]}
                  id={`box-${index}`}
                  className="num_box"
                  maxLength={1}
                  onChange={(e) => {
                    setCode((prev) => {
                      const copy = { ...prev };
                      copy[index] = e.target.value;
                      return copy;
                    });
                  }}
                  onKeyDown={(e) => {
                    const possibleSign = [
                      "Backspace",
                      "ArrowRight",
                      "ArrowLeft",
                    ];
                    if (isNaN(Number(e.key)) && !possibleSign.includes(e.key))
                      e.preventDefault();
                  }}
                />
              </label>
            );
          })}
        </div>
      </div>
      <Timer sendCode={sendCode} />
      <button className="confirm">Check Code</button>
    </form>
  );
}
