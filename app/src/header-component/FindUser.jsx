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

  return (
    <label className="search_user" htmlFor="find_user">
      <img src="images/search.svg" alt="decoration" />
      <input
        type="search"
        id="find_user"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setOpenWindow(true)}
        onBlur={() => setOpenWindow(false)}
      />
      {openWinow && (
        <UsersList
          empty={value.length > 0}
          users={users.filter((e) =>
            e["nick"].toLowerCase().startsWith(value.toLowerCase())
          )}
        />
      )}
    </label>
  );
}

function UsersList({ users, empty }) {
  return (
    <ul className="user_list">
      {users.length && empty ? (
        users.map((e, index) => {
          return (
            <li key={index}>
              <button>{e["nick"]}</button>
            </li>
          );
        })
      ) : (
        <p>Nothing is here</p>
      )}
    </ul>
  );
}
