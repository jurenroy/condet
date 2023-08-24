import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DeleteTimeslot = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedTime = useSelector(state => state.auth.time)
  const selectedType = useSelector(state => state.auth.type);
  const [timeslotData, setTimeslotData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_timeslot_json/')
      .then(response => {
        const timeslotData = response.data;
        if (timeslotData) {
          // Find the room based on selectedCourseAbbreviation and selectedRoom
          const foundTimeslot = timeslotData.find(timeslot => 
            timeslot.course === selectedCourseAbbreviation &&
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
    axios.delete(`http://127.0.0.1:8000/delete_timeslot/${selectedCourseAbbreviation}/${selectedTime}/`)
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
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px'
    }}>
      <h2 style={{marginBottom: '-10px'}}>Delete Timeslot</h2>
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
