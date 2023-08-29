import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddCourse = (props) => {
    const [coursename, setCoursename] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    // eslint-disable-next-line
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const college = useSelector(state => state.auth.college);

    const handleAddCourse = () => {
      if (coursename.trim() === '' || abbreviation.trim() === ''|| college.trim() === '') {
        setErrorMessage('Please provide a valid coursename, abbreviation, and college');
        return;
      }

      const formData = new FormData();
      formData.append('coursename', coursename);
      formData.append('abbreviation', abbreviation);
      formData.append('college', college);
  
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
      backgroundColor: 'white',
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
      border: '1px solid black',
      borderRadius: '10px'
    }}>

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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Course</h2>
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

      <h3 style={{marginTop:'50px'}}>Course Name:</h3>
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