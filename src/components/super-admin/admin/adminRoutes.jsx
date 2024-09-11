import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AddNew from './add-new-admin/add-new';

const AdminNavigations = () => {
    
  return (
    <Routes>
      <Route path='add-new-admin' element={<AddNew/>}/>
    </Routes>
  );
};

export default AdminNavigations;
