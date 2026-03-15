'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const GRADE_COLOR = { a: '#26a541', b: '#7cc400', c: '#efb608', d: '#e07b39', e: '#e63e11' };

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, clearCart } = useCart();
    if (!isOpen) return null;

    return (
        <>
            <div className="overlay" onClick={closeCart} />
            <aside className="cart-drawer" id="cart-drawer">
                <div className="cart-head">
                    <span className="cart-head-title">
                        🛒 My Cart ({items.length} item{items.length !== 1 ? 's' : ''})
                    </span>
                    <button className="cart-head-close" onClick={closeCart} aria-label="Close">✕</button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p className="cart-empty-msg">Your cart is empty!</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-lighter)', marginTop: '0.25rem' }}>
                            Add items to get started
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items-list">
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <Link
                                        href={`/product/${encodeURIComponent(item.id)}`}
                                        className="cart-item-link"
                                        onClick={closeCart}
                                        style={{ display: 'flex', gap: '1rem', flex: 1, textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="cart-item-img"
                                                onError={e => { e.target.style.display = 'none'; }} />
                                        ) : (
                                            <div className="cart-item-placeholder">🥫</div>
                                        )}
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            {item.brands && <div className="cart-item-brand">{item.brands}</div>}
                                            {item.nutritionGrade && (
                                                <div className="cart-item-grade">
                                                    <span style={{ color: GRADE_COLOR[(item.nutritionGrade || '').toLowerCase()] || '#999', fontWeight: 700 }}>
                                                        ● Grade {item.nutritionGrade.toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <button className="cart-remove" onClick={() => removeItem(item.id)} title="Remove">🗑</button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-bottom">
                            <div className="cart-summary">
                                <span className="cart-summary-label">Total Items</span>
                                <span className="cart-summary-val">{items.length}</span>
                            </div>
                            <button
                                className="cart-checkout-btn"
                                onClick={() => { clearCart(); closeCart(); }}
                            >
                                🛍️ Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
