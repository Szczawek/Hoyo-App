export default async function sendCreateReq(accountData) {
  try {
    const res = await fetch("https://localhost:443/create-account", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(accountData),
    });
    if (!res.ok) return console.error(res.status);
  } catch (err) {
    throw err;
  }
}
