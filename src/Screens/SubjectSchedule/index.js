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

function SubjectSchedule() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { subject_name } = useParams();
  const [scheduleData, setScheduleData] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const [showUpdateSchedule, setShowUpdateSchedule] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

// Fetch course data based on selectedCollege
async function fetchCourseData(selectedCollege) {
    try {
      const response = await fetch('http://127.0.0.1:8000/get_course_json/');
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
      const scheduleResponse = await fetch('http://127.0.0.1:8000/get_schedule_json/').then((response) =>
        response.json()
      );
  
  
      // Extract courseIDs from scheduleResponse
      const courseIDs = scheduleResponse.map((schedule) => schedule.course);
  
      // Fetch course data based on selectedCollege and courseIDs
      const courseData = await fetchCourseData(selectedCollege, courseIDs);
  
      // Filter data based on selectedCourse, selectedYear, and selectedSection
      const filteredData = scheduleResponse.filter((schedule) => schedule.subject_name === subject_name);
  
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
    if (location.pathname === `/subject/${subject_name}`) {
      dispatch(selectCourse(''));
      dispatch(selectYear(''));
    }
  }, [dispatch, location.pathname, subject_name]);


  const handleCancelClickSchedule = (schedule) => {
    setShowUpdateSchedule(prevShow => !prevShow);
    dispatch(selectSchedule(schedule.scheduleID));
  }

  useEffect(() => {
    fetchScheduleData();
    // eslint-disable-next-line
  }, [subject_name, selectedCourse, fetchScheduleData]);

  


  // Define a function to fetch schedule data for the search bar
async function fetchScheduleDataForSearch(searchQuery) {
  try {
    // Fetch the schedule data (you can customize the URL as needed)
    const response = await fetch('http://localhost:8000/get_schedule_json/');
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
          const uniqueSubject_name = [];
  
          // Filter the data based on the instructor name and add to the uniqueSubject_name array
          data.forEach((schedule) => {
            const subject_name = schedule.subject_name;
            if (subject_name.includes(input) && !uniqueSubject_name.includes(subject_name)) {
              uniqueSubject_name.push(subject_name);
            }
          });
  
          // Process the unique results as needed
          setSearchResults(uniqueSubject_name);
        })
        .catch((error) => {
        });
    } else {
      // Clear the search results when the input is empty
      setSearchResults([]);
    }
  };

  const handleSubjectClick = (subject_name) => {
    // Change the route when an instructor is clicked
    navigate(`/subject/${subject_name}`);
  };

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>Schedule for Subject: {subject_name}</h2>

            <div>
              <input
                type="text"
                placeholder="Search Subjects"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <ul>
                {searchResults.map((subject_name, index) => (
                  <li
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    key={index} // Use index as the key since instructor names don't have unique IDs
                    onClick={() => handleSubjectClick(subject_name)}
                  >
                    {subject_name}
                  </li>
                ))}
              </ul>
            </div>

            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Instructor</th>
                  <th>Lecture Schedule</th>
                  <th>Laboratory Schedule</th>
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

                  return (
                    <tr key={schedule.scheduleID}>
                      <td>{schedule.abbreviation}{yearValue}S{schedule.section_number}</td>
                      <td>{schedule.subject_code} - {schedule.subject_name}</td>
                      <td>{schedule.instructor}</td>
                      <td>{schedule.lecture_day}:{schedule.lecture_building_number}-{schedule.lecture_roomname}[{schedule.lecture_starttime}-{schedule.lecture_endtime}]</td>
                      <td>{schedule.lab_day}:{schedule.lab_building_number}-{schedule.lab_roomname}[{schedule.lab_starttime}-{schedule.lab_endtime}]</td>
                      <td>{isAdmin && (
                        <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }}
                          onClick={() => { handleCancelClickSchedule(schedule); }} />
                      )}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {showUpdateSchedule ? <UpdateSchedule setShowUpdateSchedule={setShowUpdateSchedule} handleCancelClickSchedule={handleCancelClickSchedule} /> : null}
          </div>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>footer man ni sya</p>
      </footer>
    </div>
  );
}

export default SubjectSchedule;
