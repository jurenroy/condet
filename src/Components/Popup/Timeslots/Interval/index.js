import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = (props) => {
  const { selectedCollege, selectedType } = props;

  const [highestStartTime, setHighestStartTime] = useState(null);
  const [highestEndTime, setHighestEndTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Fetch timeslots data
    axios.get(`https://classscheeduling.pythonanywhere.com/get_timeslot_json/`)
      .then(response => {
        const timeslots = response.data;
  
        // Filter timeslots based on selectedCollege and selectedType
        const filteredTimeslots = timeslots.filter(data => {
          return parseInt(selectedCollege) === data.college && selectedType === data.timeslottype;
        });
  
        // Sort the filteredTimeslot array based on starttime (latest timeslot first)
      filteredTimeslots.sort((a, b) => b.starttime.localeCompare(a.starttime));

      // Find the latest start time and end time from filtered data
      const latestStart = filteredTimeslots.length > 0 ? filteredTimeslots[0].starttime : null;
      const latestEnd = filteredTimeslots.length > 0 ? filteredTimeslots[0].endtime : null;

      setHighestStartTime(latestStart);
      setHighestEndTime(latestEnd);
      })
      .catch(error => {
        // Handle error
        console.error(error);
      });
  }, [selectedCollege, selectedType]);

  // Utility function to convert time to minutes
const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };
  
  // Utility function to convert minutes to 24-hour format
  const convertTo24HourFormat = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  };
  

  const handleAddTimeslot = () => {
    // Check if highest start time and end time are available
  if (highestStartTime !== null && highestEndTime !== null) {
    // Convert to minutes
    const highestStartTimeInMinutes = convertToMinutes(highestStartTime);
    const highestEndTimeInMinutes = convertToMinutes(highestEndTime);

    // Calculate interval
    const interval = highestEndTimeInMinutes - highestStartTimeInMinutes;

    // Perform addition
    const startTimeInMinutes = highestStartTimeInMinutes + interval;
    const endTimeInMinutes = highestEndTimeInMinutes + interval;

    // Convert back to 24-hour format
    const startTime = convertTo24HourFormat(startTimeInMinutes);
    const endTime = convertTo24HourFormat(endTimeInMinutes);

      // Create FormData object
      const formData = new FormData();
      formData.append('starttime', startTime);
      formData.append('endtime', endTime);
      formData.append('timeslottype', selectedType);

      // Send the room data to the Django backend
      axios.post(`https://classscheeduling.pythonanywhere.com/add_timeslot/${selectedCollege}/`, formData)
        .then(response => {
          // Handle success or update state as needed
          console.log(response.data);
          setShowConfirmation(true); // Show confirmation after successful addition
          window.location.reload();
        })
        .catch(error => {
          // Handle error
          console.error(error);
        });
    }
  };


  const showlang = () => {
    // Your logic to add timeslot
    console.log('Adding timeslot...');
    // Once the logic is done, show the confirmation
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    handleAddTimeslot()
    setShowConfirmation(false); // Hide confirmation after confirming
  };

  const handleCancel = () => {
    // Handle cancelation logic
    setShowConfirmation(false); // Hide confirmation after canceling
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!showConfirmation && (
        <button onClick={showlang}>Add Timeslot interval</button>
      )}

      {showConfirmation && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-evenly' }}>
          <p>Do you wish to add a similar interval timeslot?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
};

export default YourComponent;