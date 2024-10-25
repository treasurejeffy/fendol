import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./shared/login/login";
import ProtectedRoute from "./protect-routes";
import { Provider } from "react-redux";
import store from "./shared/reduxForProtectingRoute/store";
import AdminNavigations from "./admin/adminRoutes";
import FeedNavigations from "./feed/feedRouter";
import ProductNavigations from "./products/productRouter";
import ProductStagesNavigations from "./product-stages/productStagesRouter";
import StoreNavigations from "./store/storeRouter";
import FinanceNavigations from "./finance/financeRouter";
import ShowcaseNavigations from "./showcase/showcaseRoute";
import { ToastContainer } from 'react-toastify';

export default function RouterSwitch() {
  return (
    <Provider store={store}>
      <Router>
      <ToastContainer />
        <Routes>
            < Route path="/" element={<LogIn/>}/>                       
            <Route path='admin/*' element={<ProtectedRoute><AdminNavigations/></ProtectedRoute> }/>
            <Route path='product-stages/*' element={<ProtectedRoute><ProductStagesNavigations/></ProtectedRoute>}/>
            <Route path='products/*' element={<ProtectedRoute><ProductNavigations/></ProtectedRoute> }/>
            <Route path='feed/*' element={<ProtectedRoute><FeedNavigations/></ProtectedRoute>}/>      
            <Route path='store/*' element={<ProtectedRoute><StoreNavigations/></ProtectedRoute>}/>
            <Route path='finance/*' element={<ProtectedRoute><FinanceNavigations/></ProtectedRoute>}/>            
            <Route path='showcase*' element={<ProtectedRoute><ShowcaseNavigations/></ProtectedRoute>}/>            
        </Routes>
      </Router>
    </Provider>
  );
}
