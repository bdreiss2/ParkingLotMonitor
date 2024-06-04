import React, { useState } from 'react';
import './AnalysisPage.css';
import * as data from './occupancy_data.json';

const analysisPage: React.FC = () => {

  const data2: {[key: string]: string}[] = data;  //convert to string key return string

  let secondsOccupied: number[] = [];   //keeps track of how many seconds each spot is occupied

  const status = data2[0];

  for(const key in status){
    secondsOccupied.push(0);
  }

  //find how many seconds each spot was occupied total
  for(let i = 0; i < data2.length; i++){
    const status = data2[i];
    let k = 0;
    for(const key in status){
      if(status[key] === 'occupied'){
        secondsOccupied[k] += 1;
      }
      k++;
    }
  }

  return (
    <div className="AnalysisPage">
      <header className="App-header2">
      Parking Spot Usage Throughout Video
      </header>
      <table>
      <tbody>
        {secondsOccupied.map((item, index) => (
          <tr key={index}>
            <td style={{ fontWeight: 'bold' }}>Parking Spot {index+1}</td>
            <td>{Math.round(item/data2.length*100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default analysisPage;
