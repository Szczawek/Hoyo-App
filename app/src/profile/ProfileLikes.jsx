import { useEffect, useState } from "react";
import Shelf from "../comment/Shelf";
export default function ProfileLikes({ id }) {
  return (
    <div className="profile_likes">
      <Shelf type="likes" id={id} />
    </div>
  );
}
