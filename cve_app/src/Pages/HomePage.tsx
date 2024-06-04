import React, { useState, useRef, useEffect } from 'react';
import '../App.css';




const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [selectedFile3, setSelectedFile3] = useState<File | null>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const [time_offset, setOffset] = useState<number | null>(null);
  const [fileCount, setFileCount] = useState(0);
  const [textDetectionFlag, setTextDetectionFlag] = useState(0);


  const handleFileUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile1(file);
      console.log("begin");
      console.log(file);
      console.log(typeof(file));
      setFileCount(prevCount => prevCount + 1);
    }
  };
 
  const handleFileUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile2(file);
      setFileCount(prevCount => prevCount + 1);
    }
  };

  const handleFileUpload3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile3(file);
      setFileCount(prevCount => prevCount + 1);
      setTextDetectionFlag(1);
      console.log("set detection flag to 1")
    }
  };
 
  useEffect(() => {
    if (fileCount === 2 && textDetectionFlag === 0) {
      proccessVideos();
      setFileCount(0); // Reset file count after testing()
    }
  }, [fileCount]);


  useEffect(() => {
    if (textDetectionFlag === 1) {
      console.log("calling detect videos")
      setTextDetectionFlag(0); // Reset file count after testing()
      textDetectionPost();
    }
  }, [textDetectionFlag]);

  useEffect(() => {
      if(typeof time_offset === 'number' && videoRef1.current && videoRef2.current)
        {
          if (time_offset > 0) {
            videoRef2.current.currentTime = 0;
           videoRef1.current.currentTime = time_offset;
          } else {
            videoRef1.current.currentTime = 0;
            videoRef2.current.currentTime = -time_offset;
          }
          videoRef1.current.play();
          videoRef2.current.play();
        }
     
  }, [time_offset]);

  async function textDetectionPost() {
    const actualVid = document.querySelectorAll("video");
    let allVid: string[] = []; // Specify the type explicitly as string[]
 
    for (let i = 0; i < actualVid.length; ++i) {
      const src = actualVid[i].children[0].getAttribute('src');
      if (src && !allVid.includes(src)) { // Perform a null check for src
        allVid.push(src);
      }
    }
   
    try {
      let storeData = [];
      for (let i = 0; i < allVid.length; ++i) {
        let resp = await fetch(allVid[i]);
        storeData.push(await resp.blob());        
      }
      const formData = new FormData();
      console.log("storeData[2]: " + storeData[0])
      formData.append('file1', storeData[fileCount-1]);
      const url = 'http://10.24.101.48:9999/process/';
     
      // Await the fetch call
      const responseInfo = await fetch(url, {
        method: 'POST',
        body: formData
      })
      .then((response) => response.blob())
      .then((myBlob) => {
        console.log(typeof(myBlob));
      	console.log(myBlob);
      	const objectURL = URL.createObjectURL(myBlob);
      	// console.log(objectURL);
      	// const videoRef1: HTMLVideoElement = document.getElementById('videoElement') as HTMLVideoElement;
      	// videoRef1.src = objectURL;
      	return objectURL;
      });

      let vid = document.createElement('video');

      vid.src=responseInfo;
      vid.width=200;
      vid.height=200;
      document.body.appendChild(vid);

      // const actualVid = document.querySelectorAll("video");
      // actualVid[0].children[0].setAttribute("src", responseInfo);
      // const divs = document.querySelectorAll("video");
      // for (let i = 0; i < divs.length; ++i) {
      // 	  const content = divs[i].innerHTML;
      // 	  divs[i].innerHTML = content;
      // }
      // console.log(actualVid[0].children[0]);

      // setVideoUrl(responseInfo);
      console.log(responseInfo);
      console.log(typeof(responseInfo));
      // const videoRef1: HTMLVideoElement = document.getElementById('videoElement') as HTMLVideoElement;
      // videoRef1.src = responseInfo;

      // let testing = document.querySelector("#testing");
      // console.log(testing);
      // testing.src = responseInfo;
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // setSelectedFile1(responseInfo);

      // console.log(response);
      // Await the response.json() call
      // const jsonData = await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}


  async function proccessVideos() {
    const actualVid = document.querySelectorAll("video");
    let allVid: string[] = []; // Specify the type explicitly as string[]
 
    for (let i = 0; i < actualVid.length; ++i) {
      const src = actualVid[i].children[0].getAttribute('src');
      if (src && !allVid.includes(src)) { // Perform a null check for src
        allVid.push(src);
      }
    }
   
    try {
      let storeData = [];
      for (let i = 0; i < allVid.length; ++i) {
        let resp = await fetch(allVid[i]);
        storeData.push(await resp.blob());        
      }
      const formData = new FormData();
      formData.append('file1', storeData[0]);
      formData.append('file2', storeData[1]);
      const url = 'http://10.24.102.66:8443/upload/';
     
      // Await the fetch call
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
     
      // Await the response.json() call
      const jsonData = await response.json();
      const timeOffset = jsonData.time_offset;


      const video1Base64 = jsonData.video1;
      const video2Base64 = jsonData.video2;


      const video1Blob = base64ToBlob(video1Base64, 'video/mp4');
      const video2Blob = base64ToBlob(video2Base64, 'video/mp4');


      const video1URL = URL.createObjectURL(video1Blob);
      const video2URL = URL.createObjectURL(video2Blob);


      const videoRef1: HTMLVideoElement = document.getElementById('videoElement') as HTMLVideoElement;
      const videoRef2: HTMLVideoElement = document.getElementById('videoElement') as HTMLVideoElement;
     
      videoRef1.src = video1URL;
      videoRef2.src = video2URL;
       
      console.log(video1URL);
      console.log(video2URL);
      console.log(timeOffset);
      setOffset(timeOffset);

       // Assuming your backend returns a JSON object with a 'time_offset' field
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="file-upload-container">
          <div className="object-detection-section">
            <h2>Object Detection/Sync</h2>
            <input type="file" onChange={handleFileUpload1} accept="video/mp4" />
            <input type="file" onChange={handleFileUpload2} accept="video/mp4" />
          </div>
          <div className="text-detection-section">
            <h2>Text Detection</h2>
            <input type="file" onChange={handleFileUpload3} accept="video/mp4" />
          </div>
        </div>
        <div className="video-section">
          <div className="video-container">
            {selectedFile1 && (
              <video ref={videoRef1} controls width="100%">
                <source src={URL.createObjectURL(selectedFile1)} type="video/mp4" />
              </video>
            )}
            {selectedFile2 && (
              <video ref={videoRef2} controls width="100%">
                <source src={URL.createObjectURL(selectedFile2)} type="video/mp4" />
              </video>
            )}
            {selectedFile3 && (
              <video ref={videoRef3} controls width="100%">
                <source src={URL.createObjectURL(selectedFile3)} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </header>
    </div>
  );
  
  
  
  
  
  
};


export default App;

