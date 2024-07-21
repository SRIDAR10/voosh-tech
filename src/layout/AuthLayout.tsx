import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/queries/AuthLayout";

type Props = {
    children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    const navigate = useNavigate();
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? "") : "";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logoutUser().then(() => {
            navigate("/login");
        });
    }
    return (
        <div className="flex flex-col">
            <div className="w-full h-12 bg-blue-700 text-white">
                <div className="mr-4 ml-auto flex items-center h-full gap-4 w-fit">
                    {user && Object.keys(user) ? (
                        <button className="text-blue-700 border bg-white rounded-md p-2" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <button className="text-blue-700 border bg-white rounded-md p-2" onClick={() => navigate("/login")}>Login</button>
                            <button className="rounded-md" onClick={() => navigate("/signup")}>Signup</button>
                        </>
                    )}
                </div>
            </div>
            <div className="h-[calc(100vh-44px)] flex flex-col w-full">{children}</div>
        </div>
    );
};

export default AuthLayout;