import { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ReviewModal({ isOpen, onClose, itemId, onReviewSuccess }) {
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const { token } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/menu/${itemId}/reviews`,
                { rating: Number(rating), comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                showToast('Review submitted!', 'success');
                onClose();
                setComment('');
                setRating('5');
                if (onReviewSuccess) onReviewSuccess();
            }
        } catch (err) {
            showToast(err.response?.data?.error || 'Error submitting review', 'error');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review" width="400px">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Rating (1-5)</label>
                    <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Your Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Tell us what you thought..."
                        rows="3"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary full-width">Submit Review</button>
            </form>
        </Modal>
    );
}
