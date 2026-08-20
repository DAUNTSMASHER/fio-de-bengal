import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import ProductionProcess from '../components/ProductionProcess';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <ProductGrid limit={3} />
      <ProductionProcess />
    </div>
  );
};

export default HomePage;
