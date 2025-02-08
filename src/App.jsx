import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CompanySignUp from './pages/CompanySignUp';
import StudentSignUp from './pages/StudentSignUp';
import Home from './components/Home';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <div className="main-container bg-main">
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company-signup" element={<CompanySignUp />} />
        <Route path="/student-signup" element={<StudentSignUp />} />
      </Routes>
      </div>
    </Router>
  );

}

export default App
