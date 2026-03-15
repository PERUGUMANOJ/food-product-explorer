import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Navbar';
import ProductDetailClient from '@/components/ProductDetailClient';
import { fetchByBarcode, normalizeProduct } from '@/lib/api';

export async function generateMetadata({ params }) {
    const { id } = await params;
    return { title: `Product Details – FoodScope` };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    let product = null;
    let error = null;

    try {
        const data = await fetchByBarcode(decodedId);
        if (data.status === 1 && data.product) {
            product = normalizeProduct(data.product);
            product._raw = data.product;
        } else {
            error = 'Product not found in the database.';
        }
    } catch {
        error = 'Failed to load product. Please try again.';
    }

    return (
        <CartProvider>
            <Header />
            <ProductDetailClient product={product} error={error} rawId={decodedId} />
        </CartProvider>
    );
}
