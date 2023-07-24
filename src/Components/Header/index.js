import React from 'react';
import USTP from '../../Assets/USTP logo.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse,selectYear ,logout } from '../Redux/Auth/AuthSlice';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={{ backgroundColor: '#060e57', padding: '1px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={USTP} alt="USTP logo" style={{ width: '45px', height: '45px', margin: '5px', cursor: 'pointer' }} onClick={handleNavigateToHome} />
        <h1 style={{ color: 'white', fontSize: '20px', marginLeft: '10px', cursor: 'pointer' }} onClick={handleNavigateToHome}>
          UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES
        </h1>
      </div>
      <span style={{ color: 'white', fontSize: '16px', marginRight: '15px', marginTop: '-4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleLogout}>
        Logout
      </span>
    </div>
  );
}

export default Header;
