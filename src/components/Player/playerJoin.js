/* Have not checked yet */

/*Author: Hayden */
import React from "react";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import "../../styles/PageElements.js";
import Response from "./response.js";
//import ResponseText from "./responseText.jsx";
import ResponseMC from "./responseMC.js";


let socket = io.connect('https://brainbox-server.glitch.me/');

function Player() {
  const [gameID, setGameID] = useState("");
  const [playerUsername, setPlayerUsername] = useState("");
  const [playerJoined, setPlayerJoined] = useState(false);
  const [receivedType, setReceivedType] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  
  //set up player username to join game
  const loginPlayer = () => {
      console.log(playerUsername);
    console.log(gameID);
      if(playerUsername !== "" && (gameID !== "")) {
        const userData = {
          room: gameID,
          username: playerUsername,
        };
        
        console.log("player logging in to room", gameID);
        socket.emit("join_room", userData);
        setPlayerJoined(true);
      }
  };
  
  useEffect(() => {
    socket.on("title", (data) => {
      console.log("Received Title")
      setTitle(data.title);
      setInstructions(data.instructions);
    });
    
    socket.on("type", (data) => {
      console.log("Received Type", data);
      setType(data);
      console.log("Set Type");
      setReceivedType(true);
      console.log(receivedType);
    })
  })
  
  
  if(playerJoined && receivedType===true) {
      console.log("Received the type");
      if(type === "PTR-Game") {
        console.log("PTR!");
        return <Response socket={socket} username={playerUsername} gameID={gameID} />
      } else if(type === "PDR-Game") {
        console.log("PDR");
        return <Response socket={socket} username={playerUsername} gameID={gameID} />
      } else if(type === "MC-Quiz") {
        console.log("MC");
        return <ResponseMC socket={socket} username={playerUsername} gameID={gameID} />
      }// } else if(type === "Text-Quiz") {
      //   console.log("Text");
      //   return <ResponseText socket={socket} username={playerUsername} gameID={gameID} />
      // } 
      else {
        return(
          <div>
            Waiting
          </div>
        );
      }
  } else {
    return(
      <div className="joinAGameContainer">
        <h3>Join Game</h3>
              <input
                type="text"
                placeholder="Username..."
                value={playerUsername}
                onChange={(event) => {
                  setPlayerUsername(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Game ID..."
                value={gameID}
                onChange={(event) => {
                  setGameID(event.target.value);
                }}
              />
              <button onClick={loginPlayer}>Join a Game</button>
      </div>
    );
  }
}

export default Player;