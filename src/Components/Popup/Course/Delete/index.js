import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse } from '../../../Redux/Auth/AuthSlice';
import axios from 'axios';

const DeleteCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.abbreviation === selectedCourseAbbreviation);
        setSelectedCourse(foundCourse);
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleDelete = () => {
    if (selectedCourse) {
      axios.delete(`http://127.0.0.1:8000/delete_course/${selectedCourse.abbreviation}/`)
        .then((response) => {
          console.log(response.data);
          // Handle the response or perform any additional actions after successful deletion
          // For example, you can show a success message or update the UI to reflect the deletion.
          // You may also redirect the user to another page or update the course list.
          props.setShowDelete(false); // Close the delete modal after successful deletion
          dispatch(selectCourse(''));
          navigate('/');

        })
        .catch((error) => {
          console.error(error);
          // Handle the error
        });
    }
  };

  return (
    <div style={{
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px'
    }}>
      <h2 style={{marginBottom: '-10px'}}>Delete Course</h2>
      {selectedCourse ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>{selectedCourse.coursename}</span>
          <br/>
          <span style={{fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>{selectedCourse.abbreviation}</span>
        </div>
      ) : (
        <div>
          <h3>Loading course data...</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px'}} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShow3(false)}>No</button>
      </div>
    </div>
  );
};

export default DeleteCourse;
