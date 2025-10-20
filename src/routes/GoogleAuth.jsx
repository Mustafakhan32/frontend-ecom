// src/pages/GoogleAuth.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/Auth'; // Adjust path as necessary

const GoogleAuth = () => {
    const navigate = useNavigate();
    const [, setAuth] = useAuth();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get('token');
        const user = query.get('user');


        if (token && user) {
            const userData = JSON.parse(decodeURIComponent(user));

            localStorage.setItem('auth', JSON.stringify({ user: userData, token }));
            setAuth({ user: userData, token });

            navigate('/');
        } else {
            navigate('/login');
        }
    }, [navigate, setAuth]);


    return <div>Loading...</div>; // Optional loading state while processing
};

export default GoogleAuth;