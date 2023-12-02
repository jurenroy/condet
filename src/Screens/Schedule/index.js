import React, { useState, useEffect } from 'react';
import editicon from '../../Assets/edit1.png';
import { useSelector, useDispatch } from 'react-redux';
import { selectLabRoomslot, selectLectureRoomslot, selectSchedule } from '../../Components/Redux/Auth/AuthSlice';
import UpdateSchedule from '../../Components/Popup/Schedule/Update';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSection = useSelector(state => state.auth.sectionnumber);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const [showUpdateSchedule , setShowUpdateSchedule] = useState(false)

  const [courseAbbreviation, setCourseAbbreviation] = useState('');

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        // Filter instructors by college
        const filteredInstructors = response.data.filter((instructor) => instructor.college === parseInt(selectedCollege));
        setInstructors(filteredInstructors); // Store the filtered instructor names in state
      })
      .catch((error) => {
        console.error('Error fetching instructor data:', error);
      });
  }, [selectedCollege]);

    // Assuming you have a function to fetch data from an API
    async function fetchCourseData() {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_course_json/');
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

  const handleCancelClickSchedule = (schedule) => {
    setShowUpdateSchedule(prevShow => !prevShow);
    dispatch(selectSchedule(schedule.scheduleID)); 
    dispatch(selectLectureRoomslot(schedule.lecture_roomslotnumber))
    dispatch(selectLabRoomslot(schedule.lab_roomslotnumber))

  }

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/');
        const data = await response.json();

        // Filter data based on selectedCourse, selectedYear, and selectedSection
        const filteredData = data.filter(schedule =>
          schedule.course === selectedCourse &&
          schedule.section_year === selectedYear &&
          schedule.section_number === selectedSection
        );

        setScheduleData(filteredData);
        console.log(filteredData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchScheduleData();
  }, [selectedCourse, selectedYear, selectedSection]);

  let yearvalue = '1';
  if (selectedYear === 'Second Year') {
    yearvalue = '2';
  } else if (selectedYear === 'Third Year') {
    yearvalue = '3';
  } else if (selectedYear === 'Fourth Year') {
    yearvalue = '4';
  }

  function checkScheduleConflicts(scheduleEntries) {
    const conflicts = [];
  
    for (let i = 0; i < scheduleEntries.length; i++) {
      for (let j = i + 1; j < scheduleEntries.length; j++) {
        const entry1 = scheduleEntries[i];
        const entry2 = scheduleEntries[j];
  
        if (
          entry1.day === entry2.day &&
          entry1.starttime < entry2.endtime &&
          entry1.endtime > entry2.starttime
        ) {
          conflicts.push([entry1, entry2]);
        }
      }
    }
  
    return conflicts;
  }

  const extractedTimes = [];

  scheduleData.forEach(schedule => {
    const lectureTime = {
      building_number: schedule.lecture_building_number,
      roomname: schedule.lecture_roomname,
      day: schedule.lecture_day,
      starttime: schedule.lecture_starttime,
      endtime: schedule.lecture_endtime,
    };
  
    const labTime = {
      building_number: schedule.lab_building_number,
      roomname: schedule.lab_roomname,
      day: schedule.lab_day,
      starttime: schedule.lab_starttime,
      endtime: schedule.lab_endtime,
    };
  
    extractedTimes.push(lectureTime, labTime);
  });

  const conflicts = checkScheduleConflicts(extractedTimes);

  const conflex = []

if (conflicts.length > 0) {
  for (const conflict of conflicts) {
    conflex.push(conflict[0]);
    conflex.push(conflict[1]);
  }
} 

