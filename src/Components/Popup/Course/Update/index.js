import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UpdateCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  
  const [coursename, setCoursename] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.abbreviation === selectedCourseAbbreviation);
        if (foundCourse) {
          setCoursename(foundCourse.coursename);
          setAbbreviation(foundCourse.abbreviation);
        }
      })
  }, [selectedCourseAbbreviation]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('coursename', coursename);
    formData.append('abbreviation', abbreviation);
  
    axios.post(`http://localhost:8000/update_course/${selectedCourseAbbreviation}/`, formData)
      .then((response) => {
        // Handle the response or perform any additional actions
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
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
        <h2 style={{ marginTop: '-2px',color:'white' }}>Update Course</h2>
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


      
      <h3 style={{ marginTop: '50px' }}>Course Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={coursename}
        onChange={(e) => setCoursename(e.target.value)}
      />

      <h3 style={{ marginTop: '12px' }}>Abbreviation:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={abbreviation}
        onChange={(e) => setAbbreviation(e.target.value)}
      />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdate(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateCourse;
