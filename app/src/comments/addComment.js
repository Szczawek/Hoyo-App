export default async function addComment(obj) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(obj),
  };
  try {
    const response = await fetch("http://localhost/add-comment", options);
    if (!response.ok) return response;
    const obj = await response.json();
    return obj;
  } catch (err) {
    throw Error(`Error with #addComment function: ${err}`);
  }
}
