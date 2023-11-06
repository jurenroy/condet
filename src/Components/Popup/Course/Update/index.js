import React, { useState, useEffect, useRef } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFormSubmit();
    }
    if (e.key === 'Escape') {
      props.setShowUpdate(false)
    }
  };

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.courseID === selectedCourseAbbreviation);
        if (foundCourse) {
          setCoursename(foundCourse.coursename);
          setAbbreviation(foundCourse.abbreviation);
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (coursename.trim() === '' && abbreviation.trim() === '') {
      setErrorMessage('Please provide a valid coursename, abbreviation');
    }else
     if (coursename.trim() === ''){
      setErrorMessage('Please provide a valid coursename');
      
    }else
     if (abbreviation.trim() === ''){
      setErrorMessage('Please provide a valid abbreviation');
    
    }else{
      
  
    const formData = new FormData();
    formData.append('coursename', coursename);
    formData.append('new_abbreviation', abbreviation);
    formData.append('college', college); // Include the college in the form data
  
    axios.post(`https://classscheeduling.pythonanywhere.com/update_course/${selectedCourseAbbreviation}/`, formData)
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
    }
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
      borderRadius: '10px',
      border: '1px solid black',
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
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Course</h2>
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
        onKeyDown={handleKeyPress}
      />

      <h3 style={{ marginTop: '12px' }}>Abbreviation:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={abbreviation}
        onChange={(e) => setAbbreviation(e.target.value)}
        onKeyDown={handleKeyPress}
      />

        {errorMessage && <p>{errorMessage}</p>}
  
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdate(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateCourse;