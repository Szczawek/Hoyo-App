export default async function addComment(content, avatar, nick) {
  const value = { content: content, nick: nick };
  const form = new FormData();
  if (avatar !== "/images/user.svg") {
    const base64Data = avatar.split(",")[1]; // Odseparuj dane od nagłówka base6
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    form.append("myFile", blob, "image.jpg");
  }
  form.append("data", JSON.stringify(value));
  const options = {
    method: "POST",
    credentials: "include",
    body: form,
  };
  try {
    const response = await fetch("http://localhost/add-comment", options);
    return response;
  } catch (err) {
    throw Error(`Error with #addComment function: ${err}`);
  }
}
