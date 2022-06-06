/* Have not checked yet */

/*Authors: Megan and Hayden
  Voting: Megan
*/
import React from "react";
import { useEffect, useState } from "react";
import "../../styles/PageElements.js";
//import Canvas from "../Games/canvas.jsx";

//FIXME: need some way to check if the game you've joined is text or drawing response,
// then provide the appropriate pages

function Response({ socket, username, gameID }) {
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  
  //waiting on host to send prompt or for all players to answer
  const [waiting, setWaiting] = useState(false);
  //waiting page before host starts the game
  const [waitForStart, setWaitForStart] = useState(true);
  const [endGame, setEndGame] = useState(false);
  const [responseType, setResponseType] = useState(2);
  const [checkAnswer, setCheckAnswer] = useState(false);
  
    // voting use states
  const [voting, setVoting] = useState(false);
  const [votingGold, setVotingGold] = useState(true);
  const [votingSilver, setVotingSilver] = useState(false);
  const [votingBronze, setVotingBronze] = useState(false);
  
  const [votingList, setVotingList] = useState([]);

  
  const sendAnswer = async () => {
    if (currentAnswer !== "") {
      const answerData = {
        room: gameID,
        author: username,
        answer: currentAnswer,
        points: 0,
      };  
      await socket.emit("send_answer", answerData);
      setCurrentAnswer("");
      console.log("SENT ANSWER");
      setWaiting(true);
    }
  };  
  
  const sendVote = async (answer) => {
    if(votingGold) {
      if(responseType === 1) {
        console.log("voting gold image");
        await socket.emit("send_gold_image", answer);
      }
      else {
        await socket.emit("send_gold", answer);
      }
      console.log("SENT GOLD: ", answer);
      setVotingGold(false);
      setVotingSilver(true);
      
      const newList = votingList.filter((ans) => ans.author !== answer.author);
      setVotingList(newList);

    }
    else if(votingSilver) {
      if(responseType === 1) {
        console.log("voting silver image");
        await socket.emit("send_silver_image", answer);
      }
      else {
        await socket.emit("send_silver", answer);
      }
      console.log("SENT SILVER", answer);
      setVotingSilver(false);
      setVotingBronze(true);
      
      const newList = votingList.filter((ans) => ans.author !== answer.author);
      setVotingList(newList);
    
    }
    else {
      if(responseType === 1) {
        console.log("voting bronze image");
        await socket.emit("send_bronze_image", answer);
      }
      else {
        await socket.emit("send_bronze", answer);
      }      
      
      console.log("SENT BRONZE", answer);
      setVotingBronze(false);
      setVotingGold(true);
      setVoting(false);
      setWaiting(true);
      // voting is over
      setVotingList([]);
    }    
  }
  
  
  useEffect(() => {    
    socket.on("receive_prompt", (data) => {
      console.log("RECEIVE PROMPT");
      setCurrentPrompt(data.prompt);
      // need to set type to display correct thing
      console.log("data type", data.type);
      setResponseType(data.type);
      
      setWaiting(false);
      setWaitForStart(false);
      setVoting(false);
      setVotingGold(true);
      setVotingSilver(false);
      setVotingBronze(false);
    });
    
    socket.on("game_over", (data) => {
      console.log("GAME IS OVER")
      setEndGame(true);
    });
    
    socket.on("receive_all_answers", (data) => {
      setWaiting(false);
      setVoting(true);
      const received = data.filter((ans) => ans.author !== username);
      setVotingList(received);
      console.log("voting started");
    });
    
    socket.on("title", (data) => {
      console.log("receive title/instructions", data);
      setGameTitle(data.title);
      setInstructions(data.instructions);
    });
    
    
  }, [socket]);

  
  //waitForStart needs a way to access the game title and instructions if we implement that
  //maybe needs to be send through socket by the host when they create the game
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
  // drawing voting
  else if(voting && responseType === 1) {
    if(votingGold) {
      return (
        <div className="votingList">
            <h1>Select your 1st place vote</h1>
            <div className="drawing-voting">
            {votingList.map((currOption) => {
              return (
                <div>
                  <img src={currOption.src} />
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>Vote</button>
                </div>
              );
            })}
            </div>
        </div>
      ); 
    }
    else if(votingSilver) {
      return (
        <div className="votingList">
            <h1>Select your 2nd place vote</h1>
            <div className="drawing-voting">
            {votingList.map((currOption) => {
              return (
                <div>
                  <img src={currOption.src}/>
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>
                    Vote</button>
                </div>
              );
            })}
            </div>
        </div>
      );       
    }
    else {
      return (
        <div className="votingList">
            <h1>Select your 3rd place vote</h1>
            <div className="drawing-voting">
            {votingList.map((currOption) => {
              return (
                <div>
                  <img src={currOption.src} />
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>
                    Vote</button>
                </div>
              );
            })}
            </div>
        </div>
      );       
    }
  }
  else if(voting && responseType === 0) {
    if(votingGold) {
      return (
        <div className="votingList">
            <h1>Select your 1st place vote</h1>
            <div className="votingAnswer">
            {votingList.map((currOption) => {
              return (
                <div>
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>
                    {currOption.answer}</button>
                </div>
              );
            })}
            </div>
        </div>
      ); 
    }
    else if(votingSilver) {
      return (
        <div className="votingList">
            <h1>Select your 2nd place vote</h1>
            <div className="votingAnswer">
            {votingList.map((currOption) => {
              return (
                <div>
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>
                    {currOption.answer}</button>
                </div>
              );
            })}
            </div>
        </div>
      );       
    }
    else {
      return (
        <div className="votingList">
            <h1>Select your 3rd place vote</h1>
            <div className="votingAnswer">
            {votingList.map((currOption) => {
              return (
                <div>
                  <button onClick={() => {
                      const sentAnswer = currOption;
                      sendVote(sentAnswer);
                    }}>
                    {currOption.answer}</button>
                </div>
              );
            })}
            </div>
        </div>
      );       
    }
  }
  
  else {
    // need two diff return statements
    // one canvas, one text
    if(responseType === 0) {
      return(
        <div className="typeResponseContainer">
          <h1>Prompt: {currentPrompt}</h1>
            <input
              type="text"
              value={currentAnswer}
              placeholder="Answer..."
              onChange={(event) => {
                setCurrentAnswer(event.target.value);
              }}
              onKeyPress={(event) => {
                event.key === "Enter" && sendAnswer();
              }}
            />
      </div>
      );
    }
    else if(responseType === 1) {
      return (
      <div className="drawingResponseContainer">
          <Canvas socket={socket} gameID={gameID} username={username} prompt={currentPrompt}/>
        </div>);
      
    }
    else if(responseType === 2) {
      return(
        <div>
          
        </div>
      );
    }
    else {
      return (
        <div>
          <h1>Something has gone wrong.</h1>
        </div>
      );
    }
  }
}

export default Response;