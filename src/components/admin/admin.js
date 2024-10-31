// src/pages/Admin.js

import React, { useEffect, useState } from 'react';
import { getDocs, collection, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import './adminStyle.css';

function Admin() {
  const [selectedSection, setSelectedSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [unapprovedReviews, setUnapprovedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedSection === 'users') {
      fetchUsers();
    } else if (selectedSection === 'posts') {
      fetchUnapprovedReviews();
    }
  }, [selectedSection]);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      setLoading(false);
    }
  };

  // Fetch unapproved reviews from Firestore
  const fetchUnapprovedReviews = async () => {
    try {
      const reviewsCollection = collection(db, 'posts');
      const unapprovedQuery = query(reviewsCollection, where('approved', '==', false));
      const reviewsSnapshot = await getDocs(unapprovedQuery);
      const reviewsList = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUnapprovedReviews(reviewsList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
      setLoading(false);
    }
  };

  // Approve a review
  const handleApproveReview = async (reviewId) => {
    try {
      const reviewRef = doc(db, 'posts', reviewId);
      await updateDoc(reviewRef, { approved: true });
      setUnapprovedReviews(unapprovedReviews.filter(review => review.id !== reviewId)); // Remove from list
      alert("Review approved successfully");
    } catch (err) {
      console.error("Error approving review:", err);
      alert("Failed to approve review");
    }
  };

  // Delete a review (Decline)
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Are you sure you want to decline this review?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'posts', reviewId));
        setUnapprovedReviews(unapprovedReviews.filter(review => review.id !== reviewId)); // Remove review from UI
        alert("Review declined and deleted successfully");
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review");
      }
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.id !== userId)); // Remove user from UI
        alert("User deleted successfully");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="adminContainer">
      <h1>Admin Dashboard</h1>

      <div className="adminPanel">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={selectedSection === 'users' ? 'active' : ''}
            onClick={() => setSelectedSection('users')}
          >
            View All Users
          </button>
          <button
            className={selectedSection === 'posts' ? 'active' : ''}
            onClick={() => setSelectedSection('posts')}
          >
            View Unapproved Reviews
          </button>
        </div>

        {/* Content Area */}
        <div className="content">
          {selectedSection === 'users' ? (
            <div className="section">
              <h2>All Users</h2>
              {loading ? (
                <p>Loading users...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <table className="userTable">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            className="deleteButton"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="section">
              <h2>Unapproved Reviews</h2>
              {loading ? (
                <p>Loading reviews...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <table className="reviewTable">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>City</th>
                      <th>Suitability</th>
                      <th>Bathroom Rating</th>
                      <th>Building Rating</th>
                      <th>Kitchen Rating</th>
                      <th>Location Rating</th>
                      <th>Comment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unapprovedReviews.map(review => (
                      <tr key={review.id}>
                        <td>{review.school}</td>
                        <td>{review.city}</td>
                        <td>{review.suitsFor}</td>
                        <td>{review.rateBadet}</td>
                        <td>{review.rateBygning}</td>
                        <td>{review.rateKjøkken}</td>
                        <td>{review.ratePlassering}</td>
                        <td>{review.comment}</td>
                        <td>
                          <button
                            className="approveButton"
                            onClick={() => handleApproveReview(review.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="declineButton"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            Decline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
