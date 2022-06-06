/* Have not checked yet */

/*Authors: Hayden and Megan*/
import React from "react";
import { useEffect, useState } from "react";
import "../../styles/PageElements.js";
import { auth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

/*
Game process for prompt/ text response game.
Before the user starts the game, players can join using the gameID.
After they have all joined, the host clicks start game.
The show prompt page is displayed, and the host can click sent prompt to send
the prompts to players.
Awaiting responses page is displayed that shows the number of responses received.
After all responses have been sent, the host clicks show responses.
All responses are displayed,
voting stuff happens eventually
After last question, results are shown.
*/

/* FIXME:
  - display player rankings and ?points?
  - send title and ?instructions? to players through socket so it can be
    displayed on their screens
*/

function StartPTR({ socket, gameID, gameSnap }) {
  const [user, setUser] = useState({});
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [answerList, setAnswerList] = useState([]);
  const [playerList, setPlayerList] = useState([]);
  
  const [endGame, setEndGame] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [finalResults, setFinalResults] = useState(false);
  
  // waiting for responses after sending prompt
  const [awaitingResponses, setAwaitingResponses] = useState(false);
  
  // set manually by host
  const [voting, setVoting] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  // the current question index
  const [index, setIndex] = useState(0);
  
  //check log in state
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  
  const handleShowAnswers= () => {
    setShowResponses(true);
  };
  
  const handleStartVoting = () => {
    setVoting(true);
    setAwaitingResponses(false);
    startVoting();
  }
  
  const handleEndVoting = () => {
    setVoting(false);
    setShowResponses(true);
  }
  
  const handleNextQuestion = () => {
    setAwaitingResponses(false);
    setShowResponses(false);
    setCurrentPrompt("");
    setIndex(index+1);
  };
  
  const handleStartGame = () => {
    setStartGame(true);
  }
  
  const handleEndGame = () => {
    setEndGame(true);
    sendEnd();
  }
  
  const sendTitle = async () => {
    const gameData = {
      room: gameID,
      title: gameSnap.gameTitle,
      instructions: gameSnap.gameInstructions,
    }
    await socket.emit("send_title", gameData);
  };
  
  // type: 1 for drawing, 0 for text, 2 for MC/Short Answer
  const sendPrompt = async () => {
    if (gameSnap.gameQuestions[index] !== "") {
      const promptData = {
        room: gameID,
        username: user?.email,
        prompt: gameSnap.gameQuestions[index],
        type: 0,
      };  
      await socket.emit("send_prompt", promptData);
      console.log("SENT TEXT PROMPT");
      setAnswerList([]);
      setShowResponses(false);
      setAwaitingResponses(true);
    }
  };  

  const sendEnd = async () => {
    await socket.emit("end_game", gameID);
    console.log("ENDING GAME")
  };
  
  const startVoting = async () => {
    const answersData = {
      room: gameID,
      answers: answerList,
    };
    await socket.emit("start_voting", answersData);
    console.log("START VOTING SENT");
  };
  
  const addPoints = (answer, numPoints) => {
    setAnswerList(list => list.map((currAnswer) => {
      if(currAnswer.author === answer.author) {
        const updatedAnswer = {
          room: currAnswer.room,
          author: currAnswer.author,
          answer: currAnswer.answer,
          points: currAnswer.points + numPoints,
        }
        return updatedAnswer;
      }
      return currAnswer;
    }));
    
    setPlayerList(list => list.map((currPlayer) => {
      if(answer.author === currPlayer.username) {
        const updatedPlayer = {
          username: currPlayer.username,
          points: currPlayer.points + numPoints,
        }
        return updatedPlayer;
      }
      return currPlayer;
    }));    
  };
  
  const sendType = async () => {
    const gameType = {
      room: gameID,
      type: "PTR-Game",
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
    
    socket.on("gold", (data) => {
      console.log("gold vote for: ", data);
      addPoints(data, 3);
      console.log("done processing gold vote");
      
    });
    socket.on("silver", (data) => {
      console.log("silver vote for: ", data);
      addPoints(data, 2);
      
    });
    socket.on("bronze", (data) => {
      console.log("bronze vote for: ", data);
      addPoints(data, 1);
    });
        
  }, [socket]);
  
  // not awaiting responses and not showing responses:
      // inputting the prompt
  
  // awaiting responses:
    // just a waiting page, display prompt
  
  // not awaiting responses, showing responses:
    // display prompt and responses
  
  if(!startGame) {
    // show initial page
    return (
      <div className="lobbyContainer">
        <h1>{gameSnap.gameTitle}</h1>
        <h1>GameID: {gameID}</h1>
        <h2>Players: </h2>
        <div className="playerList">
          <ul>
          {playerList.map((currPlayer) => {
            return (
                <li>{currPlayer.username}</li>
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
        <button onClick={handleStartVoting}>Start Voting</button>
      </div>
    );
  }
  else if(voting) {
    return(
      <div>
        <h1>Waiting for votes</h1>
        <button onClick={handleEndVoting}>End Voting</button>
      </div>
    );
  }
  else if (endGame){
    //end the game duh
    return(
      <div className="endGameContainer">
        <h1>game over</h1>
        <h2>Scores:</h2>
        <h2>Players: </h2>
        <div className="playerList">
          <ul>
          {playerList.map((currPlayer) => {
            return (
                <li>{currPlayer.username}: {currPlayer.points}</li>
            );
          })}
          </ul>
        </div>
      </div>
    );
  }
  else if(showResponses) {
    // map answers
    return(
      <div className="showResponsesContainer">
        <h1>Prompt: {gameSnap.gameQuestions[index]}</h1>

        {answerList.map((answerContent) => {
          return (
            <div className="answer-content">
              <h2>{answerContent.author} {": "}{answerContent.answer}</h2>
              <h4>{answerContent.points} points</h4>
            </div>
          );
        })}
        {index+1 == gameSnap.numQuestions ? (
          <button onClick={handleEndGame}>Display Final Scores</button>
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

export default StartPTR;