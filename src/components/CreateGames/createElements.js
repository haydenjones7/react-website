import styled from "styled-components";
import { Link } from 'react-router-dom';

export const Wrapper = styled.section`
   background-color: #eeb7b3;
   height: 100%;
   width: 500px;
   padding: 5px;
   border: 4px solid #b3eaee;
   display: flex;
   flex-direction: column;
   text-align: center;
   align-items: center;
`;

export const List = styled.ul`
   color: #e01c74;
   justify-content: left;
   text-align: left;
   font-size: 25px;
`;

export const CreateHeading = styled.h2`
   color: #e07c74;
  font-size: 30px;
`;

export const CreateInput = styled.input`
   width: 50%;
  height: 40px;
  margin: 3px;
  border: 4px solid #e07c74;
  border-radius: 5px;
  padding: 5px;
  font-size: 16px;
  margin-bottom: 20px;
`;

export const CreateButton = styled.button`
   width: 100px;
  height: 40px;
  font-size: 20px;
  color: #ffffff;
  background-color: #e58f89;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  border: 4px solid #d7544a;
  cursor: pointer;
  margin-bottom: 20px;
  &:hover {
     background-color: #b3635c;
  }
`;

export const ButtonLink = styled(Link)`
   color: #ffffff;
   text-decoration: none;
`;

export const DropDown = styled.select`
   background-color: #e58f89;
   color: #ffffff;
   margin-bottom: 10px;
   border: 2px solid #d7544a;
   border-radius: 5px;
   font-size: 15px;
   padding: 3px;
`;
