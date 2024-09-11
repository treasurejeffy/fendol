import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AdminNavigations from './admin/adminRoutes';

const SuperAdmin = () => {
    
  return (
    <Routes>
      <Route path='admin/*' element={<AdminNavigations/>}/>
    </Routes>
  );
};

export default SuperAdmin;
