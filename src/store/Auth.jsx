// src/store/Auth.jsx
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ user: null, token: "" });

    useEffect(() => {
        const data = localStorage.getItem("auth");
        if (data) {
            const parseData = JSON.parse(data);
            setAuth({ user: parseData.user, token: parseData.token });
        }
    }, []);
    useEffect(() => {
        if (auth.user && auth.token) {
            localStorage.setItem("auth", JSON.stringify(auth));
        } else {
            localStorage.removeItem("auth");
        }
    }, [auth]);

    useEffect(() => {
        if (auth.token) {
            // Set the default Authorization header for axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [auth.token]);

    return (
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
