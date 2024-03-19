import YouTube from "react-youtube";
import Account from "../account/Account";
export default function Info() {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

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
