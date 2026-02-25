import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        if (item.stock <= 0) return { success: false, error: 'Out of stock' };

        let successMsg = '';
        setCart(prevCart => {
            const existing = prevCart.find(c => c._id === item._id);
            if (existing) {
                if (existing.quantity < item.stock) {
                    successMsg = `Added another ${item.name} to cart`;
                    return prevCart.map(c =>
                        c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
                    );
                } else {
                    return prevCart; // handled in component
                }
            } else {
                successMsg = `${item.name} added to cart`;
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
        return { success: true, message: successMsg || 'Added to cart' };
    };

    const updateQuantity = (id, delta, stock) => {
        setCart(prevCart => {
            return prevCart.map(c => {
                if (c._id === id) {
                    const newQty = c.quantity + delta;
                    if (newQty > stock) return c; // Cannot exceed stock
                    return { ...c, quantity: newQty };
                }
                return c;
            }).filter(c => c.quantity > 0);
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(c => c._id !== id));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
