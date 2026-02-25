import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function MyOrdersModal({ isOpen, onClose }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        if (isOpen && token) fetchOrders();
    }, [isOpen, token]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/orders/myorders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="My Orders Tracking" width="600px">
            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>You have no orders yet.</p>
            ) : (
                orders.map(order => {
                    const date = new Date(order.createdAt).toLocaleString();
                    let progress = 0;
                    if (order.status === 'Preparing') progress = 33;
                    if (order.status === 'Out for delivery') progress = 66;
                    if (order.status === 'Delivered') progress = 100;

                    return (
                        <div key={order._id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>Order #{order._id.substring(18)}</strong>
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <p style={{ marginBottom: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                            </p>

                            <div style={{ marginTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '5px' }}>
                                    <span>Pending</span>
                                    <span>Preparing</span>
                                    <span>Out for delivery</span>
                                    <span>Delivered</span>
                                </div>
                                <div style={{ height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'var(--primary)', transition: 'width 0.5s' }}></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888', textAlign: 'right' }}>
                                Placed on: {date}
                            </div>
                        </div>
                    );
                })
            )}
        </Modal>
    );
}
