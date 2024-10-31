import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../global/navbar';
import Footer from '../global/footer';
import './thanksStyle.css'; // Import the CSS file for styling

const Thanks = () => {
  const navigate = useNavigate();

  // Handle "Go to Home" button click
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="thanks-container">
      <Navbar /> {/* Keep the Navbar at the top */}

      <div className="thanks-content">
        <h2>Tusen takk for din vurdering av <span className="highlight">studenthybel</span>!</h2>
        <p>
          Din vurdering er nå sendt videre til godkjenning og vil snart bli publisert.
        </p>
        <button className="go-home-button" onClick={handleGoHome}>Tilbake til Hjem</button>
      </div>

      <Footer /> {/* Keep the Footer at the bottom */}
    </div>
  );
};

export default Thanks;
