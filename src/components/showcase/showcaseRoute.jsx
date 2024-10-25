import React from 'react';
import { Routes, Route} from 'react-router-dom';
import ViewBorkenHistory from './broken-showcase/broken-showcase';

const ShowcaseNavigations = () => {
    
  return (
    <Routes>
      <Route path='broken-showcase' element={<ViewBorkenHistory/>}/>
    </Routes>
  );
};

export default ShowcaseNavigations;
