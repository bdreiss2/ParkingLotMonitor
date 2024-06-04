import React, { useState } from 'react';
import UploadStillButton from "../components/UploadStillButton";
import ModelingPage from "../components/3DModel";
import DistanceButton from "../components/DistanceButton";
import data from './occupancy_data.json';

const ModelingPage2 = () => {
    const [distances, setDistances] = useState<number[]>([]);

    const [clicks, setClicks] = useState<number>(0);    

    const handleClick = (clickCount : number) => {
        setClicks(clickCount);
    };

    const handleDistanceMeasured = (distance: number) => {
        setDistances(prevDistances => [...prevDistances, distance])
    };

    let newIndex: number = 0;
    let newIndex2: number = 0;

    let maxTime = data.length;

    //placeholder message in the text box
    let timeMessage = 'Enter a time between 0:01 and ' + Math.floor(maxTime/60) + ':'
    if(maxTime%60 < 10){
        timeMessage += '0' + maxTime%60;
    }else{
        timeMessage += maxTime%60;
    }

    const [videoTime, setVideoTime] = useState<number>(-1); //time entered

    //updates when a time is entered in the text box
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        newIndex = parseInt(event.target.value); 
        newIndex2 = parseInt(event.target.value.substring(2,4)); 
    };

    //converts time entered into seconds and updates videoTime variable
    const confirmTime = () => {
        const selectedTime = newIndex*60 + newIndex2
        if(selectedTime <= maxTime){
            setVideoTime(selectedTime);
        }
    };

    return (
        <div className="modeling-page-screen">
            {distances.length < 4 ? (
                <UploadStillButton />
            ) : (
                null
            )}

            {distances.length < 4 ? (
                <div className = "distance-button" style={{ opacity: clicks > 0 ? 0 : 1 }}>
                    <DistanceButton onDistanceMeasured={handleDistanceMeasured} onClick={handleClick}/>
                </div> 
            ) : (
                null
            )}

            <div className = "instructions">
                {clicks === 0 ? (
                    null
                ) : clicks === 1 ? (
                    <p>Click on the top left of the parking lot</p>
                ) : distances.length === 0 ? (
                    <p>Click on the top right of the parking lot</p>
                ) : distances.length === 1 ? (
                    <p>Now click on the bottom right of parking lot</p>
                ) : distances.length === 2 ? (
                    <p>Now click on the top and then the bottom of a single parking line</p>
                ) : distances.length === 3 ? (
                    <p>Now click on the top and then the bottom of a single parking line</p>
                ) : videoTime === -1 ? (
                    <div style={{ width: '80%' }}>
                    <input
                        type="string"
                        placeholder={timeMessage}
                        onChange={handleChange}
                        style={{width: '50%' }}
                    />
                     <button onClick={confirmTime}>Confirm</button>
                    </div>
                ) : (
                    <div>
                        <ModelingPage distances={distances} videoTime = {videoTime}/>  
                    </div>
                    
                )}
            </div>            
            
            
        </div>
    );
};

export default ModelingPage2;
