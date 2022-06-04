import React from "react";
import Login from "./login.js";
import { useState } from "react";
import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { Heading, Text, Input, Button } from '../styles/PageElements.js';
import { ClearButton, InlineButtonWrapper } from '../styles/AccountElements.js';


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

   const handleBack = () => {
      setShowUpdate(false);
   }

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
      } else {
         return (
            <div>
               <img src={user?.photoURL} alt="ProfilePhoto" />
               <Heading>Name: {user?.displayName}</Heading>
               <Heading>Email: {user?.email}</Heading>
               <ClearButton onClick={handleShowUpdate}>Click to edit information</ClearButton>
               <div>
                  <Button onClick={logout}>Sign Out</Button>
               </div>
            </div>
         );
      }
   }
}

export default Account;