import { Outlet } from "react-router-dom";
export default function Info() {
  return (
    <>
      <div className="info">
        <p>Something is coming soon...</p>
      </div>
      <Outlet />
    </>
  );
}
