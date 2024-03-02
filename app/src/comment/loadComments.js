export default async function loadComments(page, type, reply, id) {
  try {
    const res = await fetch("http://localhost/user-comments", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ type, reply, id, page }),
    });
    if (!res.ok) throw Error("Error with loadComments function");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}
