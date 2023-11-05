import React, { useState, useRef } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddInstructor = (props) => {
    const [name, setname] = useState('');
    // eslint-disable-next-line
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const college = useSelector(state => state.auth.college);

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
        handleAddCourse();
      }
      if (e.key === 'Escape') {
        props.setShowAdd(false)
      }
    };

    const handleAddCourse = () => {
      
       if (name.trim() === ''){
        setErrorMessage('Please provide Instructor');
        
      }
      
      else{

      const formData = new FormData();
      formData.append('name', name);
      formData.append('college', college);
  
      axios
        .post('https://classscheeduling.pythonanywhere.com/add_instructor/', formData)
        .then(response => {
          console.log(response.data);
          // setSuccessMessage(response.data.message);
          // setErrorMessage('');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('Error adding course');
          setSuccessMessage('');
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Instructor</h2>
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

      <h3 style={{marginTop:'50px'}}>Instructor Name:</h3>

      <input
        style={{ height: '40px', borderRadius: '10px', fontSize:'20px' }}
        type="text" 
        value={name} 
        onChange={e => setname(e.target.value)}
        onKeyDown={handleKeyPress}
      />


      {/* {successMessage && <p>{successMessage}</p>} */}
      {errorMessage && <p>{errorMessage}</p>}
      
      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddCourse}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddInstructor(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default AddInstructor;