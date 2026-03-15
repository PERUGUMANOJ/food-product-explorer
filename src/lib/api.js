/**
 * OpenFoodFacts API helpers
 */

const BASE_URL = 'https://world.openfoodfacts.org';

/** Fetch products by category */
export async function fetchByCategory(category, page = 1) {
    const encodedCat = encodeURIComponent(category);
    const url = `${BASE_URL}/category/${encodedCat}.json?page=${page}&page_size=24`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch category products');
    return res.json();
}

/** Search products by name */
export async function searchByName(query, page = 1) {
    const url = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page=${page}&page_size=24&action=process`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to search products');
    return res.json();
}

/** Get product by barcode */
export async function fetchByBarcode(barcode) {
    const url = `${BASE_URL}/api/v0/product/${barcode}.json`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

/** Fetch categories list */
export async function fetchCategories() {
    const url = `${BASE_URL}/categories.json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

/** Normalize a product object from various API responses */
export function normalizeProduct(p) {
    return {
        id: p._id || p.id || p.code || '',
        name: p.product_name || p.product_name_en || 'Unknown Product',
        image: p.image_url || p.image_front_url || p.image_front_small_url || null,
        category: extractCategory(p),
        ingredients: p.ingredients_text || p.ingredients_text_en || '',
        nutritionGrade: p.nutrition_grade_fr || p.nutrition_grades || null,
        labels: p.labels_tags || [],
        nutriments: p.nutriments || {},
        brands: p.brands || '',
        quantity: p.quantity || '',
        code: p.code || p._id || '',
    };
}

function extractCategory(p) {
    const cats = p.categories_tags || p.categories || [];
    if (Array.isArray(cats) && cats.length > 0) {
        const cleaned = cats[0].replace(/^en:/, '').replace(/-/g, ' ');
        return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    if (typeof cats === 'string' && cats) {
        const first = cats.split(',')[0].trim();
        return first.replace(/^en:/, '').replace(/-/g, ' ');
    }
    return 'Uncategorized';
}

/** Sort products client-side */
export function sortProducts(products, sortKey) {
    const arr = [...products];
    switch (sortKey) {
        case 'name_asc':
            return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        case 'name_desc':
            return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        case 'grade_asc':
            return arr.sort((a, b) => gradeVal(a.nutritionGrade) - gradeVal(b.nutritionGrade));
        case 'grade_desc':
            return arr.sort((a, b) => gradeVal(b.nutritionGrade) - gradeVal(a.nutritionGrade));
        default:
            return arr;
    }
}

function gradeVal(g) {
    const order = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    return order[(g || '').toLowerCase()] || 6;
}

export const POPULAR_CATEGORIES = [
    'beverages',
    'dairy products',
    'snacks',
    'biscuits-and-cakes',
    'cereals-and-potatoes',
    'fruits-and-vegetables-based-foods',
    'meats',
    'fish-and-seafood',
    'sauces-and-condiments',
    'chocolates',
    'bread',
    'plant-based-foods',
];
