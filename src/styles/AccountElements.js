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

export const PinkButton = styled.button`
   background-color: #e58f89;
   color: #ffffff;
   width: 30%;
   height: 100%;
   padding: 5px;
   font-size: 30px;
   border-radius: 10px;
   border: 4px solid #d7544a;
   margin-bottom: 5px;
   &:hover {
      background-color: #b7726d;
   }
`;