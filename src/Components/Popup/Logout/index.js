import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Auth/AuthSlice';

const Logout = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const YesLogout = () => {
      dispatch(logout());
      navigate('/');
    };

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',  // Center horizontally
        alignItems: 'center',      // Center vertically
        height: '100vh',           // Full viewport height
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,  // Increase the zIndex value to make it the topmost layer
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid black',
          borderRadius: '20px',
          padding: '20px',
          width: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',  // Center content horizontally
          justifyContent: 'center',  // Center content vertically
        }}>
          <div style={{
            backgroundColor: '#060E57',
            height: '14px',
            width: '400px',
            borderTopRightRadius: '18px',
            borderTopLeftRadius: '18px',
            padding: '10px',
            marginTop: '-160px',
            position: 'absolute'
          }} />
          <div style={{
            backgroundColor: '#FAB417',
            height: '14px',
            width: '416.4px',
            borderBottomRightRadius: '18px',
            borderBottomLeftRadius: '18px',
            padding: '1px',
            position: 'absolute',
            marginTop: '173px'
          }} />
          <h3 style={{ marginTop: '22px' }}>Are you sure you want to logout?</h3>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
            <button style={{ height: '35px', width: '150px', borderRadius: '10px', cursor: 'pointer', marginRight: '20%', marginTop: '-20px' }} onClick={YesLogout}>Yes</button>
            <p>.</p>
            <button style={{ height: '35px', width: '150px', borderRadius: '10px', cursor: 'pointer', marginTop: '-20px' }} onClick={() => props.setShowLogout(false)}>No</button>
          </div>
        </div>
      </div>
    );
}

export default Logout;
