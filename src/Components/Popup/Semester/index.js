import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditSemester = (props) => {
    // eslint-disable-next-line
  const [error, setError] = useState('');
  const navigate = useNavigate()

    const [selectedSemester, setSelectedSemester] = useState('');

    const college = useSelector((state) => state.auth.college); 
       // eslint-disable-next-line
    const semester = useSelector((state) => state.auth.semester);

    const handleDropdownChange = (event) => {
        setSelectedSemester(event.target.value);
      };

      useEffect(() => {
        // Fetch college data from the API using Axios
        axios.get('https://classscheeduling.pythonanywhere.com/get_college_json/')
          .then(response => {
            const collegeData = response.data.find(col => parseInt(col.collegeID) === parseInt(college));
            if (collegeData) {
              setSelectedSemester(collegeData.semester);
            }
          })
          .catch(error => console.log('Error fetching college data:', error));
      }, [setSelectedSemester, college]);


    // State for tracking dragging functionality
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
      x: (window.innerWidth - 400) / 2, // 400 is the width of the component
      y: (window.innerHeight - 300) / 3, // 300 is the height of the component
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

    const renderMessage = () => {
        return (
            <div style={{ marginTop: '-20px', fontSize: '18px' }}>
            <p style={{marginTop: '50px'}}>Changing semester would wipe the data</p>
            <p style={{marginTop: '-20px'}}>and affect related users.</p>
            </div>
        );
      };

      const handleChangeSemester = () => {
        const formData = new FormData();
        formData.append('semester', selectedSemester);
    
        axios
            .post(`https://classscheeduling.pythonanywhere.com/update_college_semester/${parseInt(college)}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(response => {
                console.log(response.data);
                // setSuccessMessage(response.data.message);
                // setErrorMessage('');
                navigate('/');
                window.location.reload();
                navigate('/');
            })
            .catch(error => {
                // console.error('Error:', error);
            });
    };
    
      
  
  return (
    <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: position.x + 'px',
      top:  position.y + 'px',
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Change Semester</h2>
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
      <h3 style={{ marginTop: '52px' }}>Select Semester:</h3>
      
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px', zIndex: '99'}}
        id="semesterDropdown"
        value={selectedSemester}
        onChange={handleDropdownChange}
      >
        <option value="First Semester">First Semester</option>
        <option value="Second Semester">Second Semester</option>
        <option value="Summer">Summer</option>
      </select>

      {renderMessage()}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '40%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleChangeSemester}>Change Semester</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowUpdate(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default EditSemester;
 