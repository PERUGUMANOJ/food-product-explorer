'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const NUTRIMENTS = [
    { key: 'energy-kcal_100g', label: 'Energy', unit: 'kcal' },
    { key: 'energy_100g', label: 'Energy (kJ)', unit: 'kJ' },
    { key: 'fat_100g', label: 'Fat', unit: 'g' },
    { key: 'saturated-fat_100g', label: 'Saturated Fat', unit: 'g' },
    { key: 'carbohydrates_100g', label: 'Carbohydrates', unit: 'g' },
    { key: 'sugars_100g', label: 'Sugars', unit: 'g' },
    { key: 'fiber_100g', label: 'Dietary Fibre', unit: 'g' },
    { key: 'proteins_100g', label: 'Proteins', unit: 'g' },
    { key: 'salt_100g', label: 'Salt', unit: 'g' },
    { key: 'sodium_100g', label: 'Sodium', unit: 'g' },
];

const GRADE_INFO = {
    a: { label: 'Excellent', css: 'gA', color: '#10b981' },
    b: { label: 'Good', css: 'gB', color: '#84cc16' },
    c: { label: 'Average', css: 'gC', color: '#f59e0b' },
    d: { label: 'Poor', css: 'gD', color: '#f97316' },
    e: { label: 'Bad', css: 'gE', color: '#ef4444' },
};

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

function Stars({ rating }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
        <span className="stars" style={{ fontSize: '1.25rem', letterSpacing: '-1px' }}>
            {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
        </span>
    );
}

