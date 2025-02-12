import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
import './App.css'
import './index.css'
import Login from './pages/Login.tsx';
import SignUp from './pages/SignUp.tsx';
import Home from './pages/home.tsx';
import Profile from './components/profile.tsx';
// import GApp from './pages/googleLogin.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import PendingRequests from './components/Requests.tsx';

const App: React.FC = () => {
     {

      return (
        

         <Router>
            <Routes>
                <Route path="" element={<SignUp />} />            
                <Route path="/Login" element={<Login />} />
                <Route path="/SignUp" element={<SignUp/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/request" element={<PendingRequests />} />
          <Route path="/home/*" element={<Home />} />
        
        {/* <Route path="*" element={<Navigate to="/login" />} />     */}
            </Routes>
          </Router>
        
        
      )}}

export default App;