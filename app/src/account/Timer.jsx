import { useEffect, useRef, useState } from "react";

export default function Timer({sendCode}) {
  const [minutes, setMinutes] = useState(3);
  const [secondsNoOne, setSecondsNoOne] = useState(0);
  const [secondsNoTwo, setSecondsNoTwo] = useState(0);
  const btn = useRef(null);
  useEffect(() => {
    const interval = setInterval(startTimer, 1000);
    const timer = setTimeout(() => {
      clearInterval(interval);
      btn.current.disabled = false
    }, 1000 * 60 * 3);


    function startTimer() {
      setSecondsNoTwo((prev) => {
        if (prev === 0) {
          setSecondsNoOne((prev) => {
            if (prev === 0) {
              setMinutes((prev) => prev - 1);
              return 5;
            }
            return prev - 1;
          });
          return 9;
        }
        return prev - 1;
      });
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="timer">
      <p>
        {minutes}:{secondsNoOne}
        {secondsNoTwo}
      </p>
      <button type="button" ref={btn} disabled onClick={() => sendCode()}>
        Refresh Code
      </button>
    </div>
  );
}
