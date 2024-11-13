import React from 'react';
import { Routes, Route} from 'react-router-dom';
import CreateProcess from './create-process/create-process';
import NewBatchFish from './new-batch/new-batch';
import ViewSummary from './view-summary/view-summary.';

const ProcessNavigations = () => {
    
  return (
    <Routes>
      <Route path='create-process' element={<CreateProcess/>}/>
       <Route path='new-batch' element={<NewBatchFish/>}/> 
       <Route path='view-summary' element={<ViewSummary/>}/> 
    </Routes>
  );
};

export default ProcessNavigations;
