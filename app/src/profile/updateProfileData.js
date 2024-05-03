import resizer from "react-image-file-resizer";
export default async function updateProfileData(
  newLocation,
  noChanges,
  updatedData,
  avatar,
  updateUserData,
  imgFile,
  banerFile,
  baner,
  hashName
) {
  try {
    if (noChanges) return newLocation(-1);
    const form = new FormData();
    const file = [
      { file: imgFile, type: "avatar" },
      { file: banerFile, type: "baner" },
    ];
    if (imgFile || banerFile) {
      for (const item of file) {
        if (!item["file"]) continue;
        await new Promise((resolve) => {
          resizer.imageFileResizer(
            item["file"],
            300,
            300,
            "JPEG",
            100,
            0,
            (reImg) => {
              updatedData[`${item.type}`] = reImg;
              resolve(form.append(item["type"], reImg));
            },
            "file",
            200,
            200
          );
        });
      }
    }
    form.append(
      "data",
      JSON.stringify({ ...updatedData, prevAvatar: avatar, prevBaner: baner })
    );
    const response = await fetch("https://localhost:443/test", {
      method: "PUT",
      body: form,
    });
    if (!response.ok) return console.log(response.status);
    console.log("ok");
    const obj = await response.json();
    const copy = { ...updatedData, ...obj };
    updateUserData(copy);
    newLocation(`/${hashName}`);
  } catch (err) {
    console.error(err);
  }
}
