import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DeleteRoom = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedRoom = useSelector(state => state.auth.room);
  const selectedType = useSelector(state => state.auth.type);
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_room_json/')
      .then(response => {
        const roomData = response.data;
        if (roomData) {
          // Find the room based on selectedCourseAbbreviation and selectedRoom
          const foundRoom = roomData.find(room => 
            room.course === selectedCourseAbbreviation &&
            room.roomname === selectedRoom
          );

          if (foundRoom) {
            setRoomData(foundRoom);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedRoom]);

  const handleDelete = () => {
    // Check if roomData is available before proceeding with the delete request
    if (!roomData) {
      console.error('Room data not available.');
      return;
    }

    // Send the DELETE request to delete the room with the specified course abbreviation and room name
    axios.delete(`http://127.0.0.1:8000/delete_room/${selectedCourseAbbreviation}/${roomData.roomname}/`)
      .then((response) => {
        console.log(response.data);
        // Handle the response or perform any additional actions
        props.setShowDeleteRooms(false); // Close the delete room form
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
      <h2 style={{marginBottom: '-10px'}}>Delete Room</h2>
      {roomData ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>Building Number : {roomData.building_number}</span>
          <br />
          <span style={{fontSize: '15px'}}>Room Name: {roomData.roomname}</span>
          {/* Display other room details as needed */}
        </div>
      ) : (
        <div>
          <h3>Loading room data...</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px'}} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShowDeleteRooms(false)}>No</button>
      </div>
    </div>
  );
}

export default DeleteRoom;
