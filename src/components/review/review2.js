import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';
import './reviewStyle.css';

const Review2 = ({ onNext, onBack, savedData, collectData }) => {
  // Initialize state with saved data if exists
  const [ratingPlassering, setRatingPlassering] = useState(savedData.ratePlassering || 0);
  const [ratingBygningen, setRatingBygningen] = useState(savedData.rateBygning || 0);
  const [ratingBadet, setRatingBadet] = useState(savedData.rateBadet || 0);
  const [ratingKjokken, setRatingKjokken] = useState(savedData.rateKjøkken || 0);

  const handleNext = () => {
    // Collect the rating data when moving to the next step
    collectData({
      ratePlassering: ratingPlassering,
      rateBygning: ratingBygningen,
      rateBadet: ratingBadet,
      rateKjøkken: ratingKjokken
    });
    onNext(); // Move to next review step
  };

  return (
    <div className="review2-container">
      <div className="progress-bar">
        <div className="step">1</div>
        <div className="step active">2</div>
        <div className="step">3</div>
      </div>

      <h2>Vurder din <span className="highlight">hybel</span>!</h2>

      <div className="rating-section">
        <div className="rating-item">
          <div className="text-container">
            <h3>Rate plassering</h3>
            <p>Hvordan er hybelen plassert med tanke på beliggenhet?</p>
          </div>
          <div className="rating-stars">
            <Rating
              count={5}
              value={ratingPlassering}
              onChange={(newRating) => setRatingPlassering(newRating)}
              size={40}
              activeColor="#ffd700"
            />
          </div>
        </div>

        <div className="rating-item">
          <div className="text-container">
            <h3>Rate bygningen</h3>
            <p>Hvordan er renslighet, støynivå, alder og andre aspekter?</p>
          </div>
          <div className="rating-stars">
            <Rating
              count={5}
              value={ratingBygningen}
              onChange={(newRating) => setRatingBygningen(newRating)}
              size={40}
              activeColor="#ffd700"
            />
          </div>
        </div>

        <div className="rating-item">
          <div className="text-container">
            <h3>Rate badet</h3>
            <p>Er du fornøyd med badet og kjøkkenet? Er det rent og stort nok?</p>
          </div>
          <div className="rating-stars">
            <Rating
              count={5}
              value={ratingBadet}
              onChange={(newRating) => setRatingBadet(newRating)}
              size={40}
              activeColor="#ffd700"
            />
          </div>
        </div>

        <div className="rating-item">
          <div className="text-container">
            <h3>Rate kjøkken</h3>
            <p>Hvordan er kjøkkenet?</p>
          </div>
          <div className="rating-stars">
            <Rating
              count={5}
              value={ratingKjokken}
              onChange={(newRating) => setRatingKjokken(newRating)}
              size={40}
              activeColor="#ffd700"
            />
          </div>
        </div>
      </div>

      <div className="button-row">  
        <button className="review2Tilbake" onClick={onBack}>Tilbake</button>
        <button className="review2Neste" onClick={handleNext}>Neste</button>
      </div>
    </div>
  );
};

export default Review2;
