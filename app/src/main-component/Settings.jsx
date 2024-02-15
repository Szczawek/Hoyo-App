export default function Settings() {
  // Delete account
  async function deleteAccount() {
    try {
      await fetch("http://localhost/remove", options);
      navigate("/");
      window.location.reload();
    } catch (error) {
      throw Error(`The server isn't responding: ${error}`);
    }
  }
  return (
    <div className="profile_settings">
      <h2>Settings</h2>
      <ul>
        <li>
          <button onClick={() => deleteAccount()}>Delete Account</button>
        </li>
      </ul>
    </div>
  );
}