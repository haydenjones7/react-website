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
import CreateMC from './components/CreateGames/createMC';
import CreateSA from "./components/CreateGames/createSA";
import CreatePR from "./components/CreateGames/createPR";
import UserGames from "./pages/userGames";
import Join from "./pages/join";


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
            <Route exact path='/create' element={<Create />}/>
            <Route exact path='/account' element={<Account />} />
            <Route exact path='/createMC' element={<CreateMC />}/>
            <Route exact path='/createSA' element={<CreateSA />}/>
            <Route exact path='/createPR' element={<CreatePR />}/>
            <Route exact path='/myGames' element={<UserGames />}/>
            <Route exact path='/join' element={<Join />}/>
          </Routes>
        </div>
      </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