const handleButtonClick = () => {
  const formattedYear = selectedYear.replace(/\s+/g, '-'); // Replace spaces with hyphens
  // Navigate to the specified route
  navigate(`/schedule/${selectedCourse}/${formattedYear}/${selectedSection}`);
};

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
      <h2 style={{textAlign: 'center'}}>Schedule for {courseAbbreviation.substring(2)}{yearvalue}S{selectedSection}</h2> 
      <button style={{height: '15', cursor: conflex.length > 0 ? 'not-allowed' : 'pointer',}} disabled={conflex.length > 0} onClick={handleButtonClick}>View Visualization</button>
      </div>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
            <th>Instructor</th>
            <th>Lecture Schedule</th>
            <th>Laboratory Schedule</th>
            <th>Conflict</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {scheduleData.map(schedule => {
            let yearValue = '1';
            if (schedule.section_year === 'Second Year') {
              yearValue = '2';
            } else if (schedule.section_year === 'Third Year') {
              yearValue = '3';
            } else if (schedule.section_year === 'Fourth Year') {
              // eslint-disable-next-line
              yearValue = '4';
            }

            const isConflict = schedule.lecture_day === schedule.lab_day && schedule.lecture_day && schedule.lab_day;

            // Parse the start and end times into Date objects
            const lectureStartTime = new Date(`1970-01-01T${schedule.lecture_starttime}`);
            const lectureEndTime = new Date(`1970-01-01T${schedule.lecture_endtime}`);
            const labStartTime = new Date(`1970-01-01T${schedule.lab_starttime}`);
            const labEndTime = new Date(`1970-01-01T${schedule.lab_endtime}`);

            // Check if there is a time overlap
            const isTimeConflict = isConflict && lectureStartTime < labEndTime && lectureEndTime > labStartTime;

            return (
                
              <tr key={schedule.scheduleID}>
                <td>{schedule.subject_code}</td>
                <td><p style={{textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic', fontWeight: 'bold'}} onClick={() => {navigate(`/subject/${schedule.subject_name}`);}}>{schedule.subject_name}</p></td>
                <td><p style={{textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic', fontWeight: 'bold'}} onClick={() => {navigate(`/instructor/${schedule.instructor}`);}}> {instructors.find((instructor) => parseInt(instructor.instructorID) === parseInt(schedule.instructor))?.name || 'Not Assigned'}</p></td>
                <td>
                  <p style={{
                    color: conflex.some(conflict =>
                      conflict.day === schedule.lecture_day &&
                      conflict.starttime === schedule.lecture_starttime &&
                      conflict.endtime === schedule.lecture_endtime &&
                      conflict.building_number === schedule.lecture_building_number &&
                      conflict.roomname === schedule.lecture_roomname
                    ) ? 'red' : 'black'
                  }}>
                    {schedule.lecture_day}:{schedule.lecture_building_number}-{schedule.lecture_roomname}[{schedule.lecture_starttime}-{schedule.lecture_endtime}]
                  </p>
                </td>
                <td>
                  <p style={{
                    color: conflex.some(conflict =>
                      conflict.day === schedule.lab_day &&
                      conflict.starttime === schedule.lab_starttime &&
                      conflict.endtime === schedule.lab_endtime &&
                      conflict.building_number === schedule.lab_building_number &&
                      conflict.roomname === schedule.lab_roomname
                    ) ? 'red' : 'black'
                  }}>
                    {schedule.lab_day}:{schedule.lab_building_number}-{schedule.lab_roomname}[{schedule.lab_starttime}-{schedule.lab_endtime}]
                  </p>
                </td>

                <td>
                  {isConflict && <p style={{color: 'red'}}>Lecture and Lab on the same day</p>}
                  {isTimeConflict && <p style={{color: 'red'}}>Time Conflict with the subject</p>}
                  {conflex.some(conflict =>
                            conflict.day === schedule.lab_day &&
                            conflict.starttime === schedule.lab_starttime &&
                            conflict.endtime === schedule.lab_endtime &&
                            conflict.building_number === schedule.lab_building_number &&
                            conflict.roomname === schedule.lab_roomname
                          ) && <p style={{color: 'red'}}>Conflict with Laboratory Schedule</p>}
                  {conflex.some(conflict =>
                            conflict.day === schedule.lecture_day &&
                            conflict.starttime === schedule.lecture_starttime &&
                            conflict.endtime === schedule.lecture_endtime &&
                            conflict.building_number === schedule.lecture_building_number &&
                            conflict.roomname === schedule.lecture_roomname
                          ) && <p style={{color: 'red'}}>Conflict with Lecture Schedule</p>}
                        {!conflex.some(conflict =>
                            conflict.day === schedule.lab_day &&
                            conflict.starttime === schedule.lab_starttime &&
                            conflict.endtime === schedule.lab_endtime &&
                            conflict.building_number === schedule.lab_building_number &&
                            conflict.roomname === schedule.lab_roomname
                          ) && !conflex.some(conflict =>
                            conflict.day === schedule.lecture_day &&
                            conflict.starttime === schedule.lecture_starttime &&
                            conflict.endtime === schedule.lecture_endtime &&
                            conflict.building_number === schedule.lecture_building_number &&
                            conflict.roomname === schedule.lecture_roomname
                          ) &&  !isConflict && !isTimeConflict && <p>No conflict</p>}
                </td>
                <td>{!isAdmin && (
                    <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
                    onClick={() => {handleCancelClickSchedule(schedule);}}/>
                    )}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showUpdateSchedule ? <UpdateSchedule setShowUpdateSchedule={setShowUpdateSchedule} handleCancelClickSchedule={handleCancelClickSchedule} /> : null}
      
        <div>
{conflicts.length > 0 ? (
  <table className="schedule-table">
    <thead>
      <tr>
        <th>Conflict 1</th>
        <th>Conflict 2</th>
      </tr>
    </thead>
    <tbody>
      {conflicts.map((conflict, index) => (
        <tr key={index}>
          <td>
            <p>BN#: {conflict[0].building_number} Room: {conflict[0].roomname}</p>
            <p>{conflict[0].day} : {conflict[0].starttime} - {conflict[0].endtime}</p>
            {/* Render other properties as needed */}
          </td>
          <td>
            <p>BN#: {conflict[1].building_number} Room: {conflict[1].roomname}</p>
            <p>{conflict[1].day} : {conflict[1].starttime} - {conflict[1].endtime}</p>
            {/* Render other properties as needed */}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No conflicts detected.</p>
)}


      </div>
    </div>
  );
}

export default Schedule;
