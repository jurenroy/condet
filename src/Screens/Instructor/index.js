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

function Instructor() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { instructor } = useParams();
  const [scheduleData, setScheduleData] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const [showUpdateSchedule, setShowUpdateSchedule] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

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
      const filteredData = data.filter(course => course.college === selectedCollege);
  
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
async function fetchScheduleDataForSearch(searchQuery) {
  try {
    // Fetch the schedule data (you can customize the URL as needed)
    const response = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/');
    const data = await response.json();
    const courseData = await fetchCourseData(selectedCollege);

    // Filter data to keep only schedules whose course ID exists in courseData
    const filteredData = data.filter((schedule) => {
      return courseData.some((course) => course.courseID === schedule.course);
    });

    return filteredData;
  } catch (error) {
       return [];
  }
}
  
  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  
    if (input.trim() !== '') {
      // Fetch schedule data based on the non-empty search input
      fetchScheduleDataForSearch(input)
        .then((data) => {
          // Create an array to store unique instructor names
          const uniqueInstructors = [];
  
          // Filter the data based on the instructor name and add to the uniqueInstructors array
          data.forEach((schedule) => {
            const instructor = schedule.instructor;
            if (instructor.includes(input) && !uniqueInstructors.includes(instructor)) {
              uniqueInstructors.push(instructor);
            }
          });
  
          // Process the unique results as needed
          setSearchResults(uniqueInstructors);
        })
        .catch((error) => {
        });
    } else {
      // Clear the search results when the input is empty
      setSearchResults([]);
    }
  };

  const handleInstructorClick = (instructor) => {
    // Change the route when an instructor is clicked
    navigate(`/instructor/${instructor}`);
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

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px'  }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>Schedule for Instructor: {instructor}</h2>

            <div>
              <input
                type="text"
                placeholder="Search instructors"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <ul>
                {searchResults.map((instructor, index) => (
                  <li
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    key={index} // Use index as the key since instructor names don't have unique IDs
                    onClick={() => handleInstructorClick(instructor)}
                  >
                    {instructor}
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
                <p>time: {conflict[0].starttime} - {conflict[0].endtime}</p>
                {/* Render other properties as needed */}
                {/* Conflict 2 */}
                <br/>
                <p>Building Number: {conflict[1].building_number}</p>
                <p>Room Name: {conflict[1].roomname}</p>
                <p>Day: {conflict[1].day}</p>
                <p>time: {conflict[1].starttime} - {conflict[1].endtime}</p>
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
