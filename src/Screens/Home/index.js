import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import USTP from '../../Assets/USTP logo.png';
import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { selectCourse, selectYear } from '../../Components/Redux/Auth/AuthSlice';

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  if (location.pathname === "/") {
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
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




