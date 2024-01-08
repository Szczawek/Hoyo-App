import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
export default function EditProfile() {
  const obj = useContext(UserContext);
  const [data, setData] = useState({ nick: "", avatar: "", id: 1, about: "" });
  const navigate = useNavigate();
  useEffect(() => {
    const copy = { ...obj["userData"] };
    delete copy["likes"];
    setData(copy);
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    };
    try {
      const res = await fetch("http://localhost/update-profile", options);
      if (res.ok) {
        obj["verifyLogged"]();
      }
    } catch (err) {
      throw err;
    }
  }
  return (
    <div className="edit_window">
      <form onSubmit={handleSend}>
        <header>
          <h3>Edit Profile</h3>
          <button className="cancel" type="button" onClick={() => navigate(-1)}>
            <img className="small" src="/images/close.svg" alt="close btn" />
          </button>
        </header>
        <input
          required
          type="text"
          value={data["nick"]}
          maxLength={35}
          minLength={2}
          pattern="\w*"
          title="Nickname must not contain special characters. Minimum length 2 characters"
          onChange={(e) =>
            setData((prev) => ({ ...prev, nick: e.target.value }))
          }
        />
        <textarea
          value={data["about"]}
          maxLength={200}
          onChange={(e) =>
            setData((prev) => ({
              ...prev,
              about: e.target.value,
            }))
          }></textarea>
        <button className="confirm" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
