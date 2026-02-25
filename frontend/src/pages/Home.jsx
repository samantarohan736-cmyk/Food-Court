import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuGrid from '../components/MenuGrid';
import CartSidebar from '../components/CartSidebar';
import AuthModal from '../components/AuthModal';
import PaymentModal from '../components/PaymentModal';
import ReviewModal from '../components/ReviewModal';
import MyOrdersModal from '../components/MyOrdersModal';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const API_URL = 'http://localhost:5000/api';

export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // UI States
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

    // Review Modal State
    const [reviewItemId, setReviewItemId] = useState(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API_URL}/menu`);
            if (res.data.success) {
                setMenuItems(res.data.data);
                setFilteredItems(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching menu:', err);
            showToast('Failed to load menu. Is the backend running?', 'error');
        }
    };

    const handleSearch = (term) => {
        setSelectedCategory('all');
        const lowerTerm = term.toLowerCase();
        setFilteredItems(menuItems.filter(i =>
            i.name.toLowerCase().includes(lowerTerm) ||
            i.description.toLowerCase().includes(lowerTerm) ||
            i.category.toLowerCase().includes(lowerTerm)
        ));
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (category === 'all') {
            setFilteredItems(menuItems);
        } else {
            setFilteredItems(menuItems.filter(i => i.category === category));
        }
    };

    const handleReviewClick = (id) => {
        setReviewItemId(id);
        setIsReviewOpen(true);
    };

    return (
        <div className="home-body">
            <Navbar
                onCartToggle={() => setIsCartOpen(!isCartOpen)}
                onLoginClick={() => setIsAuthOpen(true)}
                onMyOrdersClick={() => setIsMyOrdersOpen(true)}
            />

            <Hero onSearch={handleSearch} />

            <main className="container menu-section" id="menu">
                <div className="section-title">
                    <h2>Our Delicacies</h2>
                </div>

                <div className="category-filters">
                    {['all', 'Main Course', 'Appetizer', 'Beverage', 'Dessert'].map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(cat)}
                        >
                            {cat === 'all' ? 'All' : cat}
                        </button>
                    ))}
                </div>

                <MenuGrid
                    items={filteredItems}
                    onReviewClick={handleReviewClick}
                    onLoginRequest={() => setIsAuthOpen(true)}
                />
            </main>

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsPaymentOpen(true);
                }}
            />

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onPaymentSuccess={fetchMenu} // Refresh stock
            />
            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                itemId={reviewItemId}
                onReviewSuccess={fetchMenu} // Refresh ratings
            />
            <MyOrdersModal isOpen={isMyOrdersOpen} onClose={() => setIsMyOrdersOpen(false)} />
        </div>
    );
}
