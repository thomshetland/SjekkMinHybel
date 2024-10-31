import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext/context'; // Import useAuth to access currentUser
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase'; // Import Firebase auth instance
import './navbarStyle.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Access currentUser from context

  // Navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHjemClick = () => {
    navigate('/');
  };

  // Handle the "Legg til vurdering" click
  const handleReviewClick = () => {
    if (currentUser) {
      // User is logged in, navigate to the review page
      navigate('/review');
    } else {
      // User is not logged in, navigate to the login page
      navigate('/login');
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out the user
      navigate('/login');  // Optionally navigate to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className='navbar'>
      <img src={logo} alt="logo" className='logo' onClick={handleHjemClick} />
      <div className='nav-content'>
        <ul>
          <li className='navbarText' onClick={handleHjemClick}>Hjem</li>
          <li className='navbarText' onClick={handleReviewClick} style={{ cursor: 'pointer' }}>
            Legg til vurdering
          </li>
          {/* Conditionally render "Logg inn / Registrer" or "Logg ut" based on currentUser */}
          {currentUser ? (
            <li className='navbarText' onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logg ut
            </li>
          ) : (
            <li className='navbarText' onClick={handleLoginClick} style={{ cursor: 'pointer' }}>
              Logg inn / Registrer
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
