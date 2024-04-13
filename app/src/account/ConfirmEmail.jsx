import { useContext, useEffect, useRef, useState } from "react";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
export default function ConfirmEmail({ closeConfrimGate }) {
  const navigate = useNavigate();
  const { verifyLogged } = useContext(UserContext);
  const checkCodeBtn = useRef(null);
  const [positionFocusedElement, setPositionFocusedElement] = useState(0);
  const focusedElement = useRef(null);
  const [code, setCode] = useState({
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  });

  function disabledBtn() {
    checkCodeBtn.current.disabled = true;
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
      const { nick } = await res.json();
      verifyLogged();
      closeConfrimGate();
      navigate(`/${nick}`);
    } catch (err) {
      throw err;
    }
  }
  useEffect(() => {
    focusedElement.current.focus();

    function putFocusOnItem(e) {
      switch (e.key) {
        case "ArrowDown":
          if (positionFocusedElement != 0)
            setPositionFocusedElement((prev) => prev - 1);
          break;
        case "ArrowUp":
        case "Tab":
          if (positionFocusedElement != 5)
            setPositionFocusedElement((prev) => prev + 1);
      }
    }

    document.addEventListener("keydown", putFocusOnItem);
    return () => document.removeEventListener("keydown", putFocusOnItem);
  }, [positionFocusedElement]);

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
                  ref={positionFocusedElement === index ? focusedElement : null}
                  required
                  onClick={() => setPositionFocusedElement(index)}
                  value={code[index]}
                  id={`box-${index}`}
                  className="num_box"
                  maxLength={1}
                  placeholder="num"
                  onChange={(e) => {
                    if (positionFocusedElement != 5 && e.target.value !== "")
                      setPositionFocusedElement((prev) => prev + 1);
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
      <Timer stopBtnFn={disabledBtn} />
      <button ref={checkCodeBtn} className="confirm temporary">
        Check Code
      </button>
    </form>
  );
}
