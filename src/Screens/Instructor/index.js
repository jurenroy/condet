import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import editicon from '../../Assets/edit1.png';
import { selectCourse, selectSchedule, selectYear } from '../../Components/Redux/Auth/AuthSlice';
import UpdateSchedule from '../../Components/Popup/Schedule/Update';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ClearScheduleComponent from '../../Components/Popup/Schedule/Clear';

function Instructor() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { instructor } = useParams();
  const instructorID = parseInt(instructor);
  const [scheduleData, setScheduleData] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const [showUpdateSchedule, setShowUpdateSchedule] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

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

  useEffect(() => {
    // Check if the user is logged in and navigate accordingly
    if (!isLoggedIn) {
      navigate('/'); // Redirect to the '/' route
    }
  }, [isLoggedIn, navigate]);

// Fetch course data based on selectedCollege
async function fetchCourseData(selectedCollege) {
    try {
      const response = await fetch('https://classscheeduling.pythonanywhere.com/get_course_json/');
      const data = await response.json();
  
      // Filter the data based on selectedCollege
      const filteredData = data.filter(course => course.college === parseInt(selectedCollege));
  
      return filteredData;
    } catch (error) {
      return [];
    }
  }  
  
  // Fetch schedule data and add course abbreviation
  // Fetch schedule data and add course abbreviation
  // eslint-disable-next-line
  async function fetchScheduleData() {
    try {
      const scheduleResponse = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/').then((response) =>
        response.json()
      );
  
  
      // Extract courseIDs from scheduleResponse
      const courseIDs = scheduleResponse.map((schedule) => schedule.course);
  
      // Fetch course data based on selectedCollege and courseIDs
      const courseData = await fetchCourseData(selectedCollege, courseIDs);
  
      // Filter data based on selectedCourse, selectedYear, and selectedSection
      const filteredData = scheduleResponse.filter((schedule) => schedule.instructor === instructor);
  
      // Add course abbreviation to each schedule
      const schedulesWithAbbreviation = filteredData
        .map((schedule) => {
          const matchingCourse = courseData.find((course) => course.courseID === schedule.course);
          const abbreviation = matchingCourse ? matchingCourse.abbreviation : null;
  
          return {
            ...schedule,
            abbreviation,
          };
        })
        .filter((schedule) => schedule.abbreviation !== null); // Filter out schedules without abbreviation
  
      setScheduleData(schedulesWithAbbreviation);
    } catch (error) {
    }
  }
  

  useEffect(() => {
    if (location.pathname === `/instructor/${instructor}`) {
      dispatch(selectCourse(''));
      dispatch(selectYear(''));
    }
  }, [dispatch, location.pathname, instructor]);


  const handleCancelClickSchedule = (schedule) => {
    setShowUpdateSchedule(prevShow => !prevShow);
    dispatch(selectSchedule(schedule.scheduleID));
  }

  useEffect(() => {
    fetchScheduleData();
    // eslint-disable-next-line
  }, [instructor, selectedCourse, fetchScheduleData]);

  


  // Define a function to fetch schedule data for the search bar
  async function fetchInstructorsDataForSearch(searchQuery) {
    try {
      const response = await axios.get('https://classscheeduling.pythonanywhere.com/get_instructor_json/');
      const filteredInstructors = response.data.filter((instructor) => instructor.college === selectedCollege && instructor.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
      return filteredInstructors;
    } catch (error) {
      return [];
    }
  }
  
  
  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  
    if (input.trim() !== '') {
      // Fetch instructor data based on the non-empty search input
      fetchInstructorsDataForSearch(input)
        .then((data) => {
          // Process the unique results as needed
          setSearchResults(data);
        })
        .catch((error) => {
          console.error('Error fetching instructor data:', error);
        });
    } else {
      // Clear the search results when the input is empty
      setSearchResults([]);
    }
  };

  const handleInstructorClick = (instructor) => {
    const selectedInstructorID = instructor.instructorID;
    navigate(`/instructor/${selectedInstructorID}`);
  };
  

  //conflex
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

// Find the instructor object based on the instructor ID from the URL params
const instructorName = instructors.find((instructor) => instructor.instructorID === instructorID)?.name || 'Unknown Instructor';


