import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function Admin() {
    const { user, token, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('menu');
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);

    // Modal State
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: 'Main Course', imageUrl: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        if (activeTab === 'menu') fetchMenu();
        if (activeTab === 'orders') fetchOrders();
    }, [user, activeTab, navigate]);

    const fetchMenu = async () => {
        try {
            const res = await axios.get(`${API_URL}/menu`);
            if (res.data.success) setMenuItems(res.data.data);
        } catch (err) {
            showToast('Error loading menu', 'error');
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setOrders(res.data.data);
        } catch (err) {
            showToast('Error loading orders', 'error');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    const openAddModal = () => {
        setEditId(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: 'Main Course', imageUrl: '' });
        setIsItemModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditId(item._id);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            stock: item.stock,
            category: item.category,
            imageUrl: item.imageUrl === 'no-photo.jpg' ? '' : item.imageUrl
        });
        setIsItemModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await axios.delete(`${API_URL}/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                showToast('Item deleted', 'success');
                fetchMenu();
            }
        } catch (err) {
            showToast('Error deleting item', 'error');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, imageUrl: formData.imageUrl || 'no-photo.jpg' };
        try {
            const method = editId ? 'put' : 'post';
            const url = editId ? `${API_URL}/menu/${editId}` : `${API_URL}/menu`;

            const res = await axios({
                method, url, data: payload,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                showToast(editId ? 'Item updated' : 'Item added', 'success');
                setIsItemModalOpen(false);
                fetchMenu();
            } else {
                showToast(res.data.error, 'error');
            }
        } catch (err) {
            showToast('Error saving item', 'error');
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="admin-body">
            <nav className="navbar admin-nav">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    Crave <span>Admin</span>
                </div>
                <div className="nav-links">
                    <a href="#" onClick={handleLogout}>Logout <i className="fas fa-sign-out-alt"></i></a>
                </div>
            </nav>

            <div className="admin-container">
                <div className="admin-sidebar">
                    <ul className="admin-menu">
                        <li className={activeTab === 'menu' ? 'active' : ''} onClick={() => setActiveTab('menu')}>
                            <i className="fas fa-utensils"></i> Manage Menu
                        </li>
                        <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                            <i className="fas fa-receipt"></i> All Orders
                        </li>
                        <li onClick={() => navigate('/')}>
                            <i className="fas fa-external-link-alt"></i> View Store
                        </li>
                    </ul>
                </div>

                <div className="admin-content" style={{ flexGrow: 1, padding: '2rem 5%', background: '#fff' }}>
                    {activeTab === 'menu' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h2>Menu Items</h2>
                                <button className="btn btn-primary" onClick={openAddModal}>
                                    <i className="fas fa-plus"></i> Add New Item
                                </button>
                            </div>
                            <div className="table-container" style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-light)', textAlign: 'left' }}>
                                            <th style={{ padding: '15px' }}>Item Name</th>
                                            <th style={{ padding: '15px' }}>Category</th>
                                            <th style={{ padding: '15px' }}>Price</th>
                                            <th style={{ padding: '15px' }}>Stock</th>
                                            <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map(item => (
                                            <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '15px' }}><strong>{item.name}</strong></td>
                                                <td style={{ padding: '15px' }}>{item.category}</td>
                                                <td style={{ padding: '15px' }}>${item.price.toFixed(2)}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span className={`stock-info ${item.stock <= 0 ? 'stock-out' : item.stock < 5 ? 'stock-low' : ''}`}>
                                                        {item.stock}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                                    <button onClick={() => openEditModal(item)} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', margin: '0 5px' }}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', margin: '0 5px' }}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{ marginBottom: '2rem' }}>All Orders</h2>
                            <div className="table-container" style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--bg-light)', textAlign: 'left' }}>
                                            <th style={{ padding: '15px' }}>Order ID</th>
                                            <th style={{ padding: '15px' }}>Customer</th>
                                            <th style={{ padding: '15px' }}>Items</th>
                                            <th style={{ padding: '15px' }}>Total</th>
                                            <th style={{ padding: '15px' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '15px' }}>#{order._id.substring(order._id.length - 6)}</td>
                                                <td style={{ padding: '15px' }}>{order.customerName}</td>
                                                <td style={{ padding: '15px' }}>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                                <td style={{ padding: '15px' }}><strong>${order.totalAmount.toFixed(2)}</strong></td>
                                                <td style={{ padding: '15px' }}>
                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title={editId ? "Edit Item" : "Add New Item"} width="500px">
                <form onSubmit={handleFormSubmit}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Item Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                            <option value="Main Course">Main Course</option>
                            <option value="Appetizer">Appetizer</option>
                            <option value="Beverage">Beverage</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Price ($)</label>
                            <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Stock</label>
                            <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Image URL (Optional)</label>
                        <input type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows="3" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary full-width">
                        {editId ? 'Save Changes' : 'Add Item'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
