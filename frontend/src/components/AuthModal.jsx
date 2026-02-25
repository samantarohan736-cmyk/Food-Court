import { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = isLoginMode
            ? await login(email, password)
            : await register(name, email, password);

        if (res.success) {
            showToast(isLoginMode ? 'Logged in successfully' : 'Registered successfully', 'success');
            onClose();
            // Give time for state to update
            setTimeout(() => {
                const userObj = JSON.parse(localStorage.getItem('user'));
                if (userObj?.role === 'admin') navigate('/admin');
            }, 800);
        } else {
            showToast(res.error, 'error');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isLoginMode ? 'Login to Crave' : 'Register for Crave'}
            width="400px"
        >
            <form onSubmit={handleSubmit}>
                {!isLoginMode && (
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" required />
                    </div>
                )}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                </div>
                <button type="submit" className="btn btn-primary full-width">
                    {isLoginMode ? 'Login' : 'Register'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
                <a href="#" style={{ color: 'var(--primary)' }} onClick={(e) => { e.preventDefault(); setIsLoginMode(!isLoginMode); }}>
                    {isLoginMode ? "Don't have an account? Register" : "Already have an account? Login"}
                </a>
            </p>
        </Modal>
    );
}
