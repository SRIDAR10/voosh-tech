import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import { signUp } from "../utils/queries/AuthLayout";

interface Errors {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Signup = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleOauthSignin = () => {
        window.location.href = "http://localhost:3001/v1/auth/google";
    };


    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();

        const newErrors: Errors = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!firstName) {
            newErrors.firstName = "First Name is required.";
        }

        if (!lastName) {
            newErrors.lastName = "Last Name is required.";
        }

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

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (
            newErrors.firstName ||
            newErrors.lastName ||
            newErrors.email ||
            newErrors.password ||
            newErrors.confirmPassword
        ) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await signUp({ firstName, lastName, password, email, sso: false });

            if (data?.token && data?.user) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                console.error("Signup failed: Invalid response");
            }
        } catch (error) {
            console.error("Signup failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex justify-center h-full w-full">
                <div className="flex flex-col items-center justify-center w-1/2 mt-10 h-fit">
                    <h1 className="text-3xl flex justify-start items-center w-full mb-4 font-semibold text-blue-600">Signup</h1>
                    <form
                        onSubmit={handleSignup}
                        className="border-2 border-blue-600 h-full w-full flex flex-col p-4 rounded-md gap-4"
                    >
                        <input
                            className="p-2 border rounded mt-6"
                            placeholder="First Name"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />
                        {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                        <input
                            className="p-2 border rounded"
                            placeholder="Last Name"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                            value={lastName}
                            required
                        />
                        {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                        <input
                            className="p-2 border rounded"
                            placeholder="Email"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        <input
                            className="p-2 border rounded"
                            type="password"
                            placeholder="Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                        <input
                            className="p-2 border rounded"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                        />
                        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 p-2 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing up..." : "Signup"}
                        </button>
                        <div className="flex items-center justify-center">
                            <span>Already have an account? </span>
                            <a href="/login" className="text-blue-600 text-sm">Login</a>
                        </div>
                        <div className="w-full items-center justify-center flex rounded-md">
                            <button className="w-fit bg-blue-600 p-2 text-white rounded-sm" onClick={handleOauthSignin}>Signup with Google</button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Signup;