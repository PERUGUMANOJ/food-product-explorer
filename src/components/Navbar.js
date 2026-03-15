'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import { POPULAR_CATEGORIES } from '@/lib/api';

const CAT_ICONS = {
    'beverages': '🥤', 'dairy products': '🥛', 'snacks': '🍿',
    'biscuits-and-cakes': '🍪', 'cereals-and-potatoes': '🌾',
    'fruits-and-vegetables-based-foods': '🥦', 'meats': '🥩',
    'fish-and-seafood': '🐟', 'sauces-and-condiments': '🧂',
    'chocolates': '🍫', 'bread': '🍞', 'plant-based-foods': '🌱',
};

export default function Header({ onSearch, onCategorySelect, activeCategory }) {
    const { count, toggleCart } = useCart();
    const [query, setQuery] = useState('');
    function handleSubmit(e) {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            // Auto-detect barcode (8 to 14 digits)
            const isBarcode = /^\d{8,14}$/.test(trimmed);
            onSearch?.(isBarcode ? 'barcode' : 'name', trimmed);
        }
    }

    return (
        <>
            <header className="header">
                {/* Announcement bar */}
                <div className="header-topbar">
                    🎉 Free shipping on all orders · &nbsp;<strong>Powered by OpenFoodFacts</strong>&nbsp; · 3M+ verified products
                </div>

                {/* Main bar */}
                <div className="header-main">
                    <Link href="/" className="header-logo">
                        <div className="header-logo-icon">🔬</div>
                        <div className="header-logo-text">
                            <span className="header-logo-name">FoodScope</span>
                            <span className="header-logo-sub">Food Intelligence</span>
                        </div>
                    </Link>

                    <form className="header-search" onSubmit={handleSubmit}>
                        <input
                            id="header-search-input"
                            className="header-search-input"
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search by name, brand, or barcode..."
                            autoComplete="off"
                        />
                        <button type="submit" className="header-search-btn" id="header-search-btn">
                            🔍 Search
                        </button>
                    </form>

                    <div className="header-actions">
                        <button
                            className="header-action-btn"
                            onClick={toggleCart}
                            id="cart-btn"
                        >
                            <span className="header-action-icon">🛒</span>
                            <span>Cart</span>
                            {count > 0 && <span className="header-cart-badge">{count}</span>}
                        </button>
                    </div>
                </div>

                {/* Category nav */}
                <nav className="header-nav">
                    <div className="header-nav-inner">
                        <button className="nav-all-btn" onClick={() => onCategorySelect?.('')}>
                            ☰ Browse Categories
                        </button>
                        <button
                            className={`nav-btn ${!activeCategory ? 'active' : ''}`}
                            onClick={() => onCategorySelect?.('')}
                            id="nav-all"
                        >
                            All
                        </button>
                        {POPULAR_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                id={`nav-${cat}`}
                                className={`nav-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => onCategorySelect?.(cat)}
                            >
                                {CAT_ICONS[cat] || '🍽'}{' '}
                                {cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 16)}
                            </button>
                        ))}
                    </div>
                </nav>
            </header>

            <CartDrawer />
        </>
    );
}
