import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (token) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data.favorites) {
                setFavorites(res.data.data.favorites.map(f => f._id || f));
            }
        } catch (err) {
            console.error('Error fetching favorites', err);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                return { success: true };
            }
            return { success: false, error: res.data.error };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            if (res.data.success) {
                setToken(res.data.token);
                setUser(res.data.user);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                return { success: true };
            }
            return { success: false, error: res.data.error };
        } catch (err) {
            return { success: false, error: err.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        setToken('');
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const toggleFavorite = async (itemId) => {
        if (!user) return { success: false, error: 'Please login' };

        const isFav = favorites.includes(itemId);
        const method = isFav ? 'delete' : 'post';

        try {
            const res = await axios({
                method,
                url: `${API_URL}/auth/favorites/${itemId}`,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setFavorites(res.data.data);
                return { success: true };
            }
        } catch (err) {
            return { success: false, error: 'Failed to update favorites' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, favorites, login, register, logout, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
