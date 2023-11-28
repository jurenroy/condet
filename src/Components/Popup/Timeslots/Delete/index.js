import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DeleteTimeslot = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.college);
  const selectedTime = useSelector(state => state.auth.time)
  const selectedType = useSelector(state => state.auth.type);
  const [timeslotData, setTimeslotData] = useState(null);

  // State for tracking dragging functionality
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: (window.innerWidth - 400) / 2, // 400 is the width of the component
    y: (window.innerHeight - 300) / 2, // 300 is the height of the component
  });
  
  const dragStartPos = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartPos.current = null;
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
    
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });
    
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_timeslot_json/')
      .then(response => {
        const timeslotData = response.data;
        if (timeslotData) {
          // Find the room based on selectedCourseAbbreviation and selectedRoom
          const foundTimeslot = timeslotData.find(timeslot => 
            timeslot.college === parseInt(selectedCourseAbbreviation) &&
            timeslot.timeslotID === selectedTime &&
            timeslot.timeslottype === selectedType
          );

          if (foundTimeslot) {
            setTimeslotData(foundTimeslot);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedTime, selectedType]);

  const handleDelete = () => {
    // Check if roomData is available before proceeding with the delete request
    if (!timeslotData) {
      console.error('Timeslot data not available.');
      return;
    }

    // Send the DELETE request to delete the room with the specified course abbreviation and room name
    axios.delete(`https://classscheeduling.pythonanywhere.com/delete_timeslot/${selectedCourseAbbreviation}/${selectedTime}/`)
      .then((response) => {
        console.log(response.data);
        // Handle the response or perform any additional actions
        props.setShowDeleteTimeslot(false); // Close the delete room form
        window.location.reload(); // Refresh the page after deleting the room
      })
      .catch((error) => {
        // Handle error response
        console.error(error);
      });
  };


  return (
    <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px',
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px',
      border: '1px solid black',
      zIndex: '999',
      cursor: isDragging ? 'grabbing' : 'grab',
    }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      >

      <div style={{
      backgroundColor: '#060E57', 
      height: '20px',
      width: '350px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
         <h2 style={{marginTop:'-2px',color:'white'}}>Delete Timeslot ({selectedType})</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '387.8px', 
      position: 'absolute',
      left:'0.4%',
      top: '97.2%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      }}/>
      {timeslotData ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>{timeslotData.starttime} - {timeslotData.endtime}</span>
          {/* Display other room details as needed */}
        </div>
      ) : (
        <div>
          <h3>Loading timeslot data...</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px'}} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShowDeleteTimeslot(false)}>No</button>
      </div>
    </div>
  );
}

export default DeleteTimeslot;
