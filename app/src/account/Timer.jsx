import { useEffect, useRef, useState } from "react";

export default function Timer({ stopBtnFn }) {
  const [duration, setDuration] = useState(180000);
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [warning, setWarning] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  useEffect(() => {
    const interval = setInterval(startTimer, 1000);
    const timer = setTimeout(() => {
      clearInterval(interval);
      stopBtnFn();
      if (!warning) setDisabledBtn(false);
    }, duration);

    return () => {
      loadTime();
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minutes, seconds == 0]);
  async function loadTime() {
    try {
      const res = await fetch("https://localhost:443/code-timer", {
        credentials: "include",
      });
      if (!res.ok) {
        console.error(res.status);
        setWarning(true);
        setDuration(0);
        setMinutes(0);
        setSeconds(0);
        return;
      }
      setDisabledBtn(true);
      const obj = await res.json();
      if (obj["minutes"] === 0 && obj["seconds"] === 0) setDuration(0);
      setMinutes(obj["minutes"]);
      setSeconds(obj["seconds"]);
      setDuration((obj["minutes"] * 60 + obj["seconds"]) * 1000);
    } catch (err) {
      throw err;
    }
  }

  function startTimer() {
    if (seconds === 0) {
      setMinutes((prev) => prev - 1);
      setSeconds(59);
    } else {
      setSeconds((prev) => prev - 1);
    }
  }

  async function refreshCode() {
    console.log(2);
    try {
      const res = await fetch("https://localhost:443/refresh", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return console.error(res.status);
      loadTime();
      console.log(ok);
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className="timer">
      <p>
        {minutes}:{seconds < 10 && 0}
        {seconds}
      </p>
      <button
        type="button"
        className="temporary confirm refresh"
        disabled={disabledBtn}
        onClick={() => refreshCode()}>
        Refresh Code
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24">
          <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
        </svg>
      </button>
    </div>
  );
}
