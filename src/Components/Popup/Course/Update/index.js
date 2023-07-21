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
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('coursename', coursename);
    formData.append('abbreviation', abbreviation);
  
    axios.post(`http://localhost:8000/update_course/${selectedCourseAbbreviation}/`, formData)
      .then((response) => {
        console.log(response.data);
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
      borderRadius: '10%'
    }}>
      <h2 style={{ marginTop: '12px' }}>Update Course</h2>
      <h3 style={{ marginTop: '12px' }}>Course Name:</h3>
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
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShow2(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateCourse;
