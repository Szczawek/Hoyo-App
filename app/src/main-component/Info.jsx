export default function Info() {
  function handleBlurA(event) {
    // Tutaj umieść kod obsługi zdarzenia onBlur dla elementu A
    console.log('Blur na elemencie A');
    
    // Sprawdzamy, czy zdarzenie jest spowodowane przez kliknięcie w element B
    const clickedElement = event.relatedTarget;
    if (clickedElement && clickedElement.id === 'elementB') {
      // Jeśli kliknięto w element B, nie chcemy propagować onBlur dalej
      event.stopPropagation();
    }
  }
  
  function handleButtonClick() {
    // Tutaj umieść kod obsługi zdarzenia onClick dla elementu B
    console.log('Kliknięcie na elemencie B');
  }
  return (
    <section className="info">
      <header className="introduce">
        <h2>
          Hi, if you don't know how to navigate our site, let me tell you. First
          of all, you need to create an account to navigate smoothly through the
          site
        </h2>
        <p>Click here!</p>
      </header>
      <div className="content">
        <p>Nothing is here</p>
      </div>
      <div id="elementA" onBlur={(event) => handleBlurA(event)}>
  Element A

  <br />
  <button id="elementB" onClick={() => handleButtonClick()}>Element B</button>
</div>
    </section>
  );
}
