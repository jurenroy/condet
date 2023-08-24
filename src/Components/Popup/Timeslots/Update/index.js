import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimePicker from '../../../TimePicker';

const UpdateTimeslot = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedType = useSelector(state => state.auth.type);
  const selectedTime = useSelector(state => state.auth.time);
  const selectedStarttime = useSelector(state => state.auth.starttime)
  const selectedEndtime = useSelector(state => state.auth.endtime)
  const navigate = useNavigate();

  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [error, setError] = useState('');

  const handleMilitaryTimeChange = (militaryTime) => {
    setStarttime(militaryTime);
};

const handleMilitaryTimeChange2 = (militaryTime) => {
    setEndtime(militaryTime);
};

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_timeslot_json/')
      .then(response => {
        const timeslotData = response.data;
        if (timeslotData) {
          // Find the room based on selectedCourseAbbreviation, selectedType, and selectedRoom
          const foundTimeslot = timeslotData.find(timeslot => 
            timeslot.course === selectedCourseAbbreviation &&
            timeslot.timeslottype === selectedType &&
            timeslot.timeslotID === selectedTime &&
            timeslot.starttime === selectedStarttime && 
            timeslot.endtime === selectedEndtime
          );

          if (foundTimeslot) {
            setStarttime(foundTimeslot.starttime);
            setEndtime(foundTimeslot.endtime);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedType, selectedTime, selectedStarttime, selectedEndtime]);

  const handleFormSubmit = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!starttime || !endtime) {
      setError('All fields are required.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('starttime', starttime);
    formData.append('endtime', endtime);
    formData.append('timeslottype', selectedType);

    // Send the updated room data to the Django backend using PUT method
    axios
      .post(`http://127.0.0.1:8000/update_timeslot/${selectedCourseAbbreviation}/${selectedTime}/`, formData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
        // Handle the response or perform any additional actions
        props.setShowUpdate(false); // Close the update room form
        navigate(`/${selectedCourseAbbreviation}`);
        
      })
      .catch((error) => {
        // Handle error response
        
      });
  };

  // Utility function to convert time from 24-hour format to 12-hour format
  const formatTimeTo12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      period = 'PM';
      formattedHours = formattedHours === 12 ? formattedHours : formattedHours - 12;
    }

    formattedHours = formattedHours === 0 ? 12 : formattedHours;

    return `${formattedHours}:${minutes} ${period}`;
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
      borderRadius: '10px'
    }}>
      <h2 style={{ marginTop: '12px' }}>Update Timeslot</h2>
      <h3 style={{ marginTop: '12px' }}>Start Time: </h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange} militaryTimeProp={formatTimeTo12Hour(selectedStarttime)} />

      <h3 style={{ marginTop: '12px' }}>End Time:</h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange2} militaryTimeProp={formatTimeTo12Hour(selectedEndtime)} />

      {error && <p style={{ color: 'white' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateTimeslot(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateTimeslot;