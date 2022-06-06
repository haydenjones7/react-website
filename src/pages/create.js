import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { auth } from '../firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { Title, Heading, Button, Text } from '../styles/PageElements';
import { Link } from 'react-router-dom';

import Login from "./login.js";

const Wrapper = styled.section`
   display: flex;
   flex-direction: column;
   text-align: center;
   align-items: center;
`;
const PinkButton = styled(Button)`
   background-color: #e58f89;
   color: #ffffff;
   width: 65%;
   height: 50px;
   font-size: 25px;
   border-radius: 10px;
   border: 4px solid #d7544a;
   margin-bottom: 5px;
   &:hover {
      background-color: #b7726d;
   }
`;
const PinkTitle = styled(Title)`
   color: #d7544a;
`;
const BlackHeading = styled(Heading)`
   color: black;
`;
const ButtonLink = styled(Link)`
   color: #ffffff;
   text-decoration: none;
   &:hover {
      background-color: #b7726d;
   }
`;
const Popup = styled(Text)`
   color: black;
   border: 3px solid #FF0000;
   background-color: #f25e5e;
   border-radius: 7px;
   padding: 5px 10px;
`;

const Create = () => {

   const [user, setUser] = useState({});

   onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
   });

   if(!user) {
      return (
         <div>
            <Popup>You must be a user to create a game.</Popup>
            <Login></Login>
         </div>
      );
   } else {
      return (
         <div>
            <PinkTitle>Create a New Game💏</PinkTitle>
            <BlackHeading>Choose a game format</BlackHeading>
            <Wrapper>
               <PinkButton><ButtonLink to='/createPR'>Prompt/Response Game</ButtonLink></PinkButton>
               <PinkButton><ButtonLink to='/createMC'>Multiple Choice Quiz</ButtonLink></PinkButton>
               <PinkButton><ButtonLink to='/createSA'>Short Answer Quiz</ButtonLink></PinkButton>
            </Wrapper>
         </div>
      );
   }
};

export default Create;