import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

const EditSection = (props) => {
  const [action, setAction] = useState('add');
  const [iterations, setIterations] = useState(1);
  const [error, setError] = useState('');

  const selectedCourse = useSelector(state => state.auth.course);
    const selectedYear = useSelector(state => state.auth.year)


    const handleDropdownChange = (event) => {
        setAction(event.target.value);
      };
    
      const handleIterationsChange = (event) => {
        setIterations(parseInt(event.target.value, 10));
        setError("")
        if (iterations < 1){
            setError("Invalid integer(above 0)")
        }
      };

      const handleIterate = () => {
        for (let i = 0; i < iterations; i++) {
          if (action === 'add') {
            addSection();
          } else if (action === 'delete') {
            deleteSection();
          }
        }
      };

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


    const addSection = () => {
        // Make a POST request to the add_section endpoint with the selectedCourse and selectedYear
        fetch(`https://classscheeduling.pythonanywhere.com/add_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
          method: 'POST',
        })
          .then(response => response.json())
          .then(data => {
            // Refresh the sections after adding
            fetch('https://classscheeduling.pythonanywhere.com/get_section_json/')
              .then(response => response.json())
              .then(data => {
                props.setShowUpdate(false)  
                window.location.reload(); 
                          
              })
              .catch(error => console.error('Error fetching sections:', error));
          })
          .catch(error => console.error('Error adding section:', error));
      };
    
      const deleteSection = () => {
        // Make a DELETE request to the delete_section endpoint with the selectedCourse and selectedYear
        fetch(`https://classscheeduling.pythonanywhere.com/delete_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            // Refresh the sections after deleting
            fetch('https://classscheeduling.pythonanywhere.com/get_section_json/')
              .then(response => response.json())
              .then(data => {
                props.setShowUpdate(false)
                window.location.reload();
              })
              .catch(error => console.error('Error fetching sections:', error));
          })
          .catch(error => console.error('Error deleting section:', error));
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Edit Sections</h2>
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
      <h3 style={{marginTop:'50px'}}>Action:</h3>
      <select style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
      id="actionDropdown" value={action} onChange={handleDropdownChange}>
          <option value="add">Add Section</option>
          <option value="delete">Delete Section</option>
        </select>

      <h3 style={{marginTop:'12px'}}>Sections(Integer)</h3>
      <input style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
          type="number"
          id="iterationsInput"
          value={iterations}
          onChange={handleIterationsChange}
        />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '35%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleIterate}>{action === 'add' ? 'Add' : 'Delete'} Sections</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowUpdate(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditSection;
 