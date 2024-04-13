import { useContext, useState } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import updateProfileData from "./updateProfileData";
export default function EditProfile() {
  const { userData, updateUserData } = useContext(UserContext);
  const { nick, about, avatar, id, baner, hashName } = userData;
  const [data, setData] = useState({ nick, about, id });
  const [img, setImg] = useState(avatar);
  const [imgFile, setImgFile] = useState();
  const [banerFile, setBanerFile] = useState();
  const [backgroudImage, setBackgroundImage] = useState(baner);
  const navigate = useNavigate();

  function newLocation(place) {
    navigate(`${place}`);
  }

  async function haddleSaveData(e) {
    e.preventDefault();
    const comandRule =
      data["nick"] === nick &&
      data["about"] === about &&
      !imgFile &&
      !banerFile;
    updateProfileData(
      newLocation,
      comandRule,
      data,
      avatar,
      updateUserData,
      imgFile,
      banerFile,
      baner,
      hashName
    );
  }
  // UPDATE IMG
  function handleUpdataImg(e, type) {
    const file = e.target.files[0];
    if (!file) return;
    const render = new FileReader();
    render.readAsDataURL(file);
    render.onload = () => {
      switch (type) {
        case "avatar":
          setImgFile(file);
          setImg(render.result);
          break;
        case "baner":
          setBanerFile(file);
          setBackgroundImage(render.result);
          break;
      }
    };
  }

  return (
    <div className="edit_window">
      <form onSubmit={(e) => haddleSaveData(e)}>
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
        <div className="set_images">
          <label className="baner" htmlFor="backgroundImage-file">
            <img className="baner-img" src={backgroudImage} alt="baner" />
            <input
              onChange={(e) => handleUpdataImg(e, "baner")}
              type="file"
              id="backgroundImage-file"
            />
            <div className="add_image_box">
              <div className="icon_box">
                <img
                  className="add_icon"
                  src="/images/add_photo.svg"
                  alt="decoration"
                />
              </div>
            </div>
            <label className="avatar profile" htmlFor="choose_img">
              <img className="profile_img" src={img} alt="avatar" />
              <div className="add_image_box">
                <div className="icon_box">
                  <img
                    className="add_icon"
                    src="/images/add_photo.svg"
                    alt="decoration"
                  />
                </div>
              </div>
              <input
                accept="image/.png, .jpg, .jpeg"
                type="file"
                onChange={(e) => handleUpdataImg(e, "avatar")}
                id="choose_img"
              />
            </label>
          </label>
          <small className="complement">
            Click on the image to select a new image
          </small>
        </div>
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
