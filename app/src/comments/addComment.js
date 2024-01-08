export default async function addComment(content, avatar, nick) {
  const value = { content: content, avatar: avatar, nick: nick };
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  };
  try {
    const response = await fetch("http://localhost/add-comment", options);
    return response;
  } catch (err) {
    throw Error(`Error with #addComment function: ${err}`);
  }
}
