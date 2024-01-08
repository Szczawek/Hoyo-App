export default async function addReply(content, avatar, nick) {
  const options = {
    method: "POST",
  };
  try {
    const res = await fetch("http://localhost/add-reply", options);
    return res;
  } catch (err) {
    throw Error(`Error with adding reply: ${err}`);
  }
}
