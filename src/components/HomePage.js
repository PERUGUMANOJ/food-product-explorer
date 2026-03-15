'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    fetchByCategory, searchByName, fetchByBarcode,
    normalizeProduct, sortProducts, POPULAR_CATEGORIES,
} from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Navbar';

const SORTS = [
    { key: 'default', label: 'Relevance' },
    { key: 'name_asc', label: 'Name A → Z' },
    { key: 'name_desc', label: 'Name Z → A' },
    { key: 'grade_asc', label: 'Best Grade' },
    { key: 'grade_desc', label: 'Worst Grade' },
];

const CAT_META = {
    'beverages': { icon: '🥤', label: 'Beverages' },
    'dairy products': { icon: '🥛', label: 'Dairy' },
    'snacks': { icon: '🍿', label: 'Snacks' },
    'biscuits-and-cakes': { icon: '🍪', label: 'Biscuits' },
    'cereals-and-potatoes': { icon: '🌾', label: 'Cereals' },
    'fruits-and-vegetables-based-foods': { icon: '🥦', label: 'Fruits & Veg' },
    'meats': { icon: '🥩', label: 'Meats' },
    'fish-and-seafood': { icon: '🐟', label: 'Seafood' },
    'sauces-and-condiments': { icon: '🧂', label: 'Sauces' },
    'chocolates': { icon: '🍫', label: 'Chocolates' },
    'bread': { icon: '🍞', label: 'Bread' },
    'plant-based-foods': { icon: '🌱', label: 'Plant-Based' },
};

function SkeletonCard() {
    return (
        <div className="product-card skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="card-body">
                <div className="skeleton skeleton-line short"></div>
                <div className="skeleton skeleton-line tall"></div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '8px' }}>
                    <div className="skeleton" style={{ width: '40px', height: '22px', borderRadius: '4px' }}></div>
                    <div className="skeleton" style={{ width: '60px', height: '22px', borderRadius: '4px' }}></div>
                </div>
            </div>
            <div className="card-cta">
                <div className="skeleton skeleton-btn"></div>
                <div className="skeleton skeleton-btn"></div>
            </div>
        </div>
    );
}

