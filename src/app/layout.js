import { Inter } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'FoodScope – Food Product Explorer',
  description: 'Discover, search, and explore food products using OpenFoodFacts data. Filter by category, sort by nutrition grade, and make informed food choices.',
  keywords: 'food, nutrition, ingredients, OpenFoodFacts, products, health',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
