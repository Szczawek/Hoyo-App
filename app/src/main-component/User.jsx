import Profile from "./Profile";
import { Outlet, Route, Routes } from "react-router-dom";
import useSearchUser from "../profile/useSearchUser";
import EditProfile from "../profile/EditProfile";
import Settings from "./Settings";
import OwnerReplies from "../profile/OwnerReplies";
import Shelf from "../comment/Shelf";
import ProfileLikes from "../profile/ProfileLikes";
export default function User() {
  const accountUser = useSearchUser();

  if (Array.isArray(accountUser))
    return <p className="user_not_found">Search for user...</p>;
  if (!accountUser) return <p className="user_not_found">User not found</p>;

  const { id } = accountUser;
  return (
    <div className="profile_table">
      <Profile session={true} user={accountUser} />
      <Routes>
        <Route path="/" element={<Shelf id={id} type="owner" />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="likes" element={<ProfileLikes id={id} />} />
        <Route path="owner-replies" element={<OwnerReplies id={id} />} />
      </Routes>
      <Outlet></Outlet>
    </div>
  );
}
