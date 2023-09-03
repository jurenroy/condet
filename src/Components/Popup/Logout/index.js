import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Auth/AuthSlice';

const Logout = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const YesLogout = () => {
      dispatch(logout());
    navigate('/')
};


  return (
  <div style={{display: 'flex'}}>
       {/* kadtong blur sa likod */}
      <div style={{position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        zIndex: 1}}>

          {/* Color sa container na popup  */}
        <div style={{
          backgroundColor: 'white',
          border:'1px solid black',
          position: 'relative',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          height: '140px',
          width: '380px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '20px'
        }}>
          {/* Color blue sa taas */}
          <div style={{
            backgroundColor: '#060E57', 
            height: '14px',
            width: '400px', 
            position: 'absolute',
            left:'0%',
            top: '0%', 
            borderTopRightRadius:'18px',
            borderTopLeftRadius:'18px',
            padding: '10px',
          }}/>

            {/* Color yellow sa ubos */}
            <div style={{
              backgroundColor: '#FAB417', 
              height: '14px',
              width: '416.2px', 
              position: 'absolute',
              left:'0.2%',
              top: '91%', 
              borderBottomRightRadius:'18px',
              borderBottomLeftRadius:'18px',
              padding: '1px',
            }}/>

          <h2 style={{marginTop:'12px'}}>Are you sure you want to logout?</h2>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
              <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={YesLogout}>Yes</button>
              <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowLogout(false)}>No</button>
          </div>
      </div>
    </div>
  </div>
  )
}

export default Logout