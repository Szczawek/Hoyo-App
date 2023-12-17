import { useEffect, useState } from "react";

export default function FindUser() {
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState("");
  const [openWinow, setOpenWindow] = useState(false);

  useEffect(() => {
    downloadUser();
  }, []);

  async function downloadUser() {
    try {
      const response = await fetch("http://localhost/users");
      const obj = await response.json();
      setUsers(obj);
    } catch (error) {
      throw Error(`Error with download users: ${error}`);
    }
  }

  function searchUser(nick) {
    history.pushState(null, "", nick);
    window.location.reload();
  }
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  // JEST TO ZEPSUTE
  return (
    <div onMouseLeave={() => setOpenWindow(false)}>
      <label
        className="search_user_case"
        htmlFor="find_user"
        onFocus={() => setOpenWindow(true)}>
        <img src="images/search.svg" alt="decoration" />
        <input
          className="search_user"
          type="search"
          id="find_user"
          placeholder="Search..."
          autoComplete="off"
          list="users_list"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpenWindow(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchUser(value);
          }}
        />
      </label>
      {openWinow && (
        <UsersList
          fn={searchUser}
          empty={value.length > 0}
          users={users.filter((e) =>
            e["nick"].toLowerCase().startsWith(value.toLowerCase())
          )}
        />
      )}
    </div>
  );
}

function UsersList({ users, empty, fn }) {
  return (
    <ul className="user_list">
      {users.length && empty ? (
        users.map((e, index) => {
          return (
            <li key={index}>
              <button onClick={() => fn(e["nick"])}>{e["nick"]}</button>
            </li>
          );
        })
      ) : (
        <p>Nothing is here</p>
      )}
    </ul>
  );
}
