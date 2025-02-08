import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CompanySignUp from './pages/CompanySignUp';
import StudentSignUp from './pages/StudentSignUp';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="main-container">
        <h1>Welcome to CareerCrush.com</h1>
        <p>Get started - it's free. One swipe away from your dream job</p>
        <div className="button-container">
          <Link to="/company-signup" className="button">
            Company
          </Link>
          <Link to="/student-signup" className="button">
            Student
          </Link>
        </div>
      </div>

      <Routes>
        <Route path="/company-signup" element={<CompanySignUp />} />
        <Route path="/student-signup" element={<StudentSignUp />} />
      </Routes>
    </Router>
  );

}

export default App
