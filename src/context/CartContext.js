'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const exists = state.items.find(i => i.id === action.item.id);
            if (exists) return state;
            return { ...state, items: [...state.items, action.item] };
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(i => i.id !== action.id) };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };
        case 'CLOSE_CART':
            return { ...state, isOpen: false };
        default:
            return state;
    }
}

const initialState = {
    items: [],
    isOpen: false,
};

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = useCallback((item) => {
        dispatch({ type: 'ADD_ITEM', item });
    }, []);

    const removeItem = useCallback((id) => {
        dispatch({ type: 'REMOVE_ITEM', id });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    const toggleCart = useCallback(() => {
        dispatch({ type: 'TOGGLE_CART' });
    }, []);

    const closeCart = useCallback(() => {
        dispatch({ type: 'CLOSE_CART' });
    }, []);

    const isInCart = useCallback((id) => {
        return state.items.some(i => i.id === id);
    }, [state.items]);

    return (
        <CartContext.Provider value={{
            items: state.items,
            isOpen: state.isOpen,
            addItem,
            removeItem,
            clearCart,
            toggleCart,
            closeCart,
            isInCart,
            count: state.items.length,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
