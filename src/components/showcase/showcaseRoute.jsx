import React from 'react';
import { Routes, Route} from 'react-router-dom';
import ViewBorkenHistory from './broken-showcase/broken-showcase';
import ViewWholeHistory from './whole-showcase/whole-showcase';
import AddNew from './add-new/add-new';

const ShowcaseNavigations = () => {
    
  return (
    <Routes>
      <Route path='broken-showcase' element={<ViewBorkenHistory/>}/>
      <Route path='whole-showcase' element={<ViewWholeHistory/>}/>
      <Route path='add-new' element={<AddNew/>}/>
    </Routes>
  );
};

export default ShowcaseNavigations;