export default function ProductDetailClient({ product, error, rawId }) {
    const { addItem, removeItem, isInCart } = useCart();

    if (error || !product) {
        return (
            <div className="detail-shell animate-fade-in">
                <div className="breadcrumb">
                    <Link href="/">Home</Link>
                    <span className="breadcrumb-sep">/</span>
                    <span>Not Found</span>
                </div>
                <div className="empty-state" style={{ minHeight: 400 }}>
                    <div className="empty-icon">😕</div>
                    <h2 className="empty-title">Product Not Found</h2>
                    <p className="empty-desc">{error || 'This product could not be loaded.'}</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>ID: {rawId}</p>
                    <Link href="/" style={{ marginTop: '1rem', color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600, fontSize: '0.9rem' }}>
                        ← Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

    const inCart = isInCart(product.id);
    const raw = product._raw || {};
    const gradeKey = (product.nutritionGrade || '').toLowerCase();
    const gradeInfo = GRADE_INFO[gradeKey];
    const rating = parseFloat(pseudoRating(product.name));
    const reviews = pseudoReviews(product.name);

    const labels = (product.labels || []).map(l => l.replace(/^en:/, '').replace(/-/g, ' '));
    const allergens = (raw.allergens_tags || []).map(l => l.replace(/^en:/, '').replace(/-/g, ' '));
    const additives = (raw.additives_tags || []).map(l => l.replace(/^en:en:/, '').replace(/^en:/, ''));
    const nutriments = product.nutriments || {};
    const hasNutrition = NUTRIMENTS.some(({ key }) => nutriments[key] != null);

    const gradeRibbonCss = { a: 'gr-A', b: 'gr-B', c: 'gr-C', d: 'gr-D', e: 'gr-E' };

    // Calculate percentage of daily recommended for progress bars (approximate values for 100g purely for UI illustration)
    const energyPct = Math.min(100, Math.round(((nutriments['energy-kcal_100g'] || 0) / 2000) * 100)) + '%';
    const carbsPct = Math.min(100, Math.round(((nutriments['carbohydrates_100g'] || 0) / 260) * 100)) + '%';
    const fatPct = Math.min(100, Math.round(((nutriments['fat_100g'] || 0) / 70) * 100)) + '%';
    const proteinPct = Math.min(100, Math.round(((nutriments['proteins_100g'] || 0) / 50) * 100)) + '%';

    return (
        <div className="detail-shell animate-fade-in">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/">Home</Link>
                <span className="breadcrumb-sep">/</span>
                {product.category && (
                    <>
                        <Link href="/">{product.category}</Link>
                        <span className="breadcrumb-sep">/</span>
                    </>
                )}
                <span style={{ color: 'var(--text-1)', fontWeight: 600, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                </span>
            </div>

            <div className="detail-grid">
                {/* ── Left: Image Panel ── */}
                <div className="detail-img-panel animate-fade-in">
                    <div className="detail-img-main" style={{ backgroundColor: 'var(--bg)' }}>
                        {product.nutritionGrade && (
                            <span className={`detail-grade-tag ${gradeRibbonCss[gradeKey] || 'gr-N'}`}>
                                Grade {product.nutritionGrade.toUpperCase()}
                            </span>
                        )}
                        {product.image ? (
                            <img src={product.image} alt={product.name}
                                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <div className="detail-img-placeholder"
                            style={{ display: product.image ? 'none' : 'flex', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                            🥫
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button
                            id="detail-cart-btn"
                            className={`btn-large ${inCart ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => inCart ? removeItem(product.id) : addItem(product)}
                        >
                            {inCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
                        </button>
                        <button className="btn-large" style={{ background: 'var(--bg)', color: 'var(--text-1)', border: '1px solid var(--border)' }}>
                            🤍 Add to Wishlist
                        </button>
                    </div>
                </div>

                {/* ── Right: Info ── */}
                <div className="detail-info-panel animate-fade-in" style={{ animationDelay: '0.1s' }}>

                    <div className="detail-header">
                        {product.category && <div className="detail-cat">{product.category}</div>}
                        <h1 className="detail-title">{product.name}</h1>
                        {product.brands && <div className="detail-brand">by {product.brands} · {product.quantity || 'Unknown size'}</div>}

                        <div className="rating-row">
                            <div className="big-rating">
                                <Stars rating={rating} />
                                <span>{rating}</span>
                            </div>
                            <span style={{ fontSize: '.9rem', color: 'var(--text-3)' }}>({reviews.toLocaleString()} reviews)</span>

                            {gradeInfo && (
                                <div className={`detail-grade-pill ${gradeInfo.css}`} style={{ marginLeft: '1rem' }}>
                                    <span style={{ fontWeight: 800 }}>Grade {product.nutritionGrade.toUpperCase()}</span>
                                    <span style={{ fontSize: '.8rem', opacity: .8 }}>— {gradeInfo.label}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Highlights */}
                        <div className="dashboard-card">
                            <h3 className="dashboard-title">📋 Specifications</h3>
                            <table className="highlight-table">
                                <tbody>
                                    {[
                                        ['Brand', product.brands || '—'],
                                        ['Category', product.category || '—'],
                                        ['Quantity', product.quantity || '—'],
                                        ['Barcode', <span style={{ fontFamily: 'monospace' }} key="bc">{product.code}</span> || '—'],
                                    ].map(([k, v]) => (
                                        <tr key={k}>
                                            <td>{k}</td>
                                            <td>{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Ingredients Typography */}
                        {product.ingredients && (
                            <div className="dashboard-card">
                                <h3 className="dashboard-title">🧪 Ingredients</h3>
                                <p className="ingr-text">{product.ingredients}</p>
                            </div>
                        )}

                        {/* Nutritional Dashboard */}
                        <div className="dashboard-card">
                            <h3 className="dashboard-title">📊 Nutritional Dashboard (per 100g)</h3>

                            {hasNutrition ? (
                                <div className="nutr-bars">
                                    <div className="nutr-bar-item">
                                        <div className="nutr-bar-top">
                                            <span>Energy {nutriments['energy-kcal_100g'] ? `(${nutriments['energy-kcal_100g']} kcal)` : ''}</span>
                                            <span style={{ color: 'var(--gc)' }}>{energyPct}</span>
                                        </div>
                                        <div className="nutr-bar-track">
                                            <div className="nutr-bar-fill fill-energy" style={{ width: energyPct }}></div>
                                        </div>
                                    </div>

                                    <div className="nutr-bar-item">
                                        <div className="nutr-bar-top">
                                            <span>Carbohydrates {nutriments['carbohydrates_100g'] ? `(${nutriments['carbohydrates_100g']} g)` : ''}</span>
                                            <span style={{ color: 'var(--gb)' }}>{carbsPct}</span>
                                        </div>
                                        <div className="nutr-bar-track">
                                            <div className="nutr-bar-fill fill-carbs" style={{ width: carbsPct }}></div>
                                        </div>
                                    </div>

                                    <div className="nutr-bar-item">
                                        <div className="nutr-bar-top">
                                            <span>Proteins {nutriments['proteins_100g'] ? `(${nutriments['proteins_100g']} g)` : ''}</span>
                                            <span style={{ color: 'var(--lg)' }}>{proteinPct}</span>
                                        </div>
                                        <div className="nutr-bar-track">
                                            <div className="nutr-bar-fill fill-protein" style={{ width: proteinPct }}></div>
                                        </div>
                                    </div>

                                    <div className="nutr-bar-item">
                                        <div className="nutr-bar-top">
                                            <span>Fat {nutriments['fat_100g'] ? `(${nutriments['fat_100g']} g)` : ''}</span>
                                            <span style={{ color: 'var(--ge)' }}>{fatPct}</span>
                                        </div>
                                        <div className="nutr-bar-track">
                                            <div className="nutr-bar-fill fill-fat" style={{ width: fatPct }}></div>
                                        </div>
                                    </div>

                                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

                                    <div className="nutrition-grid">
                                        {NUTRIMENTS.map(({ key, label, unit }) => {
                                            const val = nutriments[key];
                                            if (val == null) return null;
                                            return (
                                                <div key={key} className="nutrition-row">
                                                    <span className="nutr-label">{label}</span>
                                                    <span className="nutr-val">{typeof val === 'number' ? val.toFixed(2) : val} {unit}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-3)', fontSize: '1rem' }}>No nutritional data available.</p>
                            )}
                        </div>

                        {/* Labels & Tags */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {labels.length > 0 && (
                                <div>
                                    <h4 style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase' }}>🏷️ Labels</h4>
                                    <div className="chip-row">
                                        {labels.map((l, i) => <span key={i} className="chip chip-blue">{l}</span>)}
                                    </div>
                                </div>
                            )}

                            {allergens.length > 0 && (
                                <div style={{ marginTop: '1rem' }}>
                                    <h4 style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: '.5rem', textTransform: 'uppercase' }}>⚠️ Allergens</h4>
                                    <div className="chip-row">
                                        {allergens.map((l, i) => <span key={i} className="chip chip-red">{l}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer" style={{ marginTop: '4rem', marginLeft: '-1.25rem', marginRight: '-1.25rem', width: 'calc(100% + 2.5rem)' }}>
                <div className="footer-inner">
                    <span className="footer-brand">🔬 FoodScope</span>
                    <span className="footer-copy">Data by OpenFoodFacts</span>
                    <div className="footer-links">
                        <a href="https://world.openfoodfacts.org" target="_blank" rel="noreferrer" className="footer-link">OpenFoodFacts</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
