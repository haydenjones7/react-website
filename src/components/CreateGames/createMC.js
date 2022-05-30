import React from "react";
import { Text } from '../../styles/PageElements.js';
import { useState } from "react";
import { db } from '../../firebase-config';
import { setDoc, doc } from "firebase/firestore";
import { Wrapper, List, CreateHeading, CreateInput, CreateButton, ButtonLink } from './createElements.js';

const CreateMC = () => {
   const [firstPage, setFirstPage] = useState(true);
   const [title, setTitle] = useState("");
   const [author, setAuthor] = useState("");
   const [numQuestions, setNumQuestions] = useState("");
   const [instructions, setInstructions] = useState("");
   const [question, setQuestion] = useState("");
   const [questionList, setQuestionList] = useState([]);
   const [stop, setStop] = useState(false);
   const [answer1, setAnswer1] = useState("");
   const [answer2, setAnswer2] = useState("");
   const [answer3, setAnswer3] = useState("");
   const [answer4, setAnswer4] = useState("");
   const [backPage, setBackPage] = useState(false);
   const [answerList, setAnswerList] = useState([]);
   const [correctAnswers, setCorrectAnswers] = useState([]);

   const writeData = async () => {
      try {
        await setDoc(doc(db, "MC-Quiz", title), {
          gameTitle: title,
          gameAuthor: author,
          gameQuestions: questionList,
          gameAnswers: answerList,
          numQuestions: numQuestions,
          gameInstructions: instructions,
          gameCorrectAnswers: correctAnswers
        });
        console.log("Document written!");
        setFirstPage(true);
        setTitle("");
        setAuthor("");
        setNumQuestions("");
        setInstructions("");
      } catch (e) {
        console.log("Error writing document: ", e);
      }
    }
    
    const nextPage = () => {
      setFirstPage(false);
    }
    
    const addPage = () => {
      setFirstPage(false);
      setBackPage(false);
      setStop(false);
    }
    
    
    const addQuestion = () => {
      console.log("Question: ",question)
      setQuestionList((questionList) => [...questionList, question]);
      setAnswerList((answerList) => [...answerList, answer1]);
      setAnswerList((answerList) => [...answerList, answer2]);
      setAnswerList((answerList) => [...answerList, answer3]);
      setAnswerList((answerList) => [...answerList, answer4]);
      setQuestion("");
      setAnswer1("");
      setAnswer2("");
      setAnswer3("");
      setAnswer4("");
      if(questionList.length === numQuestions - 1) {
        setStop(true);
      }
    }


    if(firstPage) {
      return(
         <div>
            <Wrapper>
               <CreateHeading>Create Multiple Choice Quiz</CreateHeading>
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
   } else {
      if(stop) {
         console.log(answerList);
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
                        <CreateInput
                           type="text"
                           placeholder="Enter question..."
                           value={question}
                           onChange={(event) => {
                              setQuestion(event.target.value);
                           }}
                        />
                        <CreateInput
                           type="text"
                           placeholder="Answer1..."
                           value={answer1}
                           onChange={(event) => {
                              setAnswer1(event.target.value);
                           }}
                        />
                        <CreateInput
                           type="text"
                           placeholder="Answer2..."
                           value={answer2}
                           onChange={(event) => {
                              setAnswer2(event.target.value);
                           }}
                        />
                        <CreateInput
                           type="text"
                           placeholder="Answer3..."
                           value={answer3}
                           onChange={(event) => {
                              setAnswer3(event.target.value);
                           }}
                        />
                        <CreateInput
                           type="text"
                           placeholder="Answer4..."
                           value={answer4}
                           onChange={(event) => {
                              setAnswer4(event.target.value);
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

export default CreateMC;