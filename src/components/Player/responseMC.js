/* Have not checked yet */

import React from "react";
import { useEffect, useState } from "react";
import "../../styles/PageElements.js";

function ResponseMC({ socket, username, gameID }) {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [waiting, setWaiting] = useState(true);
  const [endGame, setEndGame] = useState(false);
  const [gameTitle, setGameTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [waitForStart, setWaitForStart] = useState(true);
  
  const [currentChoice1, setCurrentChoice1] = useState("");
  const [currentChoice2, setCurrentChoice2] = useState("");
  const [currentChoice3, setCurrentChoice3] = useState("");
  const [currentChoice4, setCurrentChoice4] = useState("");
  
  
  const handleAnswer = choice => async () => {
    setCurrentAnswer(choice);
    sendAnswer();
    setWaiting(true);
  }
  
  
  const sendAnswer = async () => {
    if (currentAnswer !== "") {
      const answerData = {
        room: gameID,
        author: username,
        answer: currentAnswer,
      };  
      // need to write this in server
      await socket.emit("send_answer", answerData);
      setCurrentAnswer("");
      console.log("SENT ANSWER");
      setWaiting(true);
      // pull up page that just has the prompt on it, with a button that says done maybe
    }
  };  
  
  useEffect(() => {    
    socket.on("receive_prompt", (data) => {
      console.log("RECEIVE PROMPT");
      setCurrentPrompt(data.prompt);
      setCurrentChoice1(data.choice1);
      setCurrentChoice2(data.choice2);
      setCurrentChoice3(data.choice3);
      setCurrentChoice4(data.choice4);
      setWaiting(false);
      setWaitForStart(false);
    });
    
    socket.on("title", (data) => {
      console.log("received title and instructions", data);
      setGameTitle(data.title);
      setInstructions(data.instructions);
    });
    
    socket.on("game_over", (data) => {
      console.log("GAME IS OVER")
      setEndGame(true);
    });
    
  }, [socket]);

  
  if(endGame) {
    return(
      <div className="endGamePlayer">
        <h1>game over😈</h1>
      </div>
    );
  }
  else if(waitForStart) {
    return (
      <div>
        <h1>{gameTitle}</h1>
        <h2>Instructions: {instructions}</h2>
      </div>
    );
  }
  else if(waiting) {
    return(
      <div className="waiting">
        <h1>Waiting🧚‍♀️</h1>
      </div>
    );
  }
  else {
    return(
        <div className="question-section">
          <h2>Question: {currentPrompt}</h2>
          <button onClick={handleAnswer(currentChoice1)}>Choice1: {currentChoice1}</button>
          <button onClick={handleAnswer(currentChoice2)}>Choice2: {currentChoice2}</button>
          <button onClick={handleAnswer(currentChoice3)}>Choice3: {currentChoice3}</button>
          <button onClick={handleAnswer(currentChoice4)}>Choice4: {currentChoice4}</button>
        </div>
    );
  }
}

export default ResponseMC;