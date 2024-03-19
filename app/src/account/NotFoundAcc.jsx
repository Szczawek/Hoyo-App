import { Navigate } from "react-router-dom"

export default function NotFoundAcc() {
    return <Navigate to={"/empty-user"} />
}