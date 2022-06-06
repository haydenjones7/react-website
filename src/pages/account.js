import React from "react";
import Login from "./login.js";
import { useState } from "react";
import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Heading, Text, Input, Button } from '../styles/PageElements.js';
import { ClearButton, InlineButtonWrapper, PinkButton } from '../styles/AccountElements.js';
import UserGames from './userGames.js';
import { db } from '../firebase-config';
import { getDocs, collection } from "firebase/firestore";

const Account = () => {
   const [user, setUser] = useState({});
   const [name, setName] = useState("");
   const [photo, setPhoto] = useState("");
   const [showUpdate, setShowUpdate] = useState(false);
   const [showGames, setShowGames] = useState(false);
   const [games, setGames] = useState([]);

   onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
   });

   const logout = async () => {
      await signOut(auth);
   };

   const handleShowUpdate = () => {
      setShowUpdate(true);
   };

   const update = async () => {
      try {
         await updateProfile(user, { displayName: name, photoURL: photo });
         console.log(user);
         setShowUpdate(false);
      } catch (error) {
         console.log("Oh no: ", error);
      }
   };

   const getUserGames = async () => {
      try {
         const querySnapshot = await getDocs(collection(db, user.displayName));
         querySnapshot.forEach((doc) => {
            var game = new Game(doc.data().gameTitle, doc.data().gameType);
            setGames((games) => [...games,game]);
            console.log(doc.id, "=>", doc.data());
         });
         setShowGames(true);
      } catch (error) {
         console.log("Error getting user games ", error);
      }
   }

   function Game(title, type) {
      this.title = title;
      this.type = type;
    }

   const handleBack = () => {
      setShowUpdate(false);
   }

   //selecting profile photo
   const handleClick = a => {
      setPhoto(a);
   };

   if (!user) {
      return (
         <div>
            <Login></Login>
         </div>
      );
   } else {
      if (showUpdate) {
         return (
            <div>
               <Text>Create a username!</Text>
               <Input
                  type="text"
                  placeholder="Username"
                  value={name}
                  onChange={(event) => {
                     setName(event.target.value);
                  } } />
               <Text>Select an avatar</Text>
               <div>
                  <InlineButtonWrapper>
                     <Button onClick={handleBack}>Back</Button>
                     <Button onClick={update}>Save</Button>
                  </InlineButtonWrapper>
               </div>
            </div>
         );
      } else if(showGames) {
         return (
            <div>
               <UserGames games={games}/>
            </div>
         );
      } else {
         return (
            <div>
               <img src={user?.photoURL} alt="ProfilePhoto" />
               <Heading>Name: {user?.displayName}</Heading>
               <Heading>Email: {user?.email}</Heading>
               <ClearButton onClick={handleShowUpdate}>Click to edit information</ClearButton>
               <div>
                  <PinkButton onClick={getUserGames}>My Games</PinkButton>
               </div>
               <div>
                  <Button onClick={logout}>Sign Out</Button>
               </div>
            </div>
         );
      }
   }
}

export default Account;