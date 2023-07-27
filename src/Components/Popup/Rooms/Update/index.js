import React, { useState } from 'react'

const UpdateRooms = (props) => {
    // const [data, setData] = useState({
    //     coursename: '',
    //     abbreviation: ''
    // });
    return(
    <div style={{
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '300px',
      width: '400px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px'
    }}>
      <h2 style={{ marginTop: '12px' }}>Update Rooms</h2>
      <h3 style={{ marginTop: '12px' }}>Building:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        // value={coursename}
        // onChange={(e) => setCoursename(e.target.value)}
      />

      <h3 style={{ marginTop: '12px' }}>Room Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        // value={abbreviation}
        // onChange={(e) => setAbbreviation(e.target.value)}
      />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} >Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateRooms(false)}>Cancel</button>
      </div>
    </div>
  );
}

export default UpdateRooms;