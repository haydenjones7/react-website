import React from "react";
import { useState } from "react";
import { db } from '../firebase-config';
import { doc, getDoc } from "firebase/firestore";
import { Title, Heading, Text, Button } from '../styles/PageElements.js';
import HostJoin from "../components/Host/hostJoin.js";
import { Wrapper, ColumnWrapper, ColumnButton } from '../styles/DisplayGameElements.js'
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const UserGames = ({games}) => {
   const [user, setUser] = useState({});
   const [chosenGame, setChosenGame] = useState(false);
   const [gameType, setGameType] = useState("");
   const [gameSelected, setGameSelected] = useState(false);

   onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
   });

   // const getUserGames = async () => {
   //    try {
   //       const querySnapshot = await getDocs(collection(db, ));
   //       querySnapshot.forEach((doc) => {
   //          var game = new Game(doc.data().gameTitle, doc.data().numQuestions);
   //          setGames((games) => [...games,game]);
   //          console.log(doc.id, "=>", doc.data());
   //       });
   //       setHaveGames(true);
   //    } catch (error) {
   //       console.log("Error getting user games ", error);
   //    }
   // }

   const [gameSnap, setGameSnap] = useState({});
  
   const handleGameClick = g => async () => {
      setGameType(g.type);
      console.log("Title: ", g.title, "Type: ", g.type);
      const docRef = doc(db, user.displayName, g.title);
      const docSnap = await getDoc(docRef);
      setGameSnap(docSnap.data());
      console.log("Data: ", docSnap.data())
      setChosenGame(true);
   }
   
   
   const handleBack = () => {
     setChosenGame(false);
   }
   const handleSelect = () => {
     // call host join
     setGameSelected(true);
   }

   if(gameSelected) {
      return <HostJoin gameType={gameType} gameSnap={gameSnap}/>
   } else if(chosenGame) {
      return (
         <div>
            <Wrapper>
               <Heading>Title: {gameSnap.gameTitle}</Heading>
               <Text>Type: {gameSnap.gameType}<br/>Number of Questions: {gameSnap.numQuestions}</Text>
               <div>
                  <Button onClick={handleBack}>Back</Button>
                  <Button onClick={handleSelect}>Play</Button>
               </div>
            </Wrapper>
         </div>
      );
   } else {
      return (
         <div className="page">
            <div className="search">
               <Wrapper>
                  <Title>
                  My Games!
                  </Title>
                  <ColumnWrapper>
                     {games.map((g) => {
                        return (
                           <ColumnButton onClick={handleGameClick(g)}>{g.title}<br/>Type: {g.type}</ColumnButton>
                        );
                     })}
                  </ColumnWrapper>
               </Wrapper>
            </div>
         </div>
      );
   }
};

export default UserGames;