import React from "react";
import { Nav, NavLink, NavMenu, Bars, SearchIcon, ReadMe, User, Toolbox } from "./NavbarElements";
import logo from './BBLogoTransparent.png';

const Navbar = () => {
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
                  Account
               </NavLink>
            </NavMenu>
         </Nav>
      </>
   );
};

export default Navbar;