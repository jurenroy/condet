import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddInstructor = (props) => {
    const [name, setname] = useState('');
    // eslint-disable-next-line
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const college = useSelector(state => state.auth.college);

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