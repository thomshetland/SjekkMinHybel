import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../../firebase/firebase'; // Firebase config
import { useAuth } from '../../authContext/context'; // To get currentUser
import Review1 from './review1';
import Review2 from './review2';
import Review3 from './review3';
import Navbar from '../global/navbar';
import Footer from '../global/footer';
import { useNavigate } from 'react-router-dom'; // Navigation
import './reviewStyle.css';

const MainReviewPage = () => {
  const [currentReview, setCurrentReview] = useState('review1'); // Start with Review1
  const navigate = useNavigate(); // Initialize navigate
  const { currentUser } = useAuth(); // Get current user from context

  // State to collect all data across review steps
  const [reviewData, setReviewData] = useState({
    city: '',
    school: '',
    location: '',
    suitsFor: '',
    ratePlassering: 0,
    rateBygning: 0,
    rateBadet: 0,
    rateKjøkken: 0,
    comment: '', // To be collected from Review3
    approved: false
  });

  // Handle updating review data from different steps
  const collectData = (newData) => {
    setReviewData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  // Function to submit the post to Firestore on "Fullfør"
  const handleFinish = async () => {
    try {
      await addDoc(collection(db, 'posts'), {
        ...reviewData, // Collect all the data from state
        userId: currentUser.uid, // Include userId for the post
      });
      navigate('/thanks'); // Navigate to the Thanks page after submission
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="main-review-page">
      <Navbar /> {/* Navbar stays at the top */}

      {/* Conditionally Render the Selected Review Component */}
      <div className="review-content">
        {currentReview === 'review1' && (
          <Review1
            onNext={(data) => {
              collectData(data); // Collect data from Review1
              setCurrentReview('review2'); // Go to Review2
            }}
            savedData={reviewData} // Pass saved data back to Review1 if user returns
          />
        )}
        {currentReview === 'review2' && (
          <Review2
            onNext={() => setCurrentReview('review3')}
            onBack={() => setCurrentReview('review1')}
            savedData={reviewData} // Pass saved data back to Review2 if user returns
            collectData={collectData} // Collect data from Review2
          />
        )}
        {currentReview === 'review3' && (
          <Review3
            onBack={() => setCurrentReview('review2')}
            onFinish={handleFinish} // Call handleFinish to submit to Firestore
            savedData={reviewData} // Pass saved data back to Review3 if user returns
            collectData={collectData} // Collect data from Review3
          />
        )}
      </div>

      <Footer /> {/* Footer stays at the bottom */}
    </div>
  );
};

export default MainReviewPage;
