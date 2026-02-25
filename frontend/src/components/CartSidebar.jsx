import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function CartSidebar({ isOpen, onClose, onCheckout }) {
    const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
    const { user } = useAuth();

    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="cart-header">
                <h3>Your Order</h3>
                <button className="close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
            </div>

            <div className="cart-items">
                {cart.length === 0 ? (
                    <div className="empty-cart-msg">Your cart is empty.</div>
                ) : (
                    cart.map(item => (
                        <div className="cart-item" key={item._id}>
                            <img
                                className="cart-item-img"
                                src={item.imageUrl !== 'no-photo.jpg' ? item.imageUrl : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'}
                                alt={item.name}
                            />
                            <div className="cart-item-details">
                                <div className="cart-item-title">{item.name}</div>
                                <div className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</div>
                                <div className="qty-control">
                                    <button className="qty-btn" onClick={() => updateQuantity(item._id, -1, item.stock)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="qty-btn" onClick={() => updateQuantity(item._id, 1, item.stock)}>+</button>
                                </div>
                            </div>
                            <button className="cart-item-remove" onClick={() => removeFromCart(item._id)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-footer">
                <div className="cart-total">
                    <span>Total:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="checkout-form">
                    <button
                        className="btn btn-primary full-width"
                        onClick={onCheckout}
                        disabled={cart.length === 0}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}
