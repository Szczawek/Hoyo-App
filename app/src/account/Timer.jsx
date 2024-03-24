  import { useEffect, useRef, useState } from "react";

  export default function Timer({ stopBtnFn }) {
    const [duration, setDuration] = useState(180000);
    const [minutesNoOne, setMinutesNoOne] = useState(3);
    const [secondsNoOne, setSecondsNoOne] = useState(0);
    const [secondsNoTwo, setSecondsNoTwo] = useState(0);
    const refreshBtn = useRef(null);
    useEffect(() => {
      const interval = setInterval(startTimer, 1000);
      const timer = setTimeout(() => {
        clearInterval(interval);
        stopBtnFn();
        refreshBtn.current.disabled = false;
      }, duration);

      return () => {
        loadTime();
        clearInterval(interval);
        clearTimeout(timer);
      };
    }, [duration]);

    async function loadTime() {
      try {
        const res = await fetch("https://localhost:443/code-timer", {
          credentials: "include",
        });
        if (!res.ok) {
          setDuration(0);
          setMinutesNoOne(0);
          return;
        }
        const obj = await res.json();
        const { minutes, seconds } = obj;
        const tt = [secondsNoOne, secondsNoTwo];
        const timeInMs =
          (minutesNoOne - minutes) * 60000 +
          Number([secondsNoOne, secondsNoTwo].join("")) * 1000;

        const sec = String(seconds).split("");
        const secToNumber = sec.map((e) => Number(e));
        if (sec.length === 1) secToNumber.push(0);
        setDuration(timeInMs);
        setMinutesNoOne(2 - minutes);
        setSecondsNoOne(5 - secToNumber[0]);
        setSecondsNoTwo(9 - secToNumber[1]);
      } catch (err) {
        throw err;
      }
    }

    function startTimer() {
      setSecondsNoTwo((prev) => {
        if (prev === 0) {
          setSecondsNoOne((prev) => {
            if (prev === 0) {
              setMinutesNoOne((prev) => prev - 1);
              return 5;
            }
            return prev - 1;
          });
          return 9;
        }
        return prev - 1;
      });
    }
    return (
      <div className="timer">
        <p>
          {minutesNoOne}:{secondsNoOne}
          {secondsNoTwo}
        </p>
        <button
          type="button"
          ref={refreshBtn}
          disabled
          onClick={() => sendCode()}>
          Refresh Code
        </button>
      </div>
    );
  }
