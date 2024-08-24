import { FormValues } from './Models.tsx';

export async function registerUser(data: FormValues) {
    console.log("register api")
    const response = await fetch('/api/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    
    if (response.status == 200) {
        return;
    } else if (response.status == 401 || response.status == 400) {
        const result = await response.json();
        const err = Object.values(result.errors)[0];
        const msg = Array.isArray(err) ? err[0] : 'Server Error';
        throw new Error(msg);
    } else {
        throw new Error("Server Error");
    }
}
export async function loginUser(data: FormValues) {
    console.log("login api")
    const url = (data.rememberme) ? "/api/login?useCookies=true" : "/api/login?useSessionCookies=true";
    delete data.rememberme;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (response.status == 200) {
        return;
    } else if (response.status == 401 || response.status == 400) {
        throw new Error("Wrong email or password");
    } else {
        throw new Error("Server Error");
    }
}
export async function logoutUser() {
    console.log("logout api")
    const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: ""
    });
    if (response.status == 200) {
        return;
    } else {
        throw new Error("Server Error");
    }
}
export async function getUserProfile() {
    console.log("profile api")
    const response = await fetch("/api/profile");
    
    if (response.status == 200) {
        const result = await response.json();
        return result;
    } else if (response.status == 401) {
        throw new Error("Unauthorised");
    } else {
        throw new Error("Server Error");
    }
}