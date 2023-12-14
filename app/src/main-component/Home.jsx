import {  useState } from "react";
import Login from "../account/Login";
export default function Home({ session }) {
  const [window, setWindow] = useState(true);
  function closeWindow() {
    setWindow(false);
  }
  return (
    <>
      {window && !session ? <Login closeFn={closeWindow} /> : null}
      <section className="home">
        <header className="headline">
          <h1 className="introduction">
            Welcome to our website! Use the navigation at the top of the page to
            navigate through our site. If you want to learn more, go to the
            information section. For more content, go to news
          </h1>
          <p className="description">enjoy your trip</p>
        </header>
      </section>
    </>
  );
}
