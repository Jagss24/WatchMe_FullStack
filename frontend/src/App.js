import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import Signup from "./components/Singup";
import { ForGotPassword } from "./components";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Home />}></Route>
        <Route path="/login/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgotPassword" element={<ForGotPassword />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
