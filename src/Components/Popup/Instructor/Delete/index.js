import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectInstructor } from '../../../Redux/Auth/AuthSlice';
import axios from 'axios';

const DeleteInstructor = (props) => {
  const selectedInstructor = useSelector(state => state.auth.instructor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [instructorData, setInstructorData] = useState(null); // State to store instructor data

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get(`https://classscheeduling.pythonanywhere.com/get_instructor_json/`)
      .then((response) => {
        // Filter the instructor data to match the selected instructor
        const matchingInstructor = response.data.find(instructor => instructor.instructorID === selectedInstructor);
        setInstructorData(matchingInstructor);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedInstructor]);

  const handleDelete = () => {
    if (selectedInstructor) {
      axios.delete(`https://classscheeduling.pythonanywhere.com/delete_instructor/${selectedInstructor}/`)
        .then((response) => {
          console.log(response.data);
          // Handle the response or perform any additional actions after successful deletion
          // For example, you can show a success message or update the UI to reflect the deletion.
          // You may also redirect the user to another page or update the instructor list.
          props.setShowDeleteInstructor(false); // Close the delete modal after successful deletion
          navigate('/');
          window.location.reload();
          dispatch(selectInstructor(''));
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
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '200px',
      width: '350px',
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
        width: '350px',
        position: 'absolute',
        left: '0',
        top: '0%',
        borderTopRightRadius: '8px',
        borderTopLeftRadius: '8px',
        padding: '20px',
      }}>
        <h2 style={{ marginTop: '-2px', color: 'white' }}>Delete Instructor</h2>
      </div>

      <div style={{
        backgroundColor: '#FAB417',
        height: '7px',
        width: '387.8px',
        position: 'absolute',
        left: '0.4%',
        top: '97.2%',
        borderBottomRightRadius: '8px',
        borderBottomLeftRadius: '8px',
      }} />

      {instructorData ? (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{ fontSize: '15px' }}>{instructorData.name}</span>
        </div>
      ) : (
        <div>
          <h3>Loading instructor data...</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShowDeleteInstructor(false)}>No</button>
      </div>
    </div>
  );
};

export default DeleteInstructor;
