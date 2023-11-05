import React, { useState, useEffect, useRef } from 'react';
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFormSubmit();
    }
    
    if (e.key === 'Escape') {
      props.setShowUpdateRooms(false)
    }
    
  };

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_room_json/')
      .then(response => {
        const roomData = response.data;
        if (roomData) {
          // Find the room based on selectedCourseAbbreviation, selectedType, and selectedRoom
          const foundRoom = roomData.find(room => 
            room.course === selectedCourseAbbreviation &&
            room.roomtype === selectedType &&
            room.roomID === selectedRoom
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

    if (roomname.trim() === '' && buildingNumber.trim() === '') {
      setError('All fields are required to fill in.');
      
    }else if (roomname.trim() === '' ) {
      setError('Please input a valid Room Name');
    
    }else
      if (buildingNumber.trim() === '') {
        setError('Please input a valid Building Number');
      }else{


    // Create FormData object
    const formData = new FormData();
    formData.append('roomname', roomname);
    formData.append('building_number', buildingNumber);
    formData.append('roomtype', selectedType);

    // Send the updated room data to the Django backend using PUT method
    axios
      .post(`https://classscheeduling.pythonanywhere.com/update_room/${selectedCourseAbbreviation}/${selectedRoom}/`, formData)
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
    }
  };


  return (
     <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px',
      height: '300px',
      width: '400px',
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
      width: '400px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Rooms ({selectedType})</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '437.5px', 
      position: 'absolute',
      left:'0.4%',
      top: '98%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      // padding: '20px',
      }}/>


      <h3 style={{ marginTop: '50px' }}>Building Number:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={buildingNumber}
        onChange={(e) => setBuildingNumber(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      
      <h3 style={{ marginTop: '12px' }}>Room Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={roomname}
        onChange={(e) => setRoomname(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateRooms(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateRoom;