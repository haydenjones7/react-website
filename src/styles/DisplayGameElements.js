import styled from "styled-components";
import { Button, Heading } from "./PageElements";

export const Wrapper = styled.section`
   display: flex;
   flex-direction: column;
   text-align: center;
   align-items: center;
   justify-content: center;
`;

export const ColumnWrapper = styled.section`
   display: grid;
   flex-direction: column;
   font-size: 5px;
   padding: 10px;
   text-align: center;
   align-items: center;
   justify-content: center;
   grid-template-columns: repeat(4, 1fr);
   column-gap: 3em;
   row-gap: 3em;
`;

export const ColumnButton = styled(Button)`
   width: 100%;
   height: 100%;
   margin-bottom: 0px;
`;

export const InlineWrapper = styled.section`
   display: inline;
   flex-direction: flex-end;
   text-align: right;
   align-items: center;
   justify-content: center;
`;

export const InlineButton = styled(Button)`
   display: inline;
   width: 8.5%;
   height: 100%;
   border-radius: 5px;
   justify-content: center;
   align-items: center;
   text-align: center;
`;

export const InlineText = styled(Heading)`
   display: inline;
   text-align: right;
   color: #2b625b;
`;

export const BlackHeading = styled(Heading)`
   color: black;
`;