import React, { useState } from 'react';
import './App.css';
import { 
  BrowserRouter as Router, Routes, 
  Route
} from "react-router-dom";
import ModelingPage from "./Pages/ModelingPage";
import Button from "./components/Button";
import HomePage from "./Pages/HomePage";
import AnalysisPage from "./Pages/AnalysisPage"



const App = () => { 
  return ( 
      <div className="app"> 
      <header>Parking Tracker</header>
          <Router> 
            <nav>
              <Button to="" /> 
              <Button to="3DModel" />
              <Button to="AnalysisPage" />
            </nav>

              <Routes> 
                  <Route path="/" element={<HomePage />} /> 
                  <Route path="/3DModel"
                    element={<ModelingPage />} /> 
                  <Route path="/AnalysisPage"
                    element={<AnalysisPage />} /> 
              </Routes> 
          </Router> 
        <style>
        </style>
      </div> 

  ) 
} 

export default App;

