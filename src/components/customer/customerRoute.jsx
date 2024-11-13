import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AddCustomer from './add/add';
import ViewAll from './view-all/view-all';
import CustomerLedger from './ledger/ledger';
const CustomerNavigations = () => {
    
  return (
    <Routes>
      <Route path='add' element={<AddCustomer/>}/>
      <Route path='view-all' element={<ViewAll/>}/>
      <Route path='ledger' element={<CustomerLedger/>}/>
    </Routes>
  );
};

export default CustomerNavigations;
