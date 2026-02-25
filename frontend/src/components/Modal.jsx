export default function Modal({ isOpen, onClose, title, children, width = '400px', icon = null }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="overlay show" onClick={onClose}></div>
            <div className="modal show">
                <div className="modal-content" style={{ width, maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="modal-header">
                        <h3>{title} {icon && <i className={icon}></i>}</h3>
                        <button className="close-btn" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
