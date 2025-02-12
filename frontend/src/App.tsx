import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
import './App.css'
import './index.css'
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import Home from './pages/home.tsx';
// import GApp from './pages/googleLogin.tsx';

const App: React.FC = () => {
     {
      return (
        

         <Router>
            <Routes>
                <Route path="" element={<SignUp />} />            
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp/>}/>
                <Route path="/home" element={<Home/>}/>
                {/* <Route path="/logout" element={<Login/>}/> */}
              
            </Routes>
          </Router>
        
        
      )}}

export default App;