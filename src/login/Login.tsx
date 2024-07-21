import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import { loginUser } from "../utils/queries/AuthLayout";

interface Errors {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({ email: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: Errors = { email: "", password: "" };

        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!validateEmail(email)) {
            newErrors.email = "Email is invalid.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await loginUser({ email, password });
            if (data?.user && data?.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setIsSubmitting(false);
        }
    };

    const handleOauthSignin = () => {
        window.location.href = import.meta.env.OAUTH_URL;
      };
    
    return (
        <AuthLayout>
            <div className="flex justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center w-1/2 mt-10 h-fit">
                    <h1 className="text-3xl flex justify-start items-center w-full mb-4 font-semibold text-blue-600">Login</h1>
                    <form
                        onSubmit={handleLogin}
                        className="border-2 border-blue-600 h-full w-full flex flex-col p-4 rounded-md gap-4"
                    >
                        <input
                            className="mb-4 p-2 border rounded mt-6"
                            placeholder="Email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        <input
                            className="p-2 border rounded"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 p-2 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                        <div className="flex items-center justify-center">
                            <span>Don't have an account? </span>
                            <a href="/signup" className="text-blue-600 text-sm ml-1">Signup</a>
                        </div>
                        <div className="w-full items-center justify-center flex rounded-md">
                            <button className="w-fit bg-blue-600 p-2 text-white rounded-sm" onClick={handleOauthSignin}>Login with Google</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
