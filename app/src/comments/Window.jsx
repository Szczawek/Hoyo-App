export default function Window(prop) {
  const { sendCom, closeWindow } = prop;
  return (
    <div className="window">
      <div className="content">
        <h3>Do you want to add a comment to your account?</h3>
        <button className="confirm" onClick={() => sendCom()}>
          Confirm <img src="/images/check.svg" alt="confirm comment" />
        </button>
        <button className="cancel" onClick={closeWindow}>
          Cancel <img src="/images/close.svg" alt="cancel comment" />
        </button>
      </div>
    </div>
  );
}
