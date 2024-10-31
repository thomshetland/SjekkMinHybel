import React, { useState } from 'react';
import './reviewStyle.css'; // Assuming you have the styles in reviewStyle.css

const Review3 = ({ onBack, onFinish, savedData, collectData }) => {
  // Initialize state with saved data if it exists
  const [inputText, setInputText] = useState(savedData.comment || '');
  const maxWords = 200;

  // Function to count words
  const countWords = (text) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handle input change and restrict to maxWords
  const handleInputChange = (e) => {
    const words = countWords(e.target.value);
    if (words <= maxWords) {
      setInputText(e.target.value);
    }
  };

  // Handle the Finish button click
  const handleFinish = () => {
    // Collect comment data before finishing
    collectData({ comment: inputText });
    onFinish(); // Trigger the finish action
  };

  return (
    <div className="review3-container">
      <div className="progress-bar">
        <div className="step">1</div>
        <div className="step">2</div>
        <div className="step active">3</div>
      </div>

      <h2>Har du noe mer på <span className="highlight">hjertet</span>?</h2>

      <div className="input-section">
        <textarea
          className="big-input"
          placeholder="Skriv dine tanker her..."
          value={inputText}
          onChange={handleInputChange}
        />
        <p className="word-count">{maxWords - countWords(inputText)} ord igjen</p>
      </div>

      <div className="button-row">
        <button className="review3Tilbake" onClick={onBack}>Tilbake</button>
        <button className="review3Fullfør" onClick={handleFinish}>Fullfør</button>
      </div>
    </div>
  );
};

export default Review3;
