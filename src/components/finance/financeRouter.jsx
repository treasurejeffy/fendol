import React from 'react';
import { Routes, Route} from 'react-router-dom';
import AddSales from './add-sales/add-sales';
import AddExpense from './add-expenses/add-expenses';
import FinanceLedger from './ledger/finance-ledger';
import AddSalary from './staff-salary/staff-salary';

const FinanceNavigations = () => {
    
  return (
    <Routes>
      <Route path='add-sales' element={<AddSales/>}/>
      <Route path='add-expenses' element={<AddExpense/>}/>
      <Route path='staff-salary' element={<AddSalary/>}/>
      <Route path='ledger' element={<FinanceLedger/>}/>
    </Routes>
  );
};

export default FinanceNavigations;
