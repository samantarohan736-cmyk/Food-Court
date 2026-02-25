import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function MenuGrid({ items, onReviewClick, onLoginRequest }) {
    const { user, favorites, toggleFavorite } = useAuth();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleFavorite = async (id) => {
        if (!user) {
            onLoginRequest();
            return;
        }
        const res = await toggleFavorite(id);
        if (!res.success) showToast(res.error, 'error');
    };

    const handleReviewClick = (id) => {
        if (!user) {
            onLoginRequest();
            return;
        }
        onReviewClick(id);
    };

    if (items.length === 0) {
        return <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No items available right now.</p>;
    }

    return (
        <div className="menu-grid">
            {items.map(item => {
                const isOutOfStock = item.stock <= 0;
                const stockClass = isOutOfStock ? 'stock-out' : item.stock < 5 ? 'stock-low' : '';
                const stockText = isOutOfStock ? 'Out of Stock' : `${item.stock} Available`;
                const isFav = favorites.includes(item._id);
                const avgRating = item.averageRating ? item.averageRating.toFixed(1) : 'New';
                const numReviews = item.reviews ? item.reviews.length : 0;
                const imgUrl = item.imageUrl && item.imageUrl !== 'no-photo.jpg'
                    ? item.imageUrl
                    : `https://source.unsplash.com/600x400/?${item.category.toLowerCase().replace(' ', '')},food`;

                return (
                    <div className="menu-card" key={item._id}>
                        <div className="card-img-container">
                            <span className="category-tag">{item.category}</span>
                            <button
                                className={`fav-btn ${isFav ? 'active' : ''}`}
                                onClick={() => handleFavorite(item._id)}
                            >
                                <i className="fas fa-heart"></i>
                            </button>
                            <img src={imgUrl} alt={item.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop'; }} />
                        </div>
                        <div className="card-content">
                            <div className="card-header">
                                <h3>{item.name}</h3>
                                <span className="price">${item.price.toFixed(2)}</span>
                            </div>
                            <div
                                className="rating-stars"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleReviewClick(item._id)}
                                title="Leave a review"
                            >
                                <i className="fas fa-star"></i> {avgRating} <span>({numReviews} reviews)</span>
                            </div>
                            <p>{item.description}</p>
                            <div className="card-footer">
                                <span className={`stock-info ${stockClass}`}>{stockText}</span>
                                <button
                                    className="add-to-cart-btn"
                                    onClick={() => {
                                        const res = addToCart(item);
                                        if (res.success) showToast(res.message, 'success');
                                        else showToast(res.error, 'error');
                                    }}
                                    disabled={isOutOfStock}
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
