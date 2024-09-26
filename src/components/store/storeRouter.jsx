import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AddStock from './add-new/add-new';
import UpdateInventory from './update-inventory/update-inventory';
import InventoryHistory from './inventory-history/inventory-history';

const StoreNavigations = () => {
    
  return (
    <Routes>
      <Route path='add-new' element={<AddStock/>}/>
      <Route path='update-inventory' element={<UpdateInventory/>}/>
      <Route path='inventory-history' element={<InventoryHistory/>}/>
    </Routes>
  );
};

export default StoreNavigations;
