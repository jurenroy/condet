import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddRooms = (props) => {
  const [roomname, setRoomname] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const [roomDropdownEnabled, setRoomDropdownEnabled] = useState(false);
  const [buildingz, setBuildingz] = useState('');
  const [excludedRooms, setExcludedRooms] = useState([]);

  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const selectedType = useSelector(state => state.auth.type);

  useEffect(() => {
    // Fetch building data
    axios.get('https://classscheeduling.pythonanywhere.com/get_buildinglist_json/')
      .then((response) => {
        setBuildings(response.data); // Assuming the API returns an array of buildings
      })
      .catch((error) => {
        console.error('Error fetching buildings:', error);
      });

    // Fetch room data
    axios.get('https://classscheeduling.pythonanywhere.com/get_roomlist_json/')
      .then((response) => {
        setRooms(response.data); // Assuming the API returns an array of rooms
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []); // Run only once when the component mounts

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
  
  const handleAddRoom = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    // eslint-disable-next-line
    if (roomname.trim() === '' && buildingNumber.trim() === ''|| !selectedCourse || !selectedType) {
      setError('All fields are required to fill in.');
      
    }else if (roomname.trim() === '' ) {
      setError('Please input a valid Room Name'|| !selectedCourse || !selectedType);
    
    }else
      if (buildingNumber.trim() === ''|| !selectedCourse || !selectedType) {
        setError('Please input a valid Building Number');
      }else{

    // Create FormData object
    const formData = new FormData();
    formData.append('roomname', roomname);
    formData.append('building_number', buildingNumber);
    formData.append('roomtype', selectedType);

    // Send the room data to the Django backend
    axios
      .post(`https://classscheeduling.pythonanywhere.com/add_room/${selectedCollege}/`, formData)
      .then((response) => {
        console.log(response.data.message); // You can show this message to the user if needed
        props.setShowAddRooms(false); // Close the add room form
        window.location.reload();
      })
      .catch((error) => {
        // Handle error response
        if (error.response) {
          setError(error.response.data.message || 'An error occurred.');
        } else {
          setError('An error occurred.');
        }
      });
    }
  };

  useEffect(() => {
    // Fetch room data from the excluded API
    axios.get('https://classscheeduling.pythonanywhere.com/get_room_json/')
      .then((response) => {
        setExcludedRooms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching excluded rooms:', error);
      });
  }, []); // Run only once when the component mounts
  
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
      border: '1px solid black',
      borderRadius: '10px',
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Rooms ({selectedType})</h2>
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
      }}/>
      <h3 style={{ marginTop: '50px' }}>Building:</h3>
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        value={buildingNumber}
        onChange={(e) => {
          setBuildingNumber(e.target.value);
          setRoomDropdownEnabled(true);
          setRoomname(''); // Reset room name when building changes
          setBuildingz(buildings.find(building => building.name === e.target.value)?.buildinglistID || '');
        }}
        required
      >
        <option value="" disabled>Select a building</option>
        {buildings.map((building) => (
          <option key={building.buildinglistID} value={building.name}>
            {building.name}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: '12px' }}>Room Name:</h3>
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        value={roomname}
        onChange={(e) => setRoomname(e.target.value) }
        required
        disabled={!roomDropdownEnabled}
      >
        <option value="" disabled>Select a room</option>
        {rooms
          .filter((room) => room.building === buildingz && !excludedRooms.some(excludedRoom => excludedRoom.roomname === room.name))
          .map((room) => (
            <option key={room.roomlistID} value={room.name}> 
              {room.name}
            </option>
          ))}
      </select>


      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddRoom}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddRooms(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddRooms;