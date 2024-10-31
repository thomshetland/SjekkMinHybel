import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './reviewStyle.css';

const Review1 = ({ onNext, savedData }) => {
  const navigate = useNavigate();

  const [city, setCity] = useState(savedData.city || ''); // Populate with saved data if exists
  const [institution, setInstitution] = useState(savedData.school || ''); // Populate with saved data if exists
  const [location, setLocation] = useState(savedData.location || ''); // Populate with saved data if exists
  const [suitsFor, setSuitsFor] = useState(savedData.suitsFor || ''); // Populate with saved data if exists
  const [schools, setSchools] = useState([]); // Store school list
  const [cities, setCities] = useState([]); // Store city list
  const [passerForOptions, setPasserForOptions] = useState([]); // Store "Passer For" options

  // Fetch schools, cities, and "Passer For" options from Firestore
  useEffect(() => {
    const fetchData = async () => {
      // Fetch schools
      const schoolsCollection = collection(db, 'schools');
      const schoolSnapshot = await getDocs(schoolsCollection);
      const schoolList = schoolSnapshot.docs.map((doc) => doc.id);
      setSchools(schoolList);

      // Fetch cities
      const citiesCollection = collection(db, 'cities');
      const citySnapshot = await getDocs(citiesCollection);
      const cityList = citySnapshot.docs.map((doc) => doc.id);
      setCities(cityList);

      // Fetch "Passer For" options
      const passerForCollection = collection(db, 'passerFor');
      const passerForSnapshot = await getDocs(passerForCollection);
      const passerForList = passerForSnapshot.docs.map((doc) => doc.id);
      setPasserForOptions(passerForList);
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (city && institution && location && suitsFor) {
      // Send data back to MainReviewPage before navigating
      onNext({
        city,
        school: institution,
        location,
        suitsFor,
      });
    } else {
      alert('Please fill all fields');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="review-container">
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="step active">1</div>
        <div className="step">2</div>
        <div className="step">3</div>
      </div>

      <h2>Fortell litt om hvor <span className="highlight">hybelen</span> befinner seg.</h2>

      {/* Form Fields */}
      <div className="form-row">
        {/* City Dropdown */}
        <div className="form-group">
          <label>By</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Velg by</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Institution Dropdown */}
        <div className="form-group">
          <label>Utdannings Institusjon</label>
          <select value={institution} onChange={(e) => setInstitution(e.target.value)}>
            <option value="">Velg utdanningsinstitusjon</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Sted</label>
          <input
            type="text"
            placeholder="Sentrum, ved skolen etc."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="last"
          />
        </div>

        <div className="form-group">
          <label>Passer for</label>
          <select value={suitsFor} onChange={(e) => setSuitsFor(e.target.value)} className="last">
            <option value="">Velg målgruppe</option>
            {passerForOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-row">
        <button className="cancel-button" onClick={handleCancel}>Avbryt</button>
        <button className="next-button" onClick={handleNext}>Neste</button>
      </div>
    </div>
  );
};

export default Review1;
