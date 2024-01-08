export default function Window(prop) {
  const { nick, avatar, content, closeWindow, loadData, addComment, cl } = prop;
  return (
    <div className="window">
      <div className="content">
        <h3>Do you want to add a comment to your account?</h3>
        <button
          className="confirm"
          onClick={() => {
            addComment(content, avatar, nick).then((e) => {
              if (e.ok) {
                cl();
                closeWindow();
                loadData();
                return;
              }
              alert("Error with server");
            });
          }}>
          Confirm <img src="/images/check.svg" alt="confirm comment" />
        </button>
        <button className="cancel" onClick={closeWindow}>
          Cancel <img src="/images/close.svg" alt="cancel comment" />
        </button>
      </div>
    </div>
  );
}
