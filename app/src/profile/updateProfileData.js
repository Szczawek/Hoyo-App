import resizer from "react-image-file-resizer";
export default async function updateProfileData(
  navigate,
  noChanges,
  e,
  img,
  updatedData,
  avatar,
  updateUserData,
  file
) {
  e.preventDefault();
  try {
    if (noChanges) return navigate(-1);
    const form = new FormData();
    if (img !== avatar) {
      const resizeImg = await new Promise((resolve) => {
        resizer.imageFileResizer(
          file,
          300,
          300,
          "JPEG",
          100,
          0,
          (img) => {
            resolve(img);
          },
          "file",
          200,
          200
        );
      });
      form.append("myFile", resizeImg);
    }

    form.append("data", JSON.stringify({ ...updatedData, avatar }));
    const response = await fetch("http://localhost/update-profile", {
      method: "POST",
      body: form,
    });
    if (!response.ok) return console.log(response.status);

    const imgSrc = await response.json();
    console.log(avatar);
    const copy = { ...updatedData, avatar };
    if (imgSrc["imgSrc"]) {
      console.log(imgSrc)
      console.log("src");
      copy["avatar"] = imgSrc["imgSrc"];
    }
    console.log(copy);
    updateUserData(copy);
    navigate(`/${copy["nick"]}`);
  } catch (err) {
    console.error(err);
  }
}
