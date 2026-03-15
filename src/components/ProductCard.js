'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const GRADE_CSS = { a: 'gr-A', b: 'gr-B', c: 'gr-C', d: 'gr-D', e: 'gr-E' };

function pseudoRating(name) {
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return (3.5 + (h % 15) / 10).toFixed(1);
}

function pseudoReviews(name) {
    let h = 0;
    for (let i = 0; i < (name || '').length; i++) h = (h * 17 + name.charCodeAt(i)) >>> 0;
    return 200 + (h % 9800);
}

export default function ProductCard({ product }) {
    const { addItem, removeItem, isInCart } = useCart();
    const inCart = isInCart(product.id);
    const gradeKey = (product.nutritionGrade || '').toLowerCase();
    const rating = parseFloat(pseudoRating(product.name));
    const reviews = pseudoReviews(product.name);

    function handleCart(e) {
        e.preventDefault();
        e.stopPropagation();
        inCart ? removeItem(product.id) : addItem(product);
    }

    // Determine an interesting badge conditionally based on id or reviews (just purely for UI flair)
    const isNew = reviews % 5 === 0;

    return (
        <Link href={`/product/${encodeURIComponent(product.id)}`} className="product-card animate-fade-in" id={`card-${product.id}`}>
            {isNew && <div className="card-new-badge">New</div>}

            {/* Wishlist */}
            <button className="card-wishlist" onClick={e => e.preventDefault()} aria-label="Wishlist" title="Add to Wishlist">
                ❤️
            </button>

            {/* Image with light tint background */}
            <div className="card-img-zone" style={{ backgroundColor: 'var(--bg)' }}>
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; e.target.parentNode.querySelector('.card-img-placeholder').style.display = 'flex'; }}
                    />
                ) : null}
                <div className="card-img-placeholder" style={{ display: product.image ? 'none' : 'flex', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                    🥫
                </div>

                {product.nutritionGrade && (
                    <span className={`grade-badge ${GRADE_CSS[gradeKey] || 'gr-N'}`}>
                        Grade {product.nutritionGrade.toUpperCase()}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="card-body">
                {product.brands ? <div className="card-brand">{product.brands}</div> : <div style={{ height: '14px' }}></div>}
                <div className="card-name">{product.name}</div>
                {product.category && <div className="card-cat">{product.category}</div>}

                <div className="card-rating">
                    <div className="rating-badge">
                        <span>★</span> {rating}
                    </div>
                    <span className="rating-count">({reviews.toLocaleString()})</span>
                </div>
            </div>

            {/* CTA */}
            <div className="card-cta">
                <button
                    id={`cart-btn-${product.id}`}
                    className={`btn-card btn-cart ${inCart ? 'added' : ''}`}
                    onClick={handleCart}
                    aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
                >
                    {inCart ? '✓ Added' : '🛒 Cart'}
                </button>
                <span className="btn-card btn-view">
                    Details
                </span>
            </div>
        </Link>
    );
}
