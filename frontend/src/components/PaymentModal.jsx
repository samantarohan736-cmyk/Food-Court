import { useState } from 'react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const orderPayload = {
            customerName: user?.name || 'Guest',
            items: cart.map(item => ({
                foodItem: item._id,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cartTotal
        };

        try {
            const res = await axios.post(`${API_URL}/orders`, orderPayload);
            if (res.data.success) {
                showToast('Payment successful! Order placed.', 'success');
                clearCart();
                onClose();
                if (onPaymentSuccess) onPaymentSuccess();
            } else {
                showToast(res.data.error || 'Failed to place order', 'error');
            }
        } catch (err) {
            showToast(err.response?.data?.error || 'Network error while placing order', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Secure Checkout" width="450px" icon="fas fa-lock">
            <p style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                This is a dummy payment gateway. Please use fake details.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="xxxx xxxx xxxx xxxx" required pattern="\d{16}" maxLength="16" />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" required pattern="\d{2}/\d{2}" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>CVV</label>
                        <input type="text" placeholder="123" required pattern="\d{3}" maxLength="3" />
                    </div>
                </div>
                <div className="form-group">
                    <label>Cardholder Name</label>
                    <input type="text" placeholder="Name on card" required defaultValue={user?.name || ''} />
                </div>
                <button type="submit" className="btn btn-primary full-width" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay $${cartTotal.toFixed(2)}`}
                </button>
            </form>
        </Modal>
    );
}
