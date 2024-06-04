import React, { useState } from 'react';
import '../App.css';

const FileUploadButton: React.FC = () => {
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);

  const handleFileUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile1(file);
    }
  };

  const handleFileUpload2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile2(file);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type="file" accept=".mp4" onChange={handleFileUpload1} />
          <input type="file" accept=".mp4" onChange={handleFileUpload2} />
        </p>
        <div className="video-container">
        </div>
      </header>
    </div>
  );
};

export default FileUploadButton;
