import React from 'react';
import USTP from '../../Assets/USTP logo.png';

function Header() {
  return (
    <div style={{backgroundColor: '#060e57', padding: "1px", display: 'flex', flexDirection: 'row'}}>
        <img src={USTP} alt="USTP logo" style={{ width: '45px', height: '45px', margin: '5px' }}/>
        <h1 style={{color: 'white', fontSize: '20px', marginLeft: '10px'}}>UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES</h1>
    </div>
  );
}

export default Header;
