import YouTube from "react-youtube";
import Account from "../account/Account";
import { useEffect } from "react";
export default function Info() {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };
  const tt = Number([1,2].join("")) * 1000
  console.log(tt)

  localStorage.setItem("ttd", new Date());
  useEffect(() => {
    fetch("https://localhost:443/code-timer", {
      credentials: "include",
    });
  }, []);
  function onPlayerReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  return (
    <div className="info">
      <h3>Info</h3>
      <p>12</p>
      {/* <YouTube id="6UlU_FsicK8" opts={opts} onReady={onPlayerReady} /> */}
    </div>
  );
}
