import React from 'react';
import { Routes, Route} from 'react-router-dom';
import CreateStages from './create/create-stages';
import AddSpecies from './create-fish-type/create-fish-type';
import ViewAllStages from './view-all-ponds/view-all-stages';
import AddFish from './add-fish/add-fish';
import MoveFish from './move-fish/move-fish';
import ViewAddFishHistory from './view-add-fish-history/view-add-fish-history';
import ViewMoveFishHistory from './view-move-fish-history/view-move-fish-history';

const ProductStagesNavigations = () => {
    
  return (
    <Routes>
      <Route path='create' element={<CreateStages/>}/>
      <Route path='view-all-ponds' element={<ViewAllStages/>}/>      
      <Route path='create-fish-type' element={<AddSpecies/>}/>      
      <Route path='add-fish' element={<AddFish/>}/>
      <Route path='move-fish' element={<MoveFish/>}/>
      <Route path='view-add-fish-history' element={<ViewAddFishHistory/>}/>
      <Route path='view-move-fish-history' element={<ViewMoveFishHistory/>}/>
    </Routes>
  );
};

export default ProductStagesNavigations;