const handleButtonClick = () => {
  // Navigate to the specified route
  navigate(`/schedule/instructor/${instructorID}`);
};

const formattedTime = (timeString) => {
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  const formattedTime = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return formattedTime;
};


  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px'  }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>Schedule for Instructor: {instructorName}</h2>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <button style={{height: '15', cursor: conflex.length > 0 ? 'not-allowed' : 'pointer',}} disabled={conflex.length > 0} onClick={handleButtonClick}>View Visualization</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search instructors"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <ul>
                {searchResults.map((instructor) => (
                  <li
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    key={instructor.instructorID}
                    onClick={() => handleInstructorClick(instructor)}
                  >
                    {instructor.name}
                  </li>
                ))}
              </ul>

            </div>

            <table className="schedule-table">
              <thead>
                <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Lecture Schedule</th>
                <th>Laboratory Schedule</th>
                <th>Conflict</th>
                {!isAdmin &&(
                <th>Action</th>
                )}
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
                          {schedule.lecture_day}:{schedule.lecture_building_number}-{schedule.lecture_roomname}[{formattedTime(schedule.lecture_starttime)}-{formattedTime(schedule.lecture_endtime)}]
                        </p>
                            {schedule.lecture_day && schedule.lecture_building_number && schedule.lecture_roomname ?
                  <ClearScheduleComponent selectedSchedule={schedule.scheduleID} selectedType="Lecture"/>:
                  null }
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
                          {schedule.lab_day}:{schedule.lab_building_number}-{schedule.lab_roomname}[{formattedTime(schedule.lab_starttime)}-{formattedTime(schedule.lab_endtime)}]
                        </p>
                            {schedule.lab_day && schedule.lab_building_number && schedule.lab_roomname ?
                  <ClearScheduleComponent selectedSchedule={schedule.scheduleID} selectedType="Laboratory"/> :
                  null }
                      </td>
                      
                      <td>
                        {isConflict && <p style={{color: 'red'}}>Lecture and Lab on the same day</p>}
                        {isTimeConflict && <p style={{color: 'red'}}>Time Conflict</p>}
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

                      {!isAdmin && (
                        <td>
                           <div style={{top:'-2px',position:'relative',flex:'1',display:'flex',flexDirection:'row'}}>
                    <label style={{fontWeight:'bold',fontSize:'15px',position:'relative',left:'10px'}}>
                      Edit
                    </label>

                    </div>

                    <img src={editicon} alt="edit icon" style={{ width: '23px', height: '23px', marginLeft: '10px', cursor: 'pointer' }} 
                    onClick={() => {handleCancelClickSchedule(schedule);}}
                    title='Edit Schedule'
                    />
                    </td>
                          )}

                    </tr>
                  );
                })}
              </tbody>
            </table>
            {showUpdateSchedule ? <UpdateSchedule setShowUpdateSchedule={setShowUpdateSchedule} handleCancelClickSchedule={handleCancelClickSchedule} /> : null}
          </div>
          {conflicts.length > 0 ? (
          <div>
            <p>Conflicts detected:</p>
            {conflicts.map((conflict, index) => (
              <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
                <p>Conflict between:</p>
                <br/>
                <p>Building Number: {conflict[0].building_number}</p>
                <p>Room Name: {conflict[0].roomname}</p>
                <p>Day: {conflict[0].day}</p>
                <p>time: {formattedTime(conflict[0].starttime)} - {formattedTime(conflict[0].endtime)}</p>
                {/* Render other properties as needed */}
                {/* Conflict 2 */}
                <br/>
                <p>Building Number: {conflict[1].building_number}</p>
                <p>Room Name: {conflict[1].roomname}</p>
                <p>Day: {conflict[1].day}</p>
                <p>time: {formattedTime(conflict[1].starttime)} - {formattedTime(conflict[1].endtime)}</p>
                {/* Render other properties as needed */}
              </div>
            ))}
          </div>
        ) : (
          <p>No conflicts detected.</p>
        )} 
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>Team Kokkak</p>
      </footer>
    </div>
  );
}

export default Instructor;
