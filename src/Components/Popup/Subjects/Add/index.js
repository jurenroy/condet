import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSubject = (props) => {
  const [subjectcode, setSubjectcode] = useState('');
  const [subjectname, setSubjectname] = useState('');
  const [error, setError] = useState('');

  const selectedCourse = useSelector(state => state.auth.course);
    const selectedYear = useSelector(state => state.auth.year)

  const handleAddSubject = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!subjectcode || !subjectname || !selectedCourse || !selectedYear) {
      setError('All fields are required.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('subjectcode', subjectcode);
    formData.append('subjectname', subjectname);
    formData.append('year', selectedYear);

    // Send the room data to the Django backend
    axios
      .post(`http://127.0.0.1:8000/add_subject/${selectedCourse}/`, formData)
      .then((response) => {
        console.log(response.data.message); // You can show this message to the user if needed
        props.setShowAddSubject(false); // Close the add room form
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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Subject</h2>
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
      <h3 style={{marginTop:'50px'}}>Subject Code:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize:'20px' }}
        type="text" 
        value={subjectcode} 
        onChange={e => setSubjectcode(e.target.value)}
        required
      />

      <h3 style={{marginTop:'12px'}}>Subject Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px'}}
        type="text" 
        value={subjectname} 
        onChange={e => setSubjectname(e.target.value)}
        required
      />

      {error && <p style={{ color: 'white' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddSubject}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddSubject(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSubject;