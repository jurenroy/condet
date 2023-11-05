import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse } from '../../../Redux/Auth/AuthSlice';
import axios from 'axios';

const DeleteCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.courseID === selectedCourseAbbreviation);
        setSelectedCourse(foundCourse);
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleDelete = () => {
    if (selectedCourse) {
      axios.delete(`https://classscheeduling.pythonanywhere.com/delete_course/${selectedCourseAbbreviation}/`)
        .then((response) => {
          console.log(response.data);
          // Handle the response or perform any additional actions after successful deletion
          // For example, you can show a success message or update the UI to reflect the deletion.
          // You may also redirect the user to another page or update the course list.
          props.setShowDelete(false); // Close the delete modal after successful deletion
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
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px',
      border: '1px solid black',
      zIndex: '999',
      cursor: isDragging ? 'grabbing' : 'grab'
    }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      >
      <div style={{
      backgroundColor: '#060E57', 
      height: '20px',
      width: '350px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
         <h2 style={{marginTop:'-2px',color:'white'}}>Delete Course</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '387.8px', 
      position: 'absolute',
      left:'0.4%',
      top: '97.2%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      }}/>

      {selectedCourse ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>{selectedCourse.coursename}</span>
          <br/>
          <span style={{fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>{selectedCourse.abbreviation}</span>
        </div>
      ) : (
        <div>
          <h3>Loading course data...{selectedCourse}</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px'}} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShowDelete(false)}>No</button>
      </div>
    </div>
  );
};

export default DeleteCourse;