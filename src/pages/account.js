import React from "react";
import Login from "./login.js";
import { useState } from "react";
import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Heading, Text, Input, Button } from '../styles/PageElements.js';
//add AccountElements.js styles


const Account = () => {
   const [user, setUser] = useState({});
   const [name, setName] = useState("");
   const [photo, setPhoto] = useState("");
   const [showUpdate, setShowUpdate] = useState(false);

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
               <Text>Enter your name!</Text>
               <Input
                  type="text"
                  placeholder="Display Name"
                  value={name}
                  onChange={(event) => {
                     setName(event.target.value);
                  } } />
               <Text>Select an avatar</Text>
               <br />
               <Button onClick={update}>Save</Button>
            </div>
         );
      } else {
         return (
            <div>
               <img src={user?.photoURL} />
               <Heading>Name: {user?.displayName}</Heading>
               <Heading>Email: {user?.email}</Heading>
               <Button onClick={handleShowUpdate}>Click to edit information</Button>
               <div>
                  <Button onClick={logout}>Sign Out</Button>
               </div>
            </div>
         );
      }
   }
}

export default Account;