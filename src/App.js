import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Create from './pages/create';
import SignUp from './pages/signup';
import Search from './pages/search';

function App() {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/about' element={<About />} />
      <Route exact path='/search' element={<Search />} />
      <Route exact path='/create' element={<Create />} />
      <Route exact path='/sign-up' element={<SignUp />} />
    </Routes>
    </Router>
  );
}

export default App;
