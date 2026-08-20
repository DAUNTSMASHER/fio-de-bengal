import React, { useEffect } from 'react';
import ProductGrid from '../components/ProductGrid';

const ProductsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-layout texture-bengal-wave" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <ProductGrid title="Full Wholesale Collection" />
    </div>
  );
};

export default ProductsPage;
