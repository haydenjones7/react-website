import React from "react";
import { Title, Heading, Text, Button } from '../styles/PageElements';
import { Wrapper, ColumnWrapper, ColumnButton, InlineWrapper, InlineButton, InlineText, BlackHeading } from '../styles/DisplayGameElements';
import { useState } from "react";
import { db } from '../firebase-config';
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import HostJoin from "../components/Host/hostJoin";

const Search = () => {
   const [games, setGames] = useState([]);
   const [haveGames, setHaveGames] = useState(false);
   const [chosenGame, setChosenGame] = useState(false);
   const [gameType, setGameType] = useState("");
   const [gameSelected, setGameSelected] = useState(false);
   const [prettyType, setPrettyType] = useState("");
  
    const [showHostError, setHostError] = useState(false);
   /* User must be logged in to host a game. I have to add the delay for the pop up*/

   const getPTRGames = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "PTR-Game"));
         querySnapshot.forEach((doc) => {
            var game = new Game(doc.data().gameTitle, doc.data().gameAuthor);
            setGames((games) => [...games, game]);
            console.log(doc.id, "=>", doc.data());
         });
         setHaveGames(true);
         setGameType("PTR-Game");
         setPrettyType("Prompt/Text Response Games");
      }catch (error) {
         setHostError(true);
         console.log(error.message);
      }
   }
  
   const getPDRGames = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "PDR-Game"));
         querySnapshot.forEach((doc) => {
            var game = new Game(doc.data().gameTitle, doc.data().gameAuthor);
            setGames((games) => [...games, game]);
            console.log(doc.id, "=>", doc.data());
         });
         setHaveGames(true);
         setGameType("PDR-Game");
         setPrettyType("Prompt/Drawing Response Games");
      }catch (error) {
         setHostError(true);
         console.log(error.message);
      }
   }
  
   const getMCGames = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, "MC-Quiz"));
         querySnapshot.forEach((doc) => {
            var game = new Game(doc.data().gameTitle, doc.data().gameAuthor);
            setGames((games) => [...games, game]);
            console.log(doc.id, "=>", doc.data());
         });
         setHaveGames(true);
         setGameType("MC-Quiz");
         setPrettyType("Mulitple Choice Quizzes");
      }catch (error) {
         setHostError(true);
         console.log(error.message);
      }
   }
  
   // const getTextGames = async () => {
   //    try {
   //       const querySnapshot = await getDocs(collection(db, "Text-Quiz"));
   //       querySnapshot.forEach((doc) => {
   //          var game = new Game(doc.data().gameTitle, doc.data().gameAuthor);
   //          setGames((games) => [...games, game]);
   //          console.log(doc.id, "=>", doc.data());
   //       });
   //       setHaveGames(true);
   //       setGameType("Text-Quiz");
   //    }catch (error) {
   //       setHostError(true);
   //       console.log(error.message);
   //    }
   // }
  
   const [gameSnap, setGameSnap] = useState({});
  
   const handleGameClick = g => async () => {
      const docRef = doc(db, gameType, g.title);
      const docSnap = await getDoc(docRef);
      setChosenGame(true);
      setGameSnap(docSnap.data());
      console.log("Data: ", docSnap.data())
   }
  
   function Game(title, author) {
      this.title = title;
      this.author = author;
   }
  
   const handleBack = () => {
      setChosenGame(false);
   }
   const handleSelect = () => {
      // call host join
      setGameSelected(true);
   }

   const handleBackMain = () => {
      setHaveGames(false);
   }
  
  
   // in here call host join game file, which will use game data 
   // then call the appropriate type of game handling 
  
   // read the data from firestore: haveGames: true
   if(haveGames) {
      console.log("Games: ", games);
      if(gameSelected) {
         return <HostJoin gameType={gameType} gameSnap={gameSnap}/>
      }
      else if(chosenGame) {
         return(
            <div>
               <Wrapper>
                  <Heading>Title: {gameSnap.gameTitle}</Heading>
                  <Text>Author: {gameSnap.gameAuthor}<br/>Number of Questions: {gameSnap.numQuestions}</Text>
                  <div className="selectGame">
                     <Button onClick={handleBack}>Back</Button>
                     <Button onClick={handleSelect}>Play</Button>
                  </div> 
               </Wrapper>        
            </div>
         );
      } else {
         return (
            <div>
               <Wrapper>
                  <Title>{prettyType}!</Title>
                  <ColumnWrapper>
                     {games.map((g) => {
                        return (
                           <ColumnButton onClick={handleGameClick(g)}>{g.title}<br/>By: {g.author}</ColumnButton>
                        );
                     })}
                  </ColumnWrapper>
                  <Button onClick={handleBackMain}>Back</Button>
               </Wrapper>
            </div>
         );
      }
   } else {
      return (
         <div>
            <Wrapper>
               <Title>Show me the boxes💡</Title>
               {showHostError ? (
                  <div className="popup">
                     <p>Must be Logged in to Host a Game!</p>
                  </div>
               ) : ''}
               <BlackHeading>what kind of box would you like to play?</BlackHeading>
               <InlineWrapper>
                  <InlineText>Prompt / Text Response </InlineText>
                  <InlineButton onClick={getPTRGames}>&#10003;</InlineButton>
                  <br/>
                  <InlineText>Prompt / Drawing Response </InlineText>
                  <InlineButton onClick={getPDRGames}>&#10003;</InlineButton>
                  <br/>
                  <InlineText>Multiple Choice Quiz </InlineText>
                  <InlineButton onClick={getMCGames}>&#10003;</InlineButton>
                  {/* <br/>
                  <Heading>Short Answer Quiz </Heading>
                  <Button onClick={getTextGames}>&#10003;</Button> */}
               </InlineWrapper>
            </Wrapper>
         </div>
      );
   }
};

export default Search; 