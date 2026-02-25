import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Navbar({ onCartToggle, onLoginClick, onMyOrdersClick }) {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { showToast } = useToast();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        showToast('Logged out successfully', 'success');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <span>Crave</span>
            </Link>
            <div className="nav-links">
                <Link to="/" className="active">Menu</Link>
                {user && (
                    <a href="#" onClick={(e) => { e.preventDefault(); onMyOrdersClick(); }}>
                        My Orders <i className="fas fa-box"></i>
                    </a>
                )}
                {user?.role === 'admin' && (
                    <Link to="/admin">Admin Panel <i className="fas fa-shield-alt"></i></Link>
                )}
                {user ? (
                    <a href="#" onClick={handleLogout}>Logout <i className="fas fa-sign-out-alt"></i></a>
                ) : (
                    <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>
                        Login <i className="fas fa-user-circle"></i>
                    </a>
                )}
                <div className="cart-icon" onClick={onCartToggle}>
                    <i className="fas fa-shopping-bag"></i>
                    <span className="badge" style={{ transform: cartCount > 0 ? 'scale(1.2)' : 'scale(1)' }}>{cartCount}</span>
                </div>
            </div>
        </nav>
    );
}
