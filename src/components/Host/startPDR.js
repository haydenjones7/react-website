/* Have not checked yet */

/* Authors: Megan */
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

function StartPDR({ socket, gameID, gameSnap }) {
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
  
  
  const [imageAnswer, setImageAnswer] = useState("");
  
  // need to change so that image answers also somehow keeps track of user
  // and score
  // just make a little struct thing
  const [imageAnswers, setImageAnswers] = useState([]);
  
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
  
  const sendType = async () => {
    const gameType = {
      room: gameID,
      type: "PDR-Game",
    };
    await socket.emit("send_type", gameType);
    console.log("Type Sent")
  };
  
  // type: 1 for drawing, 0 for text
  const sendPrompt = async () => {
    if (gameSnap.gameQuestions[index] !== "") {
      const promptData = {
        room: gameID,
        username: user?.email,
        prompt: gameSnap.gameQuestions[index],
        type: 1,
      };  
      await socket.emit("send_prompt", promptData);
      console.log("SENT TEXT PROMPT");
      setAnswerList([]);
      setShowResponses(false);
      setAwaitingResponses(true);
      setImageAnswers([]);
    }
  };  

  const sendEnd = async () => {
    await socket.emit("end_game", gameID);
    console.log("ENDING GAME")
  };
  
  const startVoting = async () => {
    const answersData = {
      room: gameID,
      answers: imageAnswers,
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
  
  const addImagePoints = (answer, numPoints) => {
    setImageAnswers(list => list.map((currAnswer) => {
      if(currAnswer.author === answer.author) {
        const updatedAnswer = {
          author: currAnswer.author,
          room: currAnswer.room,
          src: currAnswer.src,
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
    
    socket.on("gold_image", (data) => {
      addImagePoints(data, 3);
      
    });
    socket.on("silver_image", (data) => {
      addImagePoints(data, 2);
      
    });
    socket.on("bronze_image", (data) => {
      addImagePoints(data, 1);
    });
        
    socket.on("receive_image", (data) => {
      console.log("###RECEIVED AN IMAGE###");
      const w = window.open('about:blank', 'image from canvas');
      let image = new Image();
      image.src = data.image.toString('base64');
      
      const imageAnswer = {
        author: data.author,
        room: data.room,
        src: data.image.toString('base64'),
        points: 0,
      }

      setImageAnswers((list) => [...list, imageAnswer]);
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
        <h1>Prompt: {currentPrompt}</h1>
        <h2>{imageAnswers.length} response(s) received</h2>
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
        <div className="drawing-voting">
      {imageAnswers.map((currImg) => {
          return (
            <div>
              <img src={currImg.src} />
              <h3>{currImg.points} points</h3>
            </div>
          );
        })}
        </div>
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

export default StartPDR;