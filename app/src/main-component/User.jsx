import Profile from "./Profile";
import { Outlet, Route, Routes } from "react-router-dom";
import useSearchUser from "../profile/useSearchUser";
import EditProfile from "../profile/EditProfile";
import Settings from "./Settings";
import Shelf from "../comment/Shelf";
import ProfileLikes from "../profile/ProfileLikes";
export default function User() {
  const accountUser = useSearchUser();

  if (!accountUser) return <p className="user_not_found">User not found...</p>;

  return (
    <div className="profile_table">
      <Profile session={true} user={accountUser} />
      <Routes>
        <Route
          path="/"
          element={<Shelf id={accountUser["id"]} type="owner" />}
        />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="settings" element={<Settings />} /> 
        <Route path="likes" element={<ProfileLikes id={accountUser["id"]} />} />
      </Routes>
      <Outlet></Outlet>
    </div>
  );
}
