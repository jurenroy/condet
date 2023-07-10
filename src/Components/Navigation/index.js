import React from 'react';
import home from '../../Assets/homeicon.png'

function Navbar() {
  return (
    <div style={{ backgroundColor: 'white', height: '40px', padding: '1px', marginTop: '10px', marginBottom: '10px', display:'flex', flexDirection: 'row'}}>
      <img src={home} alt="home icon" style={{ width: '25px', height: '25px', marginLeft: '10px', marginTop: '5px' }}/>
      <h3 style={{color: '#AAAAAA', marginLeft: '5px', marginTop: '5px'}}>Home</h3>
    </div>
  );
}

export default Navbar;
