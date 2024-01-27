export default async function follow(owner, person) {
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ owner: owner, person: person }),
  };
  try {
    const res = await fetch("http://localhost/follow", options);
    if (!res.ok) alert("Error with follow");
    return await res.json();
  } catch (err) {
    throw err;
  }
}
