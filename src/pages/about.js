import React from "react";
import { Title, Heading, Text, SmallText } from '../styles/PageElements.js';

const About = () => {
   return (
      <div className="page">
         <Title className="title">
         About BrainBox
         </Title>
         <Text>
            BrainBox is a refined study platform and entertainment party web-app that offers various forms of in game customizations. 
            With these features, box hosts will be able to customize previously created boxes, or create their own from scratch. 
            With a design similar to games such as Kahoot, Cards Against Humanity, and Quiplash, BrainBox offers various forms of interactions for all users.
         </Text>
         <Heading>
            Creators
         </Heading>
         <SmallText>
            <em>
               <strong>
                  BrainBox was created by Megan, Kiera, Hayden, Nic, and Evans in the University of Alabama's Capstone Computing class.
               </strong>
            </em>
         </SmallText>
         <SmallText>
            This version of BrainBox was modified by Hayden and Megan post-graduation.<br/>
            The original site can be found <a href="https://brainbox-project.glitch.me/">here!</a>
         </SmallText>
    </div>
   );
};

export default About;