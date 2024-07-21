import axios from "axios";

export async function signUp(formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    sso : boolean;
}) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/signup`,
        formData
    );
    const data = await response.data;
    return data;
}

export async function loginUser(formData: {
    email: string;
    password: string;
}) {
    const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/auth/login`,
        formData
    );
    const data = await response.data;
    return data;
}

export async function logoutUser() {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/auth/logout`,
    );
    const data = await response.data;
    return data;
}