import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UpdateSubject = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSubject = useSelector(state => state.auth.subject);
  const navigate = useNavigate();

  const [subjectcode, setSubjectcode] = useState('');
  const [subjectname, setSubjectname] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_subject_json/')
      .then(response => {
        const subjectData = response.data;
        if (subjectData) {
          // Find the room based on selectedCourseAbbreviation, selectedType, and selectedRoom
          const foundSubject = subjectData.find(subject => 
            subject.course === selectedCourseAbbreviation &&
            subject.year === selectedYear &&
            subject.subjectID=== selectedSubject
          );

          if (foundSubject) {
            setSubjectcode(foundSubject.subjectcode);
            setSubjectname(foundSubject.subjectname);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedYear, selectedSubject]);

  const handleFormSubmit = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!subjectcode || !subjectname) {
      setError('All fields are required.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('year', selectedYear);
    formData.append('subjectcode', subjectcode);
    formData.append('subjectname', subjectname);
    
    // Send the updated room data to the Django backend using PUT method
    axios
      .post(`http://127.0.0.1:8000/update_subject/${selectedCourseAbbreviation}/${selectedSubject}/`, formData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
        // Handle the response or perform any additional actions
        props.setShowUpdateSubject(false); // Close the update room form
        navigate(`/${selectedCourseAbbreviation}`);
        
      })
      .catch((error) => {
        // Handle error response
        
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
      borderRadius: '10px',
      border: '1px solid black',
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
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Subject</h2>
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
      <h3 style={{ marginTop: '50px' }}>Subject Code:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={subjectcode}
        onChange={(e) => setSubjectcode(e.target.value)}
      />

      <h3 style={{ marginTop: '12px' }}>Subject Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={subjectname}
        onChange={(e) => setSubjectname(e.target.value)}
      />

      {error && <p style={{ color: 'white' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateSubject(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateSubject;