import React from "react";
import logo from '../components/Navbar/BBLogoTransparent.png';

const Home = () => {
   return (
      <div>
         <img src={logo} alt="logo" height="350" width="350"/>
         <h1>
            Welcome to BrainBox!
         </h1>
      </div>
   );
};

export default Home;