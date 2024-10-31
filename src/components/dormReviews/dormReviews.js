// src/pages/DormReviews.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from '../../firebase/firebase.js';
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../global/navbar.js";
import Footer from "../global/footer.js";
import Rating from 'react-rating-stars-component';
import { FaBath, FaBuilding, FaUtensils, FaMapMarkerAlt } from 'react-icons/fa';
import './dormReviewsStyle.css';

function DormReviews() {
  const { schoolId, cityName } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to determine the color based on the rating value
  const getRatingColor = (rating) => {
    const startColor = { r: 76, g: 175, b: 80 };   // #4CAF50 (green)
    const endColor = { r: 255, g: 87, b: 34 };     // #FF5722 (red)

    const ratio = rating / 5; // Ratio based on the rating (0 to 1)
    const r = Math.round(startColor.r * ratio + endColor.r * (1 - ratio));
    const g = Math.round(startColor.g * ratio + endColor.g * (1 - ratio));
    const b = Math.round(startColor.b * ratio + endColor.b * (1 - ratio));

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityRef = doc(db, "cities", cityName);
        const citySnap = await getDoc(cityRef);

        if (citySnap.exists()) {
          const cityData = citySnap.data();
          setCity(cityData);

          if (cityData.imageLocation) {
            const imageRef = ref(storage, cityData.imageLocation);
            const url = await getDownloadURL(imageRef);
            setImageURL(url);
          }
        } else {
          setError("City not found");
        }

        const postsCollection = collection(db, "posts");
        const postsQuery = query(
          postsCollection,
          where("school", "==", schoolId),
          where("city", "==", cityName),
          where("approved", "==", true)
        );
        const postsSnapshot = await getDocs(postsQuery);

        const postsList = postsSnapshot.docs.map((doc) => {
          const data = doc.data();
          const overallRating = (
            (data.rateBadet + data.rateBygning + data.rateKjøkken + data.ratePlassering) / 4
          ).toFixed(1);

          return {
            ...data,
            overallRating: parseFloat(overallRating)
          };
        });

        setReviews(postsList);

        if (postsList.length > 0) {
          const totalBadet = postsList.reduce((acc, post) => acc + post.rateBadet, 0);
          const totalBygning = postsList.reduce((acc, post) => acc + post.rateBygning, 0);
          const totalKjøkken = postsList.reduce((acc, post) => acc + post.rateKjøkken, 0);
          const totalPlassering = postsList.reduce((acc, post) => acc + post.ratePlassering, 0);

          setAverageRatings({
            badet: (totalBadet / postsList.length).toFixed(1),
            bygning: (totalBygning / postsList.length).toFixed(1),
            kjøkken: (totalKjøkken / postsList.length).toFixed(1),
            plassering: (totalPlassering / postsList.length).toFixed(1),
          });
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId, cityName]);

  const handleBackClick = () => {
    navigate(`/school/${schoolId}`);
  };

  if (loading) return <p>Henter bolig-vurderinger...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='dormReviewsContainer'>
      <Navbar />

      <div className="headerImageContainer">
        {imageURL && <img src={imageURL} alt={`${cityName}`} className="headerImage" />}
        <div className="headerOverlay">
          <h1 className="cityTitle">{cityName}</h1>
          <p className="citySubtitle">{schoolId}</p>
        </div>
      </div>

      <div className="dormReviewContentContainer">
        <div className="backText" onClick={handleBackClick}>
          ← Tilbake
        </div>

        <div className="infoSection">
          <div className="cityDescription">
            <p>{city?.description || "No description available."}</p>
          </div>
          <div className="averageRatings">
            <h3>Gjennomsnittlig vurdering</h3>
            <div className="ratingItem">
              <div className="ratingLabel">
                <FaBath className="icon" /> <span>Bad:</span>
              </div>
              <Rating value={parseFloat(averageRatings.badet)} edit={false} size={28} isHalf={true} />
            </div>
            <div className="ratingItem">
              <div className="ratingLabel">
                <FaBuilding className="icon" /> <span>Bygning:</span>
              </div>
              <Rating value={parseFloat(averageRatings.bygning)} edit={false} size={28} isHalf={true} />
            </div>
            <div className="ratingItem">
              <div className="ratingLabel">
                <FaUtensils className="icon" /> <span>Kjøkken:</span>
              </div>
              <Rating value={parseFloat(averageRatings.kjøkken)} edit={false} size={28} isHalf={true} />
            </div>
            <div className="ratingItem">
              <div className="ratingLabel">
                <FaMapMarkerAlt className="icon" /> <span>Lokasjon:</span>
              </div>
              <Rating value={parseFloat(averageRatings.plassering)} edit={false} size={28} isHalf={true} />
            </div>
          </div>
        </div>

        <div className="reviewsSection">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="reviewCard">
                {/* Row 1: Overall Rating Box */}
                <div className="overallRatingRow">
                  <div
                    className="averageRatingBox"
                    style={{
                      backgroundColor: getRatingColor(review.overallRating),
                    }}
                  >
                    {review.overallRating}
                  </div>
                </div>
                
                {/* Row 2: Ratings and Comment */}
                <div className="reviewDetailsRow">
                  <div className="reviewRatings">
                    <div className="ratingItem">
                      <span>Bad:</span>
                      <Rating value={review.rateBadet} edit={false} size={28} isHalf={true} />
                    </div>
                    <div className="ratingItem">
                      <span>Bygning:</span>
                      <Rating value={review.rateBygning} edit={false} size={28} isHalf={true} />
                    </div>
                    <div className="ratingItem">
                      <span>Kjøkken:</span>
                      <Rating value={review.rateKjøkken} edit={false} size={28} isHalf={true} />
                    </div>
                    <div className="ratingItem">
                      <span>Lokasjon:</span>
                      <Rating value={review.ratePlassering} edit={false} size={28} isHalf={true} />
                    </div>
                  </div>
                  <div className="reviewComment">
                    <p>{review.comment || "Ingen kommentar."}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Ingen vurderinger er tilgjengelige.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DormReviews;
