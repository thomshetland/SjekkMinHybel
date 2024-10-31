import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase/firebase.js';
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../global/navbar.js";
import Footer from "../global/footer.js";
import './SchoolDetailStyle.css';

function SchoolDetail() {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const docRef = doc(db, "schools", schoolId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const schoolData = docSnap.data();
          setSchool(schoolData);

          if (schoolData.fileLocation) {
            const fileRef = ref(storage, schoolData.fileLocation);
            const url = await getDownloadURL(fileRef);
            setImageURL(url);
          }

          const citiesCollection = collection(db, "cities");
          const citiesQuery = query(citiesCollection, where("schools", "array-contains", schoolData.shortName));
          const citiesSnapshot = await getDocs(citiesQuery);

          const citiesList = await Promise.all(
            citiesSnapshot.docs.map(async (doc) => {
              const cityData = doc.data();
              let cityImageURL = null;

              if (cityData.imageLocation) {
                const cityFileRef = ref(storage, cityData.imageLocation);
                cityImageURL = await getDownloadURL(cityFileRef);
              }

              return {
                name: doc.id,
                imageURL: cityImageURL,
              };
            })
          );

          setCities(citiesList);

        } else {
          setError("School not found");
        }
      } catch (err) {
        console.error("Error fetching school data:", err);
        setError("Failed to load school data");
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  const handleBackClick = () => {
    navigate(`/`);
  };

  // Update handleCityClick to include both schoolId and cityName in the URL
  const handleCityClick = (cityName) => {
    navigate(`/dormReviews/${schoolId}/${cityName}`);
  };

  if (loading) return <p>Henter informasjon om skolen...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='schoolDetailContainer'>
      <Navbar />

      <div className="headerImageContainer">
        {imageURL && <img src={imageURL} alt={`${school?.shortName || schoolId} Image`} className="headerImage" />}
        <div className="headerOverlay">
          <h1 className="schoolTitle">{school?.shortName || schoolId}</h1>
          <p className="schoolLocation">{cities.map(city => city.name).join(", ")}</p>
        </div>
      </div>


    <div className='citycontainer'>
    <div className="backText" onClick={handleBackClick}>
          ← Tilbake
        </div>

      <div className="contentContainer">
        
        <div className="associatedCities">
          <h3>Her finner man skolen i:</h3>
          {cities.length > 0 ? (
            <div className="cityGrid">
              {cities.map(city => (
                <div
                  className="cityCard"
                  key={city.name}
                  onClick={() => handleCityClick(city.name)}  // Add onClick event
                  style={{ cursor: 'pointer' }}  // Change cursor to pointer to indicate clickable
                >
                  {city.imageURL ? (
                    <img src={city.imageURL} alt={`${city.name} Image`} className="cityImage" />
                  ) : (
                    <div className="cityImagePlaceholder">Ingen bilder tilgjengelige</div>
                  )}
                  <p className="cityName">{city.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Ingen skoler i denne byen.</p>
          )}
        </div>

        <div className="schoolInfo">
          <h2>Om {school?.shortName || schoolId}</h2>
          <p>{school?.description || "Ingen beskrivelse tilgjengelig."}</p>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export default SchoolDetail;
