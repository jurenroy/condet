import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UpdateSchedule = (props) => {
  const selectedSchedule = useSelector(state => state.auth.schedule);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedLectureRoomslot = useSelector(state => state.auth.lectureRoomslot);
  const selectedLabRoomslot = useSelector(state => state.auth.labRoomslot);
  const [courseAbbreviation, setCourseAbbreviation] = useState('');


    // Assuming you have a function to fetch data from an API
    async function fetchCourseData() {
      try {
        const response = await fetch('http://127.0.0.1:8000/get_course_json/');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching course data:', error);
        return [];
      }
    }
  
    // Inside your component
    const getCourseAbbreviation = async (courseId) => {
      const courseData = await fetchCourseData();
  
      // Find the course with the matching course ID
      const matchingCourse = courseData.find(course => course.courseID === courseId);
  
      if (matchingCourse) {
        return matchingCourse.abbreviation;
      } else {
        return null; // Course not found
      }
    };
  
    useEffect(() => {
      if (selectedCourse) {
        getCourseAbbreviation(selectedCourse)
          .then(abbreviation => setCourseAbbreviation(abbreviation))
          .catch(error => console.error('Error fetching course abbreviation:', error));
      }
    // eslint-disable-next-line
    }, [selectedCourse]);

  const [course, setCourse]=useState('');
  const [section_year, setSection_year]=useState('');
  const [section_number, setSection_number]=useState('');
  const [subject_code, setSubject_code]=useState('');
  const [subject_name, setSubject_name]=useState('');
  const [instructor, setInstructor]=useState('');
  const [lectureRoomslotNumber, setLectureRoomslotNumber] = useState('');
  const [lectureDay, setLectureDay] = useState('');
  const [lectureStartTime, setLectureStartTime] = useState('');
  const [lectureEndTime, setLectureEndTime] = useState('');
  const [lectureBuildingNumber, setLectureBuildingNumber] = useState('');
  const [lectureRoomName, setLectureRoomName] = useState('');
  const [labRoomslotNumber, setLabRoomslotNumber] = useState('');
  const [labDay, setLabDay] = useState('');
  const [labStartTime, setLabStartTime] = useState('');
  const [labEndTime, setLabEndTime] = useState('');
  const [labBuildingNumber, setLabBuildingNumber] = useState('');
  const [labRoomName, setLabRoomName] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    // Fetch all schedule data
    axios.get('http://127.0.0.1:8000/get_schedule_json/')
      .then(response => {
        const scheduleData = response.data;
        if (scheduleData) {
          // Find the selected schedule
          const foundSchedule = scheduleData.find(schedule => schedule.scheduleID === selectedSchedule);
          if (foundSchedule) {
            setCourse(foundSchedule.course);
            setSection_year(foundSchedule.section_year);
            setSection_number(foundSchedule.section_number)
            setSubject_code(foundSchedule.subject_code);
            setSubject_name(foundSchedule.subject_name);
            setLectureRoomslotNumber(foundSchedule.lecture_roomslotnumber);
            setLectureDay(foundSchedule.lecture_day);
            setLectureStartTime(foundSchedule.lecture_starttime);
            setLectureEndTime(foundSchedule.lecture_endtime);
            setLectureBuildingNumber(foundSchedule.lecture_building_number);
            setLectureRoomName(foundSchedule.lecture_roomname);
            setLabRoomslotNumber(foundSchedule.lab_roomslotnumber);
            setLabDay(foundSchedule.lab_day);
            setLabStartTime(foundSchedule.lab_starttime);
            setLabEndTime(foundSchedule.lab_endtime);
            setLabBuildingNumber(foundSchedule.lab_building_number);
            setLabRoomName(foundSchedule.lab_roomname);
            
            if (foundSchedule.instructor === null){
                setInstructor('');
            }else{
                setInstructor(foundSchedule.instructor);
            }
            // ... populate other state variables ...
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedSchedule]);

  const handleFormSubmit = () => {
    setError(''); // Clear any previous errors
    // Create FormData object
    // Create FormData object
  const formData = new FormData();
  formData.append('course', course);
  formData.append('section_year', section_year);
  formData.append('section_number', section_number);
  formData.append('subject_code', subject_code);
  formData.append('subject_name', subject_name);
  formData.append('instructor', instructor);

  // Append lecture data if not empty
  if (lectureRoomslotNumber !== '' && lectureDay !== '' && lectureStartTime !== '' && lectureEndTime !== '' && lectureBuildingNumber !== '' && lectureRoomName !== '') {
    formData.append('lecture_roomslotnumber', lectureRoomslotNumber);
    formData.append('lecture_day', lectureDay);
    formData.append('lecture_starttime', lectureStartTime);
    formData.append('lecture_endtime', lectureEndTime);
    formData.append('lecture_building_number', lectureBuildingNumber);
    formData.append('lecture_roomname', lectureRoomName);
  }else if (lectureRoomslotNumber === '' || lectureDay === '' || lectureStartTime === '' || lectureEndTime === '' || lectureBuildingNumber === '' || lectureRoomName === ''){
    formData.append('lecture_roomslotnumber', '');
    formData.append('lecture_day', '');
    formData.append('lecture_starttime', '');
    formData.append('lecture_endtime', '');
    formData.append('lecture_building_number', '');
    formData.append('lecture_roomname', '');
  }

  // Append lab data if not empty
  if (labRoomslotNumber !== '' && labDay !== '' && labStartTime !== '' && labEndTime !== '' && labBuildingNumber !== '' && labRoomName !== '') {
    formData.append('lab_roomslotnumber', labRoomslotNumber);
    formData.append('lab_day', labDay);
    formData.append('lab_starttime', labStartTime);
    formData.append('lab_endtime', labEndTime);
    formData.append('lab_building_number', labBuildingNumber);
    formData.append('lab_roomname', labRoomName);
  }else if (labRoomslotNumber === '' || labDay === '' || labStartTime === '' || labEndTime === '' || labBuildingNumber === '' || labRoomName === ''){
    formData.append('lab_roomslotnumber', '');
    formData.append('lab_day', '');
    formData.append('lab_starttime', '');
    formData.append('lab_endtime', '');
    formData.append('lab_building_number', '');
    formData.append('lab_roomname', '');
  }
  
    // Send the updated schedule data to the Django backend using POST method
    axios
      .post(`http://127.0.0.1:8000/update_schedule/${selectedSchedule}/`, formData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
        // Handle the response or perform any additional actions
        // props.setShowUpdateSubject(false); // Close the update room form
        // navigate(`/${selectedCourseAbbreviation}`);
      })
      .catch((error) => {
        // Handle error response
        console.error(error);
      });
  };
  

  let yearvalue = '1';
  if (section_year === 'Second Year') {
    yearvalue = '2';
  } else if (section_year === 'Third Year') {
    yearvalue = '3';
  } else if (section_year === 'Fourth Year') {
    yearvalue = '4';
  }

  const [lectureDays, setLectureDays] = useState([]);
  const [lectureRooms, setLectureRooms] = useState([]);
  const [lectureTimes, setLectureTimes] = useState([]);
  const [labDays, setLabDays] = useState([]);
  const [labRooms, setLabRooms] = useState([]);
  const [labTimes, setLabTimes] = useState([]);

  useEffect(() => {
    // Fetch roomslot data
    axios.get('http://127.0.0.1:8000/get_roomslot_json/')
      .then(response => {
        const roomslotData = response.data;
        if (roomslotData) {
          const lectureRoomslots = roomslotData.filter(slot => slot.course === course && slot.roomslottype === 'Lecture');
          const labRoomslots = roomslotData.filter(slot => slot.course === course && slot.roomslottype === 'Laboratory');
          
          // Populate dropdown options for lecture days
          const lectureDayOptions = [...new Set(lectureRoomslots.map(slot => slot.day))];
          setLectureDays(lectureDayOptions);

          // Populate dropdown options for lecture rooms
          const lectureRoomOptions = [...new Set(lectureRoomslots.map(slot => `${slot.building_number} - ${slot.roomname}`))];
          setLectureRooms(lectureRoomOptions);

          // Populate dropdown options for lecture times
          const lectureTimeOptions = [...new Set(lectureRoomslots.map(slot => `${slot.starttime} - ${slot.endtime}`))];
          setLectureTimes(lectureTimeOptions);

          // Populate dropdown options for lab days
          const labDayOptions = [...new Set(labRoomslots.map(slot => slot.day))];
          setLabDays(labDayOptions);

          // Populate dropdown options for lab rooms
          const labRoomOptions = [...new Set(labRoomslots.map(slot => `${slot.building_number} - ${slot.roomname}`))];
          setLabRooms(labRoomOptions);

          // Populate dropdown options for lab times
          const labTimeOptions = [...new Set(labRoomslots.map(slot => `${slot.starttime} - ${slot.endtime}`))];
          setLabTimes(labTimeOptions);
        }
      })
      .catch(error => console.log(error));
  }, [course]);

  const [isLectureModified, setIsLectureModified]=useState();
  const [lectureDetailsFilled, setLectureDetailsFilled] = useState(false);
  const [lectureRoomslotAvailability, setLectureRoomslotAvailability] = useState(false); // State to track availability of lecture roomslot

  useEffect(() => {
    // Check if all lecture dropdowns are filled
    if (lectureDay && lectureStartTime && lectureEndTime && lectureBuildingNumber && lectureRoomName) {
      setLectureDetailsFilled(true);
      // Fetch roomslot data to check availability
      axios.get('http://127.0.0.1:8000/get_roomslot_json/')
        .then(response => {
          const roomslotData = response.data;
          if (roomslotData) {
            const matchingRoomslot = roomslotData.find(slot =>
              slot.course === selectedCourse &&
              slot.roomslottype === 'Lecture' &&
              slot.day === lectureDay &&
              slot.starttime === lectureStartTime &&
              slot.endtime === lectureEndTime &&
              slot.building_number === lectureBuildingNumber &&
              slot.roomname === lectureRoomName
            );

            if (matchingRoomslot) {
              setLectureRoomslotAvailability(matchingRoomslot.availability);
              setLectureRoomslotNumber(matchingRoomslot.roomslotnumber);
            }

            if (matchingRoomslot.day === lectureDay && matchingRoomslot.building_number === lectureBuildingNumber && matchingRoomslot.roomname === lectureRoomName && matchingRoomslot.starttime === lectureStartTime && matchingRoomslot.endtime === lectureEndTime){
              setIsLectureModified(false)
            }else{
              setIsLectureModified(true)
            }
            
          }
        })
        .catch(error => console.log(error));
    } else {
      setLectureDetailsFilled(false);
    }
  }, [selectedCourse ,lectureDay, lectureStartTime, lectureEndTime, lectureBuildingNumber, lectureRoomName]);


  const [isLabModified, setIsLabModified]=useState();
  const [labDetailsFilled, setLabDetailsFilled] = useState(false);
  const [labRoomslotAvailability, setLabRoomslotAvailability] = useState(false); // State to track availability of lab roomslot

  useEffect(() => {
    // Check if all lab dropdowns are filled
    if (labDay && labStartTime && labEndTime && labBuildingNumber && labRoomName) {
      setLabDetailsFilled(true);
      // Fetch roomslot data to check availability
      axios.get('http://127.0.0.1:8000/get_roomslot_json/')
        .then(response => {
          const roomslotData = response.data;
          if (roomslotData) {
            const matchingRoomslot = roomslotData.find(slot =>
              slot.course === selectedCourse &&
              slot.roomslottype === 'Laboratory' &&
              slot.day === labDay &&
              slot.starttime === labStartTime &&
              slot.endtime === labEndTime &&
              slot.building_number === labBuildingNumber &&
              slot.roomname === labRoomName
            );

            if (matchingRoomslot) {
              setLabRoomslotAvailability(matchingRoomslot.availability);
              setLabRoomslotNumber(matchingRoomslot.roomslotnumber);
            }

            if (matchingRoomslot.day === labDay && matchingRoomslot.building_number === labBuildingNumber && matchingRoomslot.roomname === labRoomName && matchingRoomslot.starttime === labStartTime && matchingRoomslot.endtime === labEndTime){
              setIsLabModified(false)
            }else{
              setIsLabModified(true)
            }
          }
        })
        .catch(error => console.log(error));
    } else {
      setLabDetailsFilled(false);
    }
  }, [selectedCourse, labDay, labStartTime, labEndTime, labBuildingNumber, labRoomName]);

  const isDisabled = 
    ((parseInt(selectedLabRoomslot) !== parseInt(labRoomslotNumber) && isLabModified === false &&labRoomslotAvailability === false) &&
    (parseInt(selectedLectureRoomslot) !== parseInt(lectureRoomslotNumber) &&isLectureModified === false &&lectureRoomslotAvailability === false))
    || (parseInt(selectedLabRoomslot) !== parseInt(labRoomslotNumber) && isLabModified === false &&labRoomslotAvailability === false) 
    || (parseInt(selectedLectureRoomslot) !== parseInt(lectureRoomslotNumber) &&isLectureModified === false &&lectureRoomslotAvailability === false)


  return (
      <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '500px',
      width: '600px',
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
      width: '94%', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Schedule for</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '100% ', 
      position: 'absolute',
      left:'0%',
      bottom: '0%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      // padding: '20px',
      }}/>

      <h3 style={{ marginTop: '12px' }}>{courseAbbreviation.substring(2)}{yearvalue}S{section_number}: {subject_code} - {subject_name}</h3>
      <h3 style={{ marginTop: '12px' }}>Instructor:</h3>
      <input
        style={{ height: '30px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={instructor}
        onChange={(e) => setInstructor(e.target.value)}
      />
      <h3>Lecture: {lectureRoomslotNumber} = {selectedLectureRoomslot}</h3>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <select
        value={lectureDay}
        onChange={(e) => setLectureDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {lectureDays.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select
          value={`${lectureBuildingNumber} - ${lectureRoomName}`} 
          onChange={(e) => {
            const combinedValue = e.target.value;
            if (combinedValue) {
            const [selectedBuildingNumber, selectedRoomName] = combinedValue.split('-'); 
            setLectureBuildingNumber(selectedBuildingNumber.trim());
            setLectureRoomName(selectedRoomName.trim());
            }else{
                setLectureBuildingNumber('');
                setLectureRoomName('');
            }
          }}
        >
          <option value=" - ">Select Room</option>
          {lectureRooms.map(room => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
        <select
          value={`${lectureStartTime} - ${lectureEndTime}`} 
          onChange={(e) => {
            const selectedTimeslot = e.target.value;
            if (selectedTimeslot) {
                const [selectedStart, selectedEnd] = selectedTimeslot.split('-');
                setLectureStartTime(selectedStart.trim());
                setLectureEndTime(selectedEnd.trim());
              } else {
                // Handle the case when the selected timeslot is empty
                setLectureStartTime('');
                setLectureEndTime('');
              }
          }}
        >
          <option value=" - ">Select Timeslot</option>
          {lectureTimes.map(timeslot => (
            <option key={timeslot} value={timeslot}>
              {timeslot}
            </option>
          ))}
        </select>
      </div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      {lectureDetailsFilled===false && <p style={{marginRight: '50px'}}>Please input lecture details else be empty</p>}
      {parseInt(selectedLectureRoomslot) !== parseInt(lectureRoomslotNumber) && isLectureModified===false && lectureRoomslotAvailability === false && <p>Room slot is not available</p>}
      
      </div>

      <h3 style={{ marginTop: '12px' }}>Laboratory: {labRoomslotNumber} = {selectedLabRoomslot}</h3>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <select
        value={labDay}
        onChange={(e) => setLabDay(e.target.value)}
      >
        <option value="">Select Day</option>
        {labDays.map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select
          value={`${labBuildingNumber} - ${labRoomName}`} 
          onChange={(e) => {
            const combinedValue = e.target.value;
            if (combinedValue) {
            const [selectedBuildingNumber, selectedRoomName] = combinedValue.split('-');  
            setLabBuildingNumber(selectedBuildingNumber.trim());
            setLabRoomName(selectedRoomName.trim());
            }else{
                setLabBuildingNumber('');
                setLabRoomName('');
            }
          }}
        >
          <option value=" - ">Select Room</option>
          {labRooms.map(room => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
        <select
          value={`${labStartTime} - ${labEndTime}`} 
          onChange={(e) => {
            const selectedTimeslot = e.target.value;
            if (selectedTimeslot) {
                const [selectedStart, selectedEnd] = selectedTimeslot.split('-');
                setLabStartTime(selectedStart.trim());
                setLabEndTime(selectedEnd.trim());
              } else {
                // Handle the case when the selected timeslot is empty
                setLabStartTime('');
                setLabEndTime('');
              }
          }}
        >
          <option value=" - ">Select Timeslot</option>
          {labTimes.map(timeslot => (
            <option key={timeslot} value={timeslot}>
              {timeslot}
            </option>
          ))}
        </select>
      </div>

      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
      {labDetailsFilled===false && <p style={{marginRight: '50px'}}>Please input laboratory details else be empty</p>}
      {parseInt(selectedLabRoomslot) !== parseInt(labRoomslotNumber) && isLabModified === false && labRoomslotAvailability === false && <p>Room slot is not available</p>}
      </div>

      {error && <p style={{ color: 'white' }}>{error}</p>}

      

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: !isDisabled ? 'pointer' : 'not-allowed'}} onClick={handleFormSubmit} disabled={isDisabled} >Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateSchedule(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateSchedule;
