import React from "react";
import { Text } from '../../styles/PageElements.js';
import { useState } from "react";
import { db } from '../../firebase-config';
import { setDoc, doc } from "firebase/firestore";
import { Wrapper, List, CreateHeading, CreateInput, CreateButton, ButtonLink, DropDown } from './createElements.js';
import styled from "styled-components";

const Check = styled(CreateInput)`
   width: 15px;
   height: 15px;
   margin-bottom: 10px;
`;

const CreatePR = () => {
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [numQuestions, setNumQuestions] = useState(0);
   const [firstPage, setFirstPage] = useState(true);
   const [question, setQuestion] = useState("");
   const [questionList, setQuestionList] = useState([]);
   const [stop, setStop] = useState(false);
   const [gameType, setGameType] = useState("");
   const [backPage, setBackPage] = useState(false);
   const [votingType, setVotingType] = useState("");
   const [instructions, setInstructions] = useState("");
   //false = public game , true = private game
   //maybe shouldnt be a boolean?????
   const [privacy, setPrivacy] = useState(false);

   const writeData = async () => {
      try {
         await setDoc(doc(db, gameType, title), {
            gameTitle: title,
            gameAuthor: author,
            gameQuestions: questionList,
            numQuestions: numQuestions,
            gameVotingType: votingType,
            gameInstructions: instructions,
            gamePrivacy: privacy
         });
         console.log("Document written!");
         setFirstPage(true);
         setTitle("");
         setAuthor("");
         setNumQuestions("");
      } catch(e) {
         //setHostError(true);
         console.log("Error writing document: ", e);
      }
   }

   // function Question(question) {
   //    this.question = question;
   // }

   const nextPage = () => {
      setFirstPage(false);
      setBackPage(false);
   }

   const addPage = () => {
      setFirstPage(false);
      setBackPage(false);
      setStop(false);
   }

   const addQuestion = () => {
      console.log("Question: ", question)
      console.log("current total question #: ", numQuestions)
      setQuestionList((questionList) => [...questionList, question]);
      setQuestion("");
      if(questionList.length === numQuestions - 1) {
         setStop(true);
      }
   }

   if(firstPage) {
      return(
         <div>
            <Wrapper>
               <CreateHeading>Create Prompt/Response Game</CreateHeading>
               <form>
                  <div>
                     <CreateInput
                        type="text"
                        placeholder="Title..."
                        onChange={(event) => {
                           setTitle(event.target.value);
                        }}
                     />
                     <CreateInput
                        type="text"
                        placeholder="Author..."
                        onChange={(event) => {
                           setAuthor(event.target.value);
                        }}
                     />
                     <CreateInput
                        type="text"
                        placeholder="# of Questions..."
                        onChange={(event) => {
                           setNumQuestions(event.target.value);
                        }}
                     />
                     <CreateInput
                        type="text"
                        placeholder="Instructions..."
                        onChange={(event) => {
                           setInstructions(event.target.value);
                        }}
                     />
                     <br/>
                     <label>
                        Pick a response type:&nbsp;
                        <DropDown onChange={(event) => {
                           setGameType(event.target.value);
                        }}>
                           <option value="PTR-Game">Text</option>
                           <option value="PDR-Game">Drawing</option>
                        </DropDown>
                     </label>
                     <br/>
                     <label>
                        Pick a voting type:&nbsp;
                        <DropDown onChange={(event) => {
                           setVotingType(event.target.value);
                        }}>
                           <option value="H2H">Head to Head</option>
                           <option value="All">All at Once</option>
                        </DropDown>
                     </label>
                     <br/>
                     <label>
                        Private game?:&nbsp;
                        <Check
                           type="checkbox"
                           onClick={() => {
                              setPrivacy(true);
                           }}
                        />
                     </label>
                  </div>
               </form>
               <CreateButton onClick={nextPage}>Next</CreateButton>
            </Wrapper>
         </div>
      );
   } 
   if(backPage) {
      return(
         <div>
            <Wrapper>
               <CreateHeading>You currently have {numQuestions} Questions!<br/>Enter the new total you would like</CreateHeading>
               <form>
                  <div>
                     <CreateInput
                        type="text"
                        placeholder="# of Questions..."
                        onChange={(event) => {
                           setNumQuestions(event.target.value);
                           console.log("new total question number: ", numQuestions);
                        }}
                     />
                  </div>
               </form>
               <CreateButton onClick={addPage}>Next</CreateButton>
            </Wrapper>
         </div>
      );
   }
   else {
      if(stop) {
         return(
            <div>
               <Wrapper>
                  <CreateHeading>Title: {title}</CreateHeading>
                  <CreateHeading>Author: {author}</CreateHeading>
                  <CreateHeading>Questions</CreateHeading>
                  <Text>Select a question to edit</Text>
                  <div>
                     <List>
                        {questionList.map((q) => {
                           return(
                              <li key={q}>{q}</li>
                           );
                        })}
                     </List>
                  </div>
                  <CreateButton onClick={writeData}><ButtonLink to="/create">Submit</ButtonLink></CreateButton>
                  <CreateButton onClick={() => {setBackPage(true)}}>Add question</CreateButton>
               </Wrapper>
            </div>
         );
      } else {
         return (
            <div>
               <Wrapper>
                  <CreateHeading>{title}: Question {questionList.length + 1}</CreateHeading>
                  <form>
                     <div>
                        <textarea
                           type="text"
                           placeholder="Enter question..."
                           value={question}
                           onChange={(event) => {
                              setQuestion(event.target.value);
                           }}
                        />
                     </div>
                  </form>
                  <CreateButton onClick={addQuestion}>Next</CreateButton>
               </Wrapper>
            </div>
         );
      }
   }
};

export default CreatePR;