import styled from "styled-components";

export const ClearButton = styled.button`
   width: 13rem;
   height: 30px;
   font-size: 17px;
   background: none;
   border: none;
   color: black;
   margin-bottom: 10px;
   border-radius: 0;
   &:hover {
      background-color: #eeb7b3;
   }
`;

export const InlineButtonWrapper = styled.button`
   display: grid;
   flex-direction: column;
   padding: 10px;
   text-align: center;
   align-items: center;
   justify-content: center;
   grid-template-columns: repeat(2, 1fr);
   column-gap: 3em;
   background: none;
   border: none;
`;