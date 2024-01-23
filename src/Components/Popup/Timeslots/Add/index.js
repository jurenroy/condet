import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import TimePicker from '../../../TimePicker/index'

const AddTimeslot = (props) => {
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [error, setError] = useState('');

  const selectedCollege = useSelector(state => state.auth.college);
  const selectedType = useSelector(state => state.auth.type);

  useEffect(() => {
    // Reset error to an empty string when starttime or endtime changes
    setError('');
  }, [starttime, endtime]);

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
  
    const handleMilitaryTimeChange = (militaryTime) => {
        setStarttime(militaryTime);
    };

    const handleMilitaryTimeChange2 = (militaryTime) => {
        setEndtime(militaryTime);
    };


    const [timeslotData, setTimeslotData] = useState([]);

    useEffect(() => {
      // Fetch data from the API
      fetch('https://classscheeduling.pythonanywhere.com/get_timeslot_json/')
        .then(response => response.json())
        .then(data => {
          // Filter the data based on the selected college
          const filteredTimeslot = data.filter(timeslot => timeslot.college === parseInt(selectedCollege) && timeslot.timeslottype === selectedType);
          // Sort the filteredTimeslot array based on starttime (earliest timeslot first)
          console.log(data)
          console.log(selectedCollege)
          filteredTimeslot.sort((a, b) => a.starttime.localeCompare(b.starttime));
          setTimeslotData(filteredTimeslot);
        })
        .catch(error => console.log(error));
    }, [selectedCollege, selectedType]);

   

  const handleAddTimeslot = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!starttime || !endtime || !selectedCollege || !selectedType) {
      setError('All fields are required to fill in.');
      return;
    } else if (starttime >= endtime){
      setError('Invalid Time Range');
      return;
    }

    // eslint-disable-next-line
    const bufferMinutes = 1;

    // Check if the new timeslot overlaps with existing timeslots
    const isOverlap = timeslotData.some(existingTimeslot => {
      const condition1 = starttime >= existingTimeslot.starttime && starttime < existingTimeslot.endtime && starttime !== existingTimeslot.endtime;
      const condition2 = endtime > existingTimeslot.starttime && endtime < existingTimeslot.endtime;
      const condition3 = starttime <= existingTimeslot.starttime && endtime >= existingTimeslot.endtime;
    
      if (condition1 || condition2 || condition3) {
        console.log('Overlap condition triggered:');
        console.log('Existing Timeslot:', existingTimeslot);
        console.log('New Timeslot:', { starttime, endtime });
      }
    
      return condition1 || condition2 || condition3;
    });
    

  if (isOverlap) {
    setError('Cannot insert between an existing time range.');
    return;
  }

    // Create FormData object
    const formData = new FormData();
    formData.append('starttime', starttime);
    formData.append('endtime', endtime);
    formData.append('timeslottype', selectedType);

    // Send the room data to the Django backend
    axios
      .post(`https://classscheeduling.pythonanywhere.com/add_timeslot/${selectedCollege}/`, formData)
      .then((response) => {
        console.log(response.data.message); // You can show this message to the user if needed
        props.setShowAddTimeslot(false); // Close the add room form
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Timeslot ({selectedType})</h2>
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
      <h3 style={{marginTop:'50px'}}>Start Time:</h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange} />
      

      <h3 style={{marginTop:'12px'}}>End Time:</h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange2} />

      {error && <p style={{ color: 'red', marginBottom: '-30px', marginTop: '-0px' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddTimeslot}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddTimeslot(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddTimeslot;
