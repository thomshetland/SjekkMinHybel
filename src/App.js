import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes
import './App.css';

import Home from './components/homepage/home'
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import MainReviewPage from './components/review/mainReviewPage';
import Thanks from './components/review/thanks';
import SchoolDetail from './components/schools/schoolDetail';
import DormReviews from './components/dormReviews/dormReviews';
import Admin from './components/admin/admin';

import ProtectedAdminRoute from './components/admin/adminControl';

import { AuthProvider } from './authContext/context';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/review' element={<MainReviewPage />} />
            <Route path="/thanks" element={<Thanks />} />
            <Route path='school/:schoolId' element={<SchoolDetail />} />
            <Route path="/dormReviews/:schoolId/:cityName" element={<DormReviews />} />
            <Route path='/admin' element={<Admin />} />

            <Route element={<ProtectedAdminRoute />}>
            {/*Protect the admin route with ProtectedAdminRoute */}
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// hello
export default App;
