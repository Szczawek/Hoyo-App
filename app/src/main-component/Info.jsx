import YouTube from "react-youtube";
import Account from "../account/Account";
import { useEffect } from "react";
export default function Info() {
  async function tt() {
    try {
      const ss = [1, 12, 3];
      for (const item of ss) {
        await new Promise((resolve) => {
          setTimeout(() => {
            console.log(1);
            resolve();
          }, 1500);
        });
      }
      console.log(2);
    } catch (err) {
      throw err;
    }
  }

  return (
    <div className="info">
      <h3>Info</h3>
      <p>12</p>
      <button onClick={() => tt()}>X</button>
      {/* <YouTube id="6UlU_FsicK8" opts={opts} onReady={onPlayerReady} /> */}
    </div>
  );
}