export default function HomePage() {
    const [activeQuery, setActiveQuery] = useState({ mode: 'category', value: 'snacks' });
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [barcodeResult, setBarcodeResult] = useState(null);
    const [sortKey, setSortKey] = useState('default');
    const [gradeFilter, setGradeFilter] = useState('');
    const [activeCategory, setActiveCategory] = useState('snacks');

    const loadProducts = useCallback(async (query, pageNum, append = false) => {
        if (!append) setLoading(true); else setLoadingMore(true);
        setError(null); setBarcodeResult(null);
        try {
            let items = [], total = 1;
            if (query.mode === 'barcode') {
                const data = await fetchByBarcode(query.value);
                if (data.status === 1 && data.product) {
                    setBarcodeResult(normalizeProduct(data.product)); setProducts([]); return;
                }
                setError('No product found for this barcode.'); setProducts([]); return;
            } else if (query.mode === 'name') {
                const data = await searchByName(query.value, pageNum);
                items = (data.products || []).map(normalizeProduct).filter(p => p.name && p.name !== 'Unknown Product');
                total = Math.ceil((data.count || 0) / 24) || 1;
            } else {
                const data = await fetchByCategory(query.value, pageNum);
                items = (data.products || []).map(normalizeProduct).filter(p => p.name && p.name !== 'Unknown Product');
                total = data.page_count || Math.ceil((data.count || 0) / 24) || 10;
            }
            append ? setProducts(p => [...p, ...items]) : setProducts(items);
            setTotalPages(total);
        } catch { setError('Failed to load products. Please try again.'); }
        finally { setLoading(false); setLoadingMore(false); }
    }, []);

    useEffect(() => { loadProducts(activeQuery, 1, false); setPage(1); }, [activeQuery, loadProducts]);

    function handleSearch(mode, val) {
        setActiveQuery({ mode, value: val }); setActiveCategory('');
        setGradeFilter(''); setSortKey('default'); setPage(1);
    }

    function handleCategorySelect(cat) {
        const target = cat || 'snacks';
        setActiveCategory(cat);
        setActiveQuery({ mode: 'category', value: target });
        setGradeFilter(''); setSortKey('default'); setPage(1);
    }

    function handleClearAll() {
        setSortKey('default'); setGradeFilter('');
        setActiveCategory('snacks'); setActiveQuery({ mode: 'category', value: 'snacks' }); setPage(1);
    }

    function handleLoadMore() {
        const next = page + 1; setPage(next); loadProducts(activeQuery, next, true);
    }

    let display = gradeFilter
        ? products.filter(p => (p.nutritionGrade || '').toUpperCase() === gradeFilter)
        : products;
    display = sortKey === 'default' ? display : sortProducts(display, sortKey);

    const catLabel = activeCategory
        ? (CAT_META[activeCategory]?.label || activeCategory.replace(/-/g, ' '))
        : (activeQuery.mode === 'name' ? `Search: "${activeQuery.value}"` : 'All Products');

    const hasMore = page < totalPages && totalPages > 1;

    return (
        <>
            <Header
                onSearch={handleSearch}
                onCategorySelect={handleCategorySelect}
                activeCategory={activeCategory}
            />

            <div className="page-shell">

                {/* ── HERO SECTION ── */}
                <div className="hero-section animate-fade-in">
                    {/* Vertical category menu (desktop only) */}
                    <div className="hero-cat-menu">
                        <div className="hero-cat-menu-head">☰ Browse Categories</div>
                        {POPULAR_CATEGORIES.map(cat => (
                            <div
                                key={cat}
                                className={`hero-cat-menu-item ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => handleCategorySelect(cat)}
                            >
                                <span className="hero-cat-menu-icon">{CAT_META[cat]?.icon || '🍽'}</span>
                                {CAT_META[cat]?.label || cat.replace(/-/g, ' ')}
                            </div>
                        ))}
                    </div>

                    {/* Main hero banner */}
                    <div>
                        <div className="hero-banner-main">
                            <div className="hero-banner-left">
                                <div className="hero-eyebrow">🌿 OpenFoodFacts Powered</div>
                                <h1 className="hero-title">
                                    Explore <span>Millions</span> of<br />Food Products
                                </h1>
                                <p className="hero-sub">
                                    Search, filter by category, scan barcodes, and discover detailed
                                    nutritional information for smarter food choices.
                                </p>
                                <div className="hero-stats-row">
                                    <div className="hero-stat-card">
                                        <span className="hero-stat-num">3M+</span>
                                        <span className="hero-stat-label">Products</span>
                                    </div>
                                    <div className="hero-stat-card">
                                        <span className="hero-stat-num">12+</span>
                                        <span className="hero-stat-label">Categories</span>
                                    </div>
                                    <div className="hero-stat-card">
                                        <span className="hero-stat-num">A–E</span>
                                        <span className="hero-stat-label">Grades</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-banner-right">🛒</div>
                        </div>
                    </div>
                </div>

                {/* ── CATEGORY ICONS ── */}
                <div className="section animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="section-head">
                        <h2 className="section-title">Shop by Category</h2>
                    </div>
                    <div className="cat-icons-viewport">
                        <div className="cat-icons-row">
                            {[...POPULAR_CATEGORIES, ...POPULAR_CATEGORIES].map((cat, idx) => (
                                <div
                                    key={`${cat}-${idx}`}
                                    className={`cat-icon-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(cat)}
                                    id={`icon-cat-${cat}-${idx}`}
                                >
                                    <div className="cat-icon-circle">{CAT_META[cat]?.icon || '🍽'}</div>
                                    <span className="cat-icon-label">{CAT_META[cat]?.label || cat.replace(/-/g, ' ')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── PROMO BANNERS ── */}
                <div className="section animate-fade-in" style={{ animationDelay: '0.15s' }}>
                    <div className="promo-banners">
                        <div className="promo-banner promo-1" onClick={() => handleCategorySelect('fruits-and-vegetables-based-foods')}>
                            <div className="promo-text">
                                <div className="promo-tag">Fresh & Organic</div>
                                <div className="promo-title">Fruits &<br />Vegetables</div>
                                <button className="promo-btn">Shop Now →</button>
                            </div>
                            <div className="promo-emoji">🥦</div>
                        </div>
                        <div className="promo-banner promo-2" onClick={() => handleCategorySelect('beverages')}>
                            <div className="promo-text">
                                <div className="promo-tag">Stay Hydrated</div>
                                <div className="promo-title">Drinks &<br />Beverages</div>
                                <button className="promo-btn">Explore →</button>
                            </div>
                            <div className="promo-emoji">🥤</div>
                        </div>
                        <div className="promo-banner promo-3" onClick={() => handleCategorySelect('chocolates')}>
                            <div className="promo-text">
                                <div className="promo-tag">Treat Yourself</div>
                                <div className="promo-title">Chocolates &<br />Sweets</div>
                                <button className="promo-btn">View All →</button>
                            </div>
                            <div className="promo-emoji">🍫</div>
                        </div>
                    </div>
                </div>

                {/* ── SHOP LAYOUT ── */}
                <div className="section">
                    <div className="shop-layout">

                        {/* Filter sidebar */}
                        <aside className="filter-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="filter-panel-head">
                                <span className="filter-panel-title">⭐ Filters</span>
                                <button className="filter-panel-clear" onClick={handleClearAll} id="clear-filters">Clear All</button>
                            </div>

                            <div className="filter-group">
                                <div className="filter-group-title">Category</div>
                                <div className="filter-cat-list">
                                    {POPULAR_CATEGORIES.map(cat => (
                                        <div
                                            key={cat}
                                            className={`filter-cat-item ${activeCategory === cat ? 'active' : ''}`}
                                            onClick={() => handleCategorySelect(cat)}
                                            id={`sidebar-cat-${cat}`}
                                        >
                                            <span className="filter-cat-icon">{CAT_META[cat]?.icon || '🍽'}</span>
                                            {CAT_META[cat]?.label || cat.replace(/-/g, ' ')}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="filter-group-title">Nutrition Grade</div>
                                <div className="grade-filter">
                                    {['A', 'B', 'C', 'D', 'E'].map(g => (
                                        <button
                                            key={g}
                                            id={`grade-filter-${g}`}
                                            className={`grade-filter-btn gf-${g} ${gradeFilter === g ? 'active' : ''}`}
                                            onClick={() => setGradeFilter(gradeFilter === g ? '' : g)}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <div className="filter-group-title">Sort By</div>
                                <div className="sort-list">
                                    {SORTS.map(s => (
                                        <button
                                            key={s.key}
                                            className={`sort-item ${sortKey === s.key ? 'active' : ''}`}
                                            onClick={() => setSortKey(s.key)}
                                            id={`filter-sort-${s.key}`}
                                        >
                                            <div className="sort-radio" />
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Products Data */}
                        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="products-topbar">
                                <h2 className="products-topbar-title">{catLabel}</h2>
                                <span className="products-topbar-count">
                                    {display.length} product{display.length !== 1 ? 's' : ''}
                                    {activeQuery.mode !== 'barcode' && page > 1 && ` · page ${page}`}
                                </span>

                                <div className="sort-tabs">
                                    <span className="sort-tab-label">Sort:</span>
                                    {SORTS.map(s => (
                                        <button
                                            key={s.key}
                                            className={`sort-tab ${sortKey === s.key ? 'active' : ''}`}
                                            onClick={() => setSortKey(s.key)}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Barcode result */}
                            {barcodeResult && !loading && (
                                <div className="animate-fade-in">
                                    <div className="barcode-info">
                                        ✅ Found product for barcode <strong>{activeQuery.value}</strong>
                                    </div>
                                    <div className="product-grid">
                                        <ProductCard product={barcodeResult} />
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div className="empty-state animate-fade-in">
                                    <div className="empty-icon">⚠️</div>
                                    <h3 className="empty-title">Something went wrong</h3>
                                    <p className="empty-desc">{error}</p>
                                    <button className="load-more-btn default" style={{ marginTop: '1rem' }} onClick={() => loadProducts(activeQuery, 1)}>
                                        🔄 Retry
                                    </button>
                                </div>
                            )}

                            {/* Loading Skeletons */}
                            {loading && (
                                <div className="product-grid" style={{ animation: 'fade-in 0.3s' }}>
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            )}

                            {/* Grid */}
                            {!loading && !error && !barcodeResult && (
                                <>
                                    {display.length === 0 ? (
                                        <div className="empty-state animate-fade-in">
                                            <div className="empty-icon">🔍</div>
                                            <h3 className="empty-title">No products found</h3>
                                            <p className="empty-desc">Try a different search term or clear the active filters.</p>
                                            <button className="load-more-btn" onClick={handleClearAll} style={{ marginTop: '1rem' }}>
                                                Clear Filters
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="product-grid" id="product-grid">
                                            {display.map(p => <ProductCard key={p.id || Math.random()} product={p} />)}
                                        </div>
                                    )}

                                    {hasMore && display.length > 0 && (
                                        <div className="load-more-wrap">
                                            <button
                                                id="load-more-btn"
                                                className="load-more-btn"
                                                onClick={handleLoadMore}
                                                disabled={loadingMore}
                                            >
                                                {loadingMore ? (
                                                    <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Loading…</>
                                                ) : `Load More — Page ${page + 1}`}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <span className="footer-brand">🔬 FoodScope</span>
                    <span className="footer-copy">Data from OpenFoodFacts · Open Database License (ODBL)</span>
                    <div className="footer-links">
                        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" className="footer-link">OpenFoodFacts API</a>
                        <a href="#" className="footer-link">↑ Back to Top</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
