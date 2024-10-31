// src/components/ProtectedAdminRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../authContext/context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const ProtectedAdminRoute = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().role === 'Admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    };

    checkAdminRole();
  }, [currentUser]);

  // If admin status is still loading, show a loading message
  if (isAdmin === null) return <p>Loading...</p>;

  // If user is not an admin or not logged in, redirect to home page
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
