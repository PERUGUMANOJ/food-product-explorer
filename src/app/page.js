import { CartProvider } from '@/context/CartContext';
import HomePage from '@/components/HomePage';

export const metadata = {
  title: 'FoodScope – Food Product Explorer',
  description: 'Search and explore millions of food products. Filter by category, check nutrition grades, and make smarter food choices.',
};

export default function Page() {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  );
}
