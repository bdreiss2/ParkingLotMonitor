import React, { useState, useRef } from 'react';
import '../App.css';

const UploadStillButton: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const fifthFrameTime = 1/4; 

        video.currentTime = fifthFrameTime;

        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const dataURL = canvas.toDataURL('image/png');
          setImageUrl(dataURL);
        };
      }
    }
  };

  return (
    <div className="StillButton">
      <header className="StillButton-header">
        <p>
          <input type="file" accept=".mp4" onChange={handleFileUpload} />
        </p>
        <div className="image-container">
          {imageUrl && <img src={imageUrl} alt="Selected" />}
        </div>
      </header>
      {selectedFile && (
        <video
          ref={videoRef}
          src={URL.createObjectURL(selectedFile)}
          style={{ display: 'none' }}
          onLoadedData={captureFrame}
        />
      )}
    </div>
  );
};

export default UploadStillButton;
