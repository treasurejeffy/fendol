import React from 'react';
import { Routes, Route} from 'react-router-dom';
import CreateProducts from './create-products/create-products';

const ProductNavigations = () => {
    
  return (
    <Routes>
      <Route path='create-products' element={<CreateProducts/>}/>
    </Routes>
  );
};

export default ProductNavigations;
