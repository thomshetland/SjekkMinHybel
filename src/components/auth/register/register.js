import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../authContext/context';
import { doCreateUserWithEmailandPassword } from '../../../firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './registerStyle.css';

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

 
  const { userLoggedIn } = useAuth();
  const firestore = getFirestore(); // Initialize Firestore

  const onSubmit = async (e) => {
    e.preventDefault();

    // Check if already in the process of registering
    if (isRegistering) return;

    setIsRegistering(true);

    // Password match validation
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsRegistering(false);
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await doCreateUserWithEmailandPassword(email, password);
      const user = userCredential.user;

      // Create a document in Firestore under 'users' collection
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        school,
        userId: user.uid,
        email: user.email, // Store email for reference
        role: 'Student'
      });

      console.log("User registered and document created in Firestore.");
      navigate('/'); // Navigate to the home page after registration
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to={'/'} replace={true} />}

      <div className="register-container">
        <main className="register-card">
          <button onClick={() => navigate('/')} className="back-button">← Tilbake til Hjem</button>
          <h3 className="register-title">Lag en bruker</h3>

          <form onSubmit={onSubmit} className="register-form">
            <div className="form-item">
              <label className="label">Fornavn</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-item">
              <label className="label">Etternavn</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-item">
              <label className="label">Skole</label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-item">
              <label className="label">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-item">
              <label className="label">Passord</label>
              <input
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-item">
              <label className="label">Gjenta Passord</label>
              <input
                type="password"
                autoComplete="off"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {errorMessage && <span className="error-message">{errorMessage}</span>}

            <button
              type="submit"
              disabled={isRegistering}
              className={`primary-button ${isRegistering ? 'disabled' : ''}`}
            >
              {isRegistering ? 'Registerer...' : 'Registrer'}
            </button>

            <div className="text-sm text-center">
              Har du allerede bruker? <Link to={'/login'} className="sign-up-link">Logg inn</Link>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Register;
