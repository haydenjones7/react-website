import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { FaReadme } from "react-icons/fa";
//import { FaSignInAlt } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { FaToolbox } from "react-icons/fa";


export const Nav = styled.nav`
   background: #A1D2C4;
   height: 4rem;
   display: flex;
   font-size: 1.25rem;
   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
   font-weight: bold;
   justify-content: space-between;
   padding: 0.2rem calc((100vw - 1000px) / 2);
   z-index: 12;
`;

export const NavLink = styled(Link)`
   color: #2B625B;
   display: flex;
   align-items: center;
   text-decoration: none;
   padding: 0 1rem;
   height: 2rem;
   cursor: pointer;
   &.active {
      color: black;
   }
   &:hover {
      background: #eeb7b3;
   }
`;


export const Bars = styled(FaBars)`
   display: flex;
   color: #2B625B;
   @media screen and (max-width: 768px) {
      display: flex;
   }
`;

export const SearchIcon = styled(FaSearch)`
   display: flex;
   color: #2B625B;
   @media screen and (max-width: 768px) {
      display: flex;
   }
`;

export const ReadMe = styled(FaReadme)`
   display: flex;
   color: #2B625B;
   @media screen and (max-width: 768px) {
      display: flex;
   }
`;

// export const Signin = styled(FaSignInAlt)`
//    display: flex;
//    color: #2B625B;
//    @media screen and (max-width: 768px) {
//       display: flex;
//    }
// `;

export const User = styled(FaUserAlt)`
   display: flex;
   color: #2B625B;
   @media screen and (max-width: 768px) {
      display: flex;
   }
`;

export const Toolbox = styled(FaToolbox)`
   display: flex;
   color: #2B625B;
   @media screen and (max-width: 768px) {
      display: flex;
   }
`;

export const NavMenu = styled.div`
   display: flex;
   align-items: center;
   /* Second Nav */
   /* margin-right: 24px; */
   /* Third Nav */
   /* width: 100vw; */
   /* white-space: 100vw; */
   @media screen and (max-width: 768px) {
      display: flex;
      font-size: 10px;
   }
`;