import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FindUser() {
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState("");
  const [openWinow, setOpenWindow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    downloadUser();
  }, []);

  async function downloadUser() {
    try {
      const response = await fetch("http://localhost/users-list");
      const obj = await response.json();
      setUsers(obj);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }

  function searchUser(nick) {
    // navigate(`/${nick}`)
    history.pushState(null, "", nick);
    window.location.reload();
  }

  return (
    <label
      className="search_user_case"
      htmlFor="find_user"
      onBlur={(e) => {
        const test = e.relatedTarget;
        if (test && test.className === "find_user") return;
        setOpenWindow(false);
      }}
      onFocus={() => setOpenWindow(true)}>
      <img src="images/search.svg" alt="decoration" />
      <input
        className="search_user"
        type="search"
        id="find_user"
        placeholder="Search..."
        autoComplete="off"
        pattern="\w*"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpenWindow(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.checkValidity()) searchUser(value);
        }}
      />
      {openWinow && (
        <UsersList
          fn={searchUser}
          empty={value.length > 0}
          users={users.filter((e) =>
            e["nick"].toLowerCase().startsWith(value.toLowerCase())
          )}
        />
      )}
    </label>
  );
}

function UsersList({ users, empty, fn }) {
  return (
    <ul className="user_list">
      {users.length && empty ? (
        users.map((e, index) => {
          return (
            <li key={index}>
              <button className="find_user" onClick={() => fn(e["nick"])}>
                <div className="avatar">
                  <img  src={e["avatar"]} alt="avatar" />
                </div>
                {e["nick"]}
              </button>
            </li>
          );
        })
      ) : (
        <p>Nothing is here</p>
      )}
    </ul>
  );
}
