import React, { useState } from 'react';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png'

function Timeslots() {
  // Sample data for rooms with random descriptions
  const roomsData = [
    {
      roomname: '301',
      buildingnumber: '09',
    },
    {
        roomname: '302',
        buildingnumber: '09',
    },
    {
        roomname: '303',
        buildingnumber: '09',
    },
    // Add more rooms as needed
  ];

  const [isLectureChecked, setIsLectureChecked] = useState(false);
  const [isLaboratoryChecked, setIsLaboratoryChecked] = useState(false);

  const handleLectureCheckboxChange = (event) => {
    setIsLectureChecked(event.target.checked);
  };

  const handleLaboratoryCheckboxChange = (event) => {
    setIsLaboratoryChecked(event.target.checked);
  };

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <h2>Timeslots</h2>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <input
            type="checkbox"
            checked={isLectureChecked}
            onChange={handleLectureCheckboxChange}
          />
          <h3>Lecture</h3>
          <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}/>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <input
            type="checkbox"
            checked={isLaboratoryChecked}
            onChange={handleLaboratoryCheckboxChange}
          />
          <h3>Laboratory</h3>
          <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}/>
        </div>
      </div>
    </div>
  );
}

export default Timeslots;
