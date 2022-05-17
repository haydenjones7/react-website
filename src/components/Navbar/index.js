import React from "react";
import { useState } from "react";
import { Nav, NavLink, NavMenu, Bars, SearchIcon, ReadMe, User, Toolbox } from "./NavbarElements";
import logo from './BBLogoTransparent.png';

import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const Navbar = () => {
   const [user, setUser] = useState({});
   const [username, setUsername] = useState("Make Account");
   //const [signedIn, setSignedIn] = useState(false);
 
   onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
     if(!currentUser) {
       setUsername("Make Account");
       //setSignedIn(false);
     } else {
        if(user?.displayName) {
         setUsername(user?.displayName);
        } else {
           setUsername("User");
        }
       //setSignedIn(true);
     }
   });

   return (
      <>
         <Nav>
            <NavMenu>
               <img src={logo} alt="logo" height="65" width="65"/>
               <NavLink to="" activeStyle>
                  <Bars/> 
                  Home
               </NavLink>
               <NavLink to="/about" activeStyle>
                  <ReadMe/>
                  About
               </NavLink>
               <NavLink to="/search" activeStyle>
                  <SearchIcon/>
                  Search
               </NavLink>
               <NavLink to="/create" activeStyle>
                  <Toolbox/>
                  Create
               </NavLink>
               <NavLink to="/account" activeStyle>
                  <User/>
                  {username}
               </NavLink>
            </NavMenu>
         </Nav>
      </>
   );
};

export default Navbar;