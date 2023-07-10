import React from 'react';
import list from '../../Assets/listicon.png'
import add from '../../Assets/addicon.png'

function Sidebar() {
  return (
    <div style={{ backgroundColor: '#060e57', width: '150px', padding: '20px' }}>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <img src={list} alt="list icon" style={{ width: '25px', height: '25px' }}/>
            <h3 style={{color: 'white', marginTop: '0px', marginLeft: '10px'}}>Courses</h3>
            <img src={add} alt="add icon" style={{ width: '20px', height: '20px', marginTop: '1px', marginLeft: '10px', borderRadius: '50%', border: '2px solid white'}}/>
        </div>
        <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
            <li>Link 4</li>
        </ul>
    </div>
  );
}

export default Sidebar;
