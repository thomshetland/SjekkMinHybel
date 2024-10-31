// footer.js
import React from 'react';
import './footerStyle.css';  // Import the CSS file for styling

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-content'>
        <ul className='footer-links'>
          <li className='footerText'>Kontakt</li>
          <li className='footerText'>Om oss</li>
          <li className='footerText'>Retningslinjer</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
