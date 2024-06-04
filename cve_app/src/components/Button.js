import React from 'react';
import './Button.css';

const MyButton = ({ to }) => {  
  
    return ( 

        <a href={`/${to}`}> 
            <button className="my-button"> 
                {to === '' ? "Video Sync" : to === 'AnalysisPage' ? "Analysis Page" : to} 
            </button> 
            
        </a> 
    ) 
} 

export default MyButton;