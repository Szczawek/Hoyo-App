import { useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
export default function EditProfile() {
  const { userData, updateUserData } = useContext(UserContext);
  const [data, setData] = useState({
    nick: userData["nick"],
    about: userData["about"],
    avatar: userData["avatar"],
  });
  const [file, setFile] = useState();
  const navigate = useNavigate();
  async function haddleSaveData(e) {
    e.preventDefault();
    if (
      userData["nick"] === data["nick"] &&
      userData["about"] === data["about"]
    )
      return navigate(-1);

    const form = new FormData();
    if (userData["avatar"] !== data["avatar"]) {
      form.append("myFile", file);
    }
    const values = { ...data, id: userData["id"] };
    delete values["avatar"];
    form.append("data", JSON.stringify(values));
    try {
      const res = await fetch("http://localhost/update-profile", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        updateUserData(data);
        navigate(`/${data["nick"]}`);
      }
    } catch (err) {
      throw err;
    }
  }
  // UPDATE IMG
  function handleUpdataImg(e) {
    const fileImg = e.target.files[0];
    if (!fileImg) return;
    const render = new FileReader();
    render.readAsDataURL(fileImg);
    render.onload = () => {
      setData((prev) => ({ ...prev, avatar: render.result }));
      setFile(fileImg);
    };
  }

  return (
    <div className="edit_window">
      <form onSubmit={haddleSaveData}>
        <header>
          <h3>Edit Profile</h3>
          <button className="cancel" type="button" onClick={() => navigate(-1)}>
            <svg
              className="close_svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512">
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
            </svg>
          </button>
        </header>
        <label className="avatar" htmlFor="choose_img">
          <img src={data["avatar"]} alt="avatar" />
          <input
            accept="image/.png, .jpg, .jpeg"
            type="file"
            onChange={handleUpdataImg}
            id="choose_img"
          />
        </label>
        <small className="complement">
          Click on the image to select a new image
        </small>
        <label
          className="tip"
          htmlFor="change_nick
        ">
          Change your nickname
          <input
            id="change_nick"
            value={data["nick"]}
            maxLength={35}
            minLength={2}
            pattern="\w*"
            title="Nickname must not contain special characters. Minimum length 2 characters"
            onChange={(e) =>
              setData((prev) => ({ ...prev, nick: e.target.value }))
            }
            required
          />
        </label>
        <label className="tip" htmlFor="change_about">
          Change about
          <textarea
            id="change_about"
            value={data["about"]}
            maxLength={200}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                about: e.target.value,
              }))
            }></textarea>
        </label>
        <button className="confirm" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
