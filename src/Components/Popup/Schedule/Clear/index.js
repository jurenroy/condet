import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClearScheduleComponent = ({ selectedSchedule, selectedType }) => {

  const [course, setCourse] = useState('');
  const [section_year, setSection_year] = useState('');
  const [section_number, setSection_number] = useState('');
  const [subject_code, setSubject_code] = useState('');
  const [subject_name, setSubject_name] = useState('');
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
  const [instructor, setInstructor] = useState('');
  // eslint-disable-next-line
  const [error, setError] = useState('');

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleClearzSchedule = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    handleClearSchedule()
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    // Fetch all schedule data
    axios.get('https://classscheeduling.pythonanywhere.com/get_schedule_json/')
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
            } else {
                setInstructor(foundSchedule.instructor);
            }
            // ... populate other state variables ...
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedSchedule]);

  const handleClearSchedule = () => {
    // Clear any previous errors
    setError('');

    // Create FormData object
    const formData = new FormData();
    formData.append('course', course);
    formData.append('section_year', section_year);
    formData.append('section_number', section_number);
    formData.append('subject_code', subject_code);
    formData.append('subject_name', subject_name);
    formData.append('instructor', instructor);

    if (selectedType === 'Lecture') {
      // Clear lecture data
      formData.append('lecture_roomslotnumber', '');
      formData.append('lecture_day', '');
      formData.append('lecture_starttime', '');
      formData.append('lecture_endtime', '');
      formData.append('lecture_building_number', '');
      formData.append('lecture_roomname', '');

      // Use existing data for lab
      formData.append('lab_roomslotnumber', labRoomslotNumber);
      formData.append('lab_day', labDay);
      formData.append('lab_starttime', labStartTime);
      formData.append('lab_endtime', labEndTime);
      formData.append('lab_building_number', labBuildingNumber);
      formData.append('lab_roomname', labRoomName);
    } else if (selectedType === 'Laboratory') {
      // Clear lab data
      formData.append('lab_roomslotnumber', '');
      formData.append('lab_day', '');
      formData.append('lab_starttime', '');
      formData.append('lab_endtime', '');
      formData.append('lab_building_number', '');
      formData.append('lab_roomname', '');

      // Use existing data for lecture
      formData.append('lecture_roomslotnumber', lectureRoomslotNumber);
      formData.append('lecture_day', lectureDay);
      formData.append('lecture_starttime', lectureStartTime);
      formData.append('lecture_endtime', lectureEndTime);
      formData.append('lecture_building_number', lectureBuildingNumber);
      formData.append('lecture_roomname', lectureRoomName);
    } else {
      // Use existing data for both lecture and lab
      formData.append('lecture_roomslotnumber', lectureRoomslotNumber);
      formData.append('lecture_day', lectureDay);
      formData.append('lecture_starttime', lectureStartTime);
      formData.append('lecture_endtime', lectureEndTime);
      formData.append('lecture_building_number', lectureBuildingNumber);
      formData.append('lecture_roomname', lectureRoomName);

      formData.append('lab_roomslotnumber', labRoomslotNumber);
      formData.append('lab_day', labDay);
      formData.append('lab_starttime', labStartTime);
      formData.append('lab_endtime', labEndTime);
      formData.append('lab_building_number', labBuildingNumber);
      formData.append('lab_roomname', labRoomName);
    }

    // Send the updated schedule data to the Django backend using POST method
    axios.post(`https://classscheeduling.pythonanywhere.com/update_schedule/${parseInt(selectedSchedule)}/`, formData)
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

  

  // Return JSX for the component
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {!showConfirmation && (
      <button  onClick={handleClearzSchedule}>Clear Schedule</button>
      )}

      {showConfirmation && (
        <div style={{display: 'flex',flexDirection: 'column' ,alignItems: 'space-evenly'}}>
          <p>Do you wish to clear the room?</p>
          <button onClick={handleConfirm}>Yes</button>
          <button onClick={handleCancel}>No</button>
        </div>
      )}
    </div>
  );
};

export default ClearScheduleComponent;
