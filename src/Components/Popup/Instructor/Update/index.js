import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UpdateInstructor = (props) => {
  const selectedInstructor = useSelector(state => state.auth.instructor);
  const college = useSelector(state => state.auth.college); // Get the college from Redux store
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedInstructorName, setSelectedInstructorName] = useState('');
  const [instructors, setInstructors] = useState([]);

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
      props.setShowUpdate(false)
    }
  };

  useEffect(() => {
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        const instructorList = response.data;
        setInstructors(instructorList);

        const foundInstructor = instructorList.find(
          (instructor) => instructor.instructorID === selectedInstructor
        );
        if (foundInstructor) {
          setName(foundInstructor.name);
          setSelectedInstructorName(foundInstructor.name);
        }
      })
      .catch((error) => console.log(error));
  }, [selectedInstructor]);

  const handleFormSubmit = () => {
    if (name.trim() === '') {
      setErrorMessage('Please provide an Instructor');
    } else {
      if (name !== selectedInstructorName) {
        // Check for duplicate names only if the name has been edited
        const isDuplicateName = instructors.some((instructor) => instructor.name === name);
        if (isDuplicateName) {
          setErrorMessage('Instructor with this name already exists');
          return;
        }
      }
      
  
    const formData = new FormData();
    formData.append('new_name', name);
    formData.append('college', college); // Include the college in the form data
  
    axios.post(`https://classscheeduling.pythonanywhere.com/update_instructor/${selectedInstructor}/`, formData)
      .then((response) => {
        
        // Handle the response or perform any additional actions
        
        navigate('/');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
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
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Instructor</h2>
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
      
      <h3 style={{ marginTop: '50px' }}>Instructor Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyPress}
      />

        {errorMessage && <p>{errorMessage}</p>}
  
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateInstructor(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateInstructor;