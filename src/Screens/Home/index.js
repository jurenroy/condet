import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import USTP from '../../Assets/USTP logo.png';
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectCourse, selectYear, setAdmin, setCollege, selectType } from '../../Components/Redux/Auth/AuthSlice';
import axios from 'axios';

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const storedUsername = useSelector(state => state.auth.username);
  
  useEffect(() => {
    if (location.pathname === "/") {
      dispatch(selectCourse(''));
      dispatch(selectYear(''));
    }

    // Fetch user data from the API using Axios
    axios.get('http://127.0.0.1:8000/users/')
  .then(response => {
    console.log('Fetched data:', response.data);
    const userData = response.data.find(user => user.email === storedUsername);
    console.log('User data:', userData);
    if (userData) {
      dispatch(setAdmin(userData.isAdmin));
      dispatch(setCollege(userData.college));
    }
  })
  .catch(error => console.log('Error fetching data:', error));
  }, [dispatch, location.pathname, storedUsername]);
  if (location.pathname === "/") {
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
    dispatch(selectType(''));
  }

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={USTP} alt="USTP logo" style={{ width: '450px', height: '450px', margin: '5px' }}/>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>footer man ni sya</p>
      </footer>
    </div>
  );
}

export default Home;




