import React from "react";
import { useState } from "react";
import { createUserWithEmailAndPassword,
signOut,
signInWithEmailAndPassword,
} from 'firebase/auth';
import '../App.css';
import {auth} from '../firebase-config';
import {Heading, Button, Input} from '../styles/PageElements.js';
import {ClearButton} from '../styles/AccountElements.js';

function Login() {

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [showLogin, setShowLogin] = useState(true);
  const [showRegisterError, setShowRegisterError] = useState(false);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      setShowLogin(true);
      console.log(user);
    } catch (error) {
      setShowRegisterError(true);
      console.log(error.message);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
    } catch (error) {
      setShowLogin(false);
      console.log(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const registerPage = () => {
    setShowLogin(false);
  }

  return (
    <div className="App">
      {showLogin ? (
      <div className="login">
        <Heading>Login</Heading>
        <div className="registerClear">
          <ClearButton onClick={registerPage}>or click here to register</ClearButton>
        </div>
        <div>
          <Input 
            type="text" 
            placeholder="Email..." 
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}/>
        </div>
        <div>
          <Input 
            type="password" 
            placeholder="Password..." 
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}/>
        </div>
        <Button onClick={login}> Login </Button>
      </div>) : 
      (<div id = "main-holder">
        <Heading className="title">Sign up!</Heading>
        <h4> Register User </h4>
        <div>
          <Input 
            className="login-form-field" 
            placeholder="Email..." 
            onChange={(event) => {
              setRegisterEmail(event.target.value);
            }}/>
        </div>
        <div>
          <Input 
            className="login-form-field"
            type="password" 
            placeholder="Password..." 
            onChange={(event) => {
              setRegisterPassword(event.target.value);
            }}/>
        </div>
        <div>
          <Button id="login-form-submit" onClick={register}> Create User </Button>
        </div>
        {showRegisterError ? (
              <div className="popup">
                <p>Invalid Registration</p> 
              </div>
        ) : ''}
      </div> 
      )}
      
      <div className="signout">
        <div>
          <Button onClick={logout}> Sign Out </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;