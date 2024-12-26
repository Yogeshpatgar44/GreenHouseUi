import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ControlPanel from "./components/ControlPanel";
import PlantHealth from "./components/PlantHealth";
import PlantClassification from './components/PlantClassification';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/control-panel" element={<PrivateRoute><ControlPanel /></PrivateRoute>} />
        <Route path="/plant-health" element={<PrivateRoute><PlantHealth /></PrivateRoute>} />
        <Route path="/plant-classification" element={<PlantClassification />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      </Routes>
      <ToastContainer />
    </Router>
  );
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

export default App;
