import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', isVisible: false });

    const showToast = (message, type = '') => {
        setToast({ message, type, isVisible: true });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={`toast ${toast.isVisible ? 'show' : ''} ${toast.type}`}>
                {toast.message}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
