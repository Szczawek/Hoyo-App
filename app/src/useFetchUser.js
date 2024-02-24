import { useState } from "react";

export default function useFetchUser() {
  const [user, setUser] = useState({});

  return user;
}
