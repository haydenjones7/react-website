import React from "react";
import logo from '../components/Navbar/BBLogoTransparent.png';
import {Title} from '../styles/PageElements.js';


const Home = () => {
   return (
      <div>
         <img src={logo} alt="logo" height="350" width="350"/>
         <Title>
            Welcome to BrainBox!
         </Title>
      </div>
   );
};

export default Home;