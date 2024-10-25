import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AddNew from './add-new-admin/add-new';
import ViewAll from './view-all/view-all';

const AdminNavigations = () => {
    
  return (
    <Routes>
      <Route path='add-new-admin' element={<AddNew/>}/>
      <Route path='view-all' element={<ViewAll/>}/>
    </Routes>
  );
};

export default AdminNavigations;
