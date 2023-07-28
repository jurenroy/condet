import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse } from '../../../Redux/Auth/AuthSlice';

const UpdateCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const college = useSelector(state => state.auth.college); // Get the college from Redux store
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    formData.append('new_abbreviation', abbreviation);
    formData.append('college', college); // Include the college in the form data
  
    axios.post(`http://127.0.0.1:8000/update_course/${selectedCourseAbbreviation}/`, formData)
      .then((response) => {
        console.log(response.data);
        // Handle the response or perform any additional actions
        
        navigate('/');
        window.location.reload();
        dispatch(selectCourse(''));
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
