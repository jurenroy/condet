import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse } from '../../../Redux/Auth/AuthSlice';
import axios from 'axios';

const AutomateSchedule = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const [selectedCourse, setSelectedCourse] = useState(null);
  // eslint-disable-next-line
  const [availableRoomSlots, setAvailableRoomSlots] = useState([]);
  const [availableLabRoomSlots, setAvailableLabRoomSlots] = useState([]);
  const [availableLectureRoomSlots, setAvailableLectureRoomSlots] = useState([]);
  const [scheduleCount, setScheduleCount] = useState(0);
  // eslint-disable-next-line
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

    // Fetch available room slots
    axios.get('https://classscheeduling.pythonanywhere.com/get_roomslot_json/')
      .then(response => {
        const roomSlots = response.data.filter(roomslot => roomslot.course === selectedCourseAbbreviation && roomslot.availability === true);
        setAvailableRoomSlots(roomSlots);
        const roomSlotsLab = response.data.filter(roomslot => roomslot.course === selectedCourseAbbreviation && roomslot.availability === true && roomslot.roomslottype === 'Laboratory');
        setAvailableLabRoomSlots(roomSlotsLab);
        const roomSlotsLecture = response.data.filter(roomslot => roomslot.course === selectedCourseAbbreviation && roomslot.availability === true && roomslot.roomslottype === 'Lecture');
        setAvailableLectureRoomSlots(roomSlotsLecture);
      })
      .catch(error => console.log(error));

    // Fetch schedules
    axios.get('https://classscheeduling.pythonanywhere.com/get_schedule_json/')
      .then(response => {
        const schedules = response.data.filter(schedule => schedule.course === selectedCourseAbbreviation && !schedule.instructor && !schedule.lecture_roomslotnumber && !schedule.lab_roomslotnumber);
        setScheduleCount(schedules.length);
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleAutomate = () => {
    if (selectedCourse) {
      axios.delete(`https://classscheeduling.pythonanywhere.com/automate_schedule/${selectedCourseAbbreviation}/`)
        .then((response) => {
          console.log(response.data);
          // Handle the response or perform any additional actions after successful deletion
          // For example, you can show a success message or update the UI to reflect the deletion.
          // You may also redirect the user to another page or update the course list.
          props.setShowAutomate(false); // Close the delete modal after successful deletion
          window.location.reload();
          dispatch(selectCourse(selectedCourseAbbreviation));

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
      height: '250px',
      width: 'auto',
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
      width: '92.6%', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
         <h2 style={{marginTop:'-10px',color:'white'}}>Automate Schedule for</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '100%', 
      position: 'absolute',
      left:'0.1%',
      bottom: '0.1%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      }}/>

      {selectedCourse ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3 style={{marginTop: '5px'}}>Automate schedule for</h3>
          
          <span style={{fontSize: '20px', fontWeight: 'bold', textAlign: 'center'}}>{selectedCourse.abbreviation}</span>
          <span style={{fontSize: '15px', fontWeight: 'bold'}}> - {selectedCourse.coursename}</span>

          <br/>
          <h4>Available Lecture: {availableLectureRoomSlots.length} roonmslots and Laboratory: {availableLabRoomSlots.length} roomslots</h4>

          <h4>No of Lecture:{scheduleCount} & No of Laboratory:{scheduleCount} to be schedule</h4>
        </div>
      ) : (
        <div>
          <h3>Loading course data...{selectedCourse}</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px', cursor: (availableLectureRoomSlots.length + availableLabRoomSlots.length) < (scheduleCount * 2) || scheduleCount === 0 ? 'not-allowed' : 'pointer'}} onClick={handleAutomate} disabled={(availableLectureRoomSlots.length + availableLabRoomSlots.length)  < scheduleCount * 2 || scheduleCount===0}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px', cursor: 'pointer' }} onClick={() => props.setShowAutomate(false)}>No</button>
      </div>
    </div>
  );
};

export default AutomateSchedule;