import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdmin from "./super-admin/superAdminRoute";
import LogIn from "./shared/login/login";

export default function RouterSwitch() {
  return (
      <Router>
        <Routes>
          < Route path="/" element={<LogIn/>}/>
          <Route path="/super-admin/*" element={<SuperAdmin/>} />
        </Routes>
      </Router>
  );
}
