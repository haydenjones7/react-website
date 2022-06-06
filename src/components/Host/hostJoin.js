/* Have not checked yet */

/* Authors: Hayden and Megan 
  Error pop-up: Kiera
*/
import React from "react";
import { useState } from "react";
import io from "socket.io-client";
import "../../styles/PageElements.js";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';

import StartPTR from "./startPTR";
import StartPDR from "./startPDR";
import StartMC from "./startMC";
//import StartText from "./startText";

let socket = io.connect('https://brainbox-server.glitch.me/');

/*
Page for the Host to join a game room.
They enter their chosen gameID, and a room is created via socket.
Then, the appropriate start page is called.
*/

function HostJoin ({gameType, gameSnap}) {
  const [user, setUser] = useState({});
  const [gameID, setGameID] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [hostLoggedIn, setHostLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })

  const loginHost = async () => {
     if(user) {
      if(gameID !== "") {
        const userData = {
          room: gameID,
          username: loginEmail,
        };
        socket.emit("join_room", userData);
        setHostLoggedIn(true);
      }
    } else {
      setHostLoggedIn(false); 
    }
  }
  
  if(!hostLoggedIn) {
    return(
      <div className="hostAGameContainer">
          <h2>Enter a game ID</h2>
          <input
            type="text"
            placeholder="Game ID?"
            onChange={(event) => {
              setGameID(event.target.value);
            }}
          />
          <button onClick={loginHost}>Start</button>
              {showPopup ? (
              <div className="popup">
                <p>Incorrect Credentials</p>
              </div>
              ) : ''}
      </div>
    );
  } else {
    // pick the type of game
    if(gameType == "PTR-Game") {
      return <StartPTR socket={socket} gameID={gameID} gameSnap={gameSnap} />
    } else if(gameType == "PDR-Game") {
      return <StartPDR socket={socket} gameID={gameID} gameSnap={gameSnap} />
    } else if(gameType == "MC-Quiz") {
      return <StartMC socket={socket} gameID={gameID} gameSnap={gameSnap} />
    }// } else if(gameType == "Text-Quiz") {
    //   return <StartText socket={socket} gameID={gameID} gameSnap={gameSnap} />
    // } 
  }
}

export default HostJoin;