import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UpdateRoom = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedType = useSelector(state => state.auth.type);
  const selectedRoom = useSelector(state => state.auth.room);
  const navigate = useNavigate();

  const [roomname, setRoomname] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_room_json/')
      .then(response => {
        const roomData = response.data;
        if (roomData) {
          // Find the room based on selectedCourseAbbreviation, selectedType, and selectedRoom
          const foundRoom = roomData.find(room => 
            room.course === selectedCourseAbbreviation &&
            room.roomtype === selectedType &&
            room.roomname === selectedRoom
          );

          if (foundRoom) {
            setRoomname(foundRoom.roomname);
            setBuildingNumber(foundRoom.building_number);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedType, selectedRoom]);

  const handleFormSubmit = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!roomname || !buildingNumber) {
      setError('All fields are required.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('roomname', roomname);
    formData.append('building_number', buildingNumber);
    formData.append('roomtype', selectedType);

    // Send the updated room data to the Django backend using PUT method
    axios
      .post(`http://127.0.0.1:8000/update_room/${selectedCourseAbbreviation}/${selectedRoom}/`, formData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
        // Handle the response or perform any additional actions
        props.setShowUpdate(false); // Close the update room form
        navigate(`/${selectedCourseAbbreviation}`);
        
      })
      .catch((error) => {
        // Handle error response
        
      });
  };


  return (
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
      <h2 style={{ marginTop: '12px' }}>Update Room</h2>
      <h3 style={{ marginTop: '12px' }}>Room Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={roomname}
        onChange={(e) => setRoomname(e.target.value)}
      />

      <h3 style={{ marginTop: '12px' }}>Building Number:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={buildingNumber}
        onChange={(e) => setBuildingNumber(e.target.value)}
      />

      {error && <p style={{ color: 'white' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateRooms(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateRoom;
