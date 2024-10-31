import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../global/navbar.js";
import Footer from "../global/footer.js";
import { collection, getDocs } from "firebase/firestore"; // Firestore methods
import { db, storage } from '../../firebase/firebase.js'; // Import Firebase storage
import { ref, getDownloadURL } from "firebase/storage"; // Storage methods
import './homestyle.css';

import schoolImage from '../../assets/schoolimage.png';
import ratingBilde from '../../assets/ratingbilde.png';
import finnBilde from '../../assets/Finnbilde.png';
import { useAuth } from '../../authContext/context.js';

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const schoolsCollection = collection(db, 'schools');
        const schoolsSnapshot = await getDocs(schoolsCollection);

        // Fetch all school documents and map them to include download URLs for images
        const schoolsList = await Promise.all(
          schoolsSnapshot.docs.map(async doc => {
            const schoolData = doc.data();
            let imageURL = null;

            // If fileLocation exists, fetch the image URL from Firebase Storage
            if (schoolData.fileLocation) {
              const fileRef = ref(storage, schoolData.fileLocation);
              imageURL = await getDownloadURL(fileRef);
            }

            return {
              id: doc.id,
              ...schoolData,
              imageURL // Store the fetched image URL
            };
          })
        );

        setSchools(schoolsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to load schools');
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleSchoolClick = (schoolId) => {
    navigate(`/school/${schoolId}`);
  };

  return (
    <div className='homeContainer'>
      <Navbar />
      <div className='mainContainer'>
        <div className="schoolContainer">
          <div className="schoolColumn">
            <img src={schoolImage} className='schoolImage' alt="School view" />
          </div>
          <div className="blueColumn">
            <div className="blueRow">
              Se hva andre synes om studenthybelene ved skolen din!
            </div>
            <div className="blueRow">
              <input
                type="search"
                placeholder="Finn din skole her"
                className='searchBar'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="middleContainer">
          <div className="middleRow">
            <div className="middleColumn">
              <img src={finnBilde} alt="Finn image" />
            </div>
            <div className="middleColumn">
              <p>Usikker på studenthybel?</p>
              <p>Vi har samlet anmeldelser av studenthybler fra hele landet for å gjøre dine valg lettere. Her kan du lese om hvordan andre studenter har opplevd å bo på studenthybler.</p>
            </div>
          </div>

          <div className="middleRow">
            <div className="middleColumn">
              <p>Skriv en anonym vurdering</p>
              <p>Del hvordan du opplevde din studenthybel. Anmeldelsene er helt anonyme.</p>
            </div>
            <div className="middleColumn">
              <img src={ratingBilde} alt="Rating illustration" />
            </div>
          </div>
        </div>

        <div className="schoolShowCase">
          {loading && <p>Loading schools...</p>}
          {error && <p>{error}</p>}
          <div className="schoolGrid">
            {!loading && !error && schools.map(school => (
              <div 
                className="schoolCard" 
                key={school.id}
                onClick={() => handleSchoolClick(school.id)}
              >
                <div className="schoolCardHeader">
                  <h3>{school.shortName || school.id}</h3>
                  <p>{school.id}</p>
                </div>
                <div className="schoolCardImageContainer">
                  {school.imageURL ? (
                    <img src={school.imageURL} alt={`${school.shortName || school.id}`} className="schoolImage" />
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
