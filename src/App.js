import React from "react";
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Home from './pages';
import About from './pages/about';
import Create from './pages/create';
import Account from './pages/account';
import Search from './pages/search';
import Footer from './components/Footer/footer.jsx';

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar />
      <div className='wrapper'>
        <div className='content'>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/about' element={<About />} />
            <Route exact path='/search' element={<Search />} />
            <Route exact path='/create' element={<Create />} />
            <Route exact path='/account' element={<Account />} />
          </Routes>
        </div>
      </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
