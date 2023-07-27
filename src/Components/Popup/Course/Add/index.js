import React, { useState } from 'react'
import axios from 'axios';


const AddCourse = (props) => {
    const [coursename, setCoursename] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddCourse = () => {
      if (coursename.trim() === '' || abbreviation.trim() === '') {
        setErrorMessage('Please provide a valid coursename and abbreviation');
        return;
      }

      const formData = new FormData();
      formData.append('coursename', coursename);
      formData.append('abbreviation', abbreviation);
  
      axios
        .post('http://127.0.0.1:8000/add_course/', formData)
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
      <h2 style={{marginTop:'12px'}}>Add Course</h2>
      <h3 style={{marginTop:'12px'}}>Course Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize:'20px' }}
        type="text" 
        value={coursename} 
        onChange={e => setCoursename(e.target.value)}
      />

      <h3 style={{marginTop:'12px'}}>Abbreviation:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px'}}
        type="text" 
        value={abbreviation} 
        onChange={e => setAbbreviation(e.target.value)}
      />

      {/* {successMessage && <p>{successMessage}</p>} */}
      {errorMessage && <p>{errorMessage}</p>}
      
      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddCourse}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAdd(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default AddCourse;


