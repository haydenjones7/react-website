/* Have not checked yet */

/*Authors: Kiera*/
import React from "react";
import { useEffect, useState } from "react";
import "../../styles/PageElements.js";
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

/*
Game process for multiple choice quiz.
Before the user starts the game, players can join using the gameID.
After they have all joined, the host clicks start game.
The show question page is displayed, and the host can click sent question to send
the questions and answer choices to players.
Awaiting responses page is displayed that shows the number of responses received.
After all responses have been sent, the host clicks show results.
The number of people who selected each answer are shown.
Points are awarded for correct answer.
After last question, results are shown.
User can click end game to stop.
*/

function StartMC({ socket, gameID, gameSnap }) {
  const [user, setUser] = useState({});
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [answerList, setAnswerList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  
  const [endGame, setEndGame] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [finalResults, setFinalResults] = useState(false);
  
    // waiting for responses after sending prompt
  const [awaitingResponses, setAwaitingResponses] = useState(false);
  
  // set manually by host
  const [showResponses, setShowResponses] = useState(false);
  
    // the current question index
  const [index, setIndex] = useState(0);
  
  //keep track of how many got it right or wrong for each question
  //could use on end game screen as results? 
  const [numCorrect, setNumCorrect] = useState([]);
  const [numIncorrect, setNumIncorrect] = useState([]);
  var right = 0;
  var wrong = 0;
  
    //check log in state
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  
    const handleShowAnswers= () => {
    setAwaitingResponses(false);
    setShowResponses(true);
  };
  
    const handleStartGame = () => {
    setStartGame(true);
  }
  
  const handleEndGame = () => {
    setEndGame(true);
    sendEnd();
  }
  
    const handleNextQuestion = () => {
    setAwaitingResponses(false);
    setShowResponses(false);
    setCurrentPrompt("");
    setIndex(index+1);
    setNumCorrect((numCorrect) => [...numCorrect, right]);
    setNumIncorrect((numIncorrect) => [...numIncorrect, wrong]);
    right = 0;
    wrong = 0;
    if(index+1 == gameSnap.numQuestions) {
      setEndGame(true);
    }
  };
  
  const sendTitle = async () => {
    const gameData = {
      room: gameID,
      title: gameSnap.gameTitle,
      instructions: gameSnap.gameInstructions,
    }
    await socket.emit("send_title", gameData);
  };
  
    const sendPrompt = async () => {
    if (gameSnap.gameQuestions[index] !== "") {
      const promptData = {
        room: gameID,
        username: user?.email,
        prompt: gameSnap.gameQuestions[index],
        choice1: gameSnap.gameAnswers[index*4],
        choice2: gameSnap.gameAnswers[(index*4)+1],
        choice3: gameSnap.gameAnswers[(index*4)+2],
        choice4: gameSnap.gameAnswers[(index*4)+3],
        correct: gameSnap.gameCorrectAnswers[index]
      };  
      await socket.emit("send_prompt", promptData);
      console.log("SENT MC PROMPT");
      setAnswerList([]);
      setShowResponses(false);
      setAwaitingResponses(true);
    }
  };  

  const sendEnd = async () => {
    await socket.emit("end_game", gameID);
    console.log("ENDING GAME")
  };
  
  const sendType = async () => {
    const gameType = {
      room: gameID,
      type: "MC-Quiz",
    };
    await socket.emit("send_type", gameType);
    console.log("Type Sent")
  };
  
    useEffect(() => {
    
    socket.on("receive_answer", (data) => {
      console.log("RECEIVED AN ANSWER");
      console.log(data);
      setAnswerList((list) => [...list, data]);
      console.log(answerList);
    });
    
    socket.on("new_player", (data) => {
      console.log("NEW PLAYER");
      setPlayerList((list) => [...list, data]);
      sendTitle();
      sendType();
    });
    
  }, [socket]);
  
  
  if(!startGame) {
    // show initial page
    return (
      <div className="lobbyContainer">
        <h1>{gameSnap.gameTitle}</h1>
        <h1>GameID: {gameID}</h1>
        <h2>Players: </h2>
        <div className="playerList">
          <ul>
          {playerList.map((value,key) => {
            return (
                <li>{value.username}</li>
            );
          })}
          </ul>
        </div>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    );
  }
  else if(awaitingResponses) {
    //wait for answers
    return(
      <div className="awaitingResponsesContainer">
        <h1>Prompt: {gameSnap.gameQuestions[index]}</h1>
        <h2>{answerList.length} response(s) received</h2>
        <button onClick={handleShowAnswers}>Show Answers</button>
      </div>
    );
  }
  else if (endGame){
    //end the game duh
    return(
      <div className="endGameContainer">
        <h1>game over</h1>
        <h2>Scores:</h2>
      </div>
    );
  }
  else if(showResponses) {
    // map answers
    return(
      <div className="showResponsesContainer">
        <h1>Prompt: {gameSnap.gameQuestions[index]}</h1>
        <h2>Correct Answer: {gameSnap.gameCorrectAnswers[index]}</h2>

        {answerList.map((answerContent) => {
          if(gameSnap.gameAnswers[index] == answerContent.answer) {
            right = right + 1;
          } else {
            wrong = wrong + 1;
          }
        })}
        
        <h2>{right} got it right!</h2>
        <h2>{wrong} got it wrong!</h2>
        {index+1 == gameSnap.numQuestions ? (
          <button onClick={handleNextQuestion}>Next</button>
        ) : (
          <div>
            <button onClick={handleNextQuestion}>Next Question</button>
            <button onClick={handleEndGame}>End Game</button>
          </div>
        )}
      </div>
    );
  }
  else if(finalResults) {
    //show rankings
    return(
      <div>
        <h1>1st: {} Points: {}</h1>
        {/*display all player rankings maybe with sorting function*/}
        <button onClick={handleEndGame}>End Game</button>
      </div>
    );
  }
  else {
    // show prompt
    return(
      <div className="prompt">
        <h1>Question {index + 1}</h1>
        <h2>{gameSnap.gameQuestions[index]}</h2>
        <button onClick={sendPrompt}>Send to Players</button>
      </div>
    );
  }
}

export default StartMC;