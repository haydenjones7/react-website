import React from "react";
import { Nav, NavLink, NavMenu, Bars, SearchIcon, ReadMe, Signin, User, Toolbox } from "./NavbarElements";
import logo from './BBLogoZoom.jpg';

const Navbar = () => {
   return (
      <>
         <Nav>
            <NavMenu>
               <img src={logo} alt="logo" height="75" width="75"/>
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
               <NavLink to="/tutorial" activeStyle>
                  <Toolbox/>
                  Tutorial
               </NavLink>
               <NavLink to="/sign-up" activeStyle>
                  <Signin/>
                  Sign up/ Sign in
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