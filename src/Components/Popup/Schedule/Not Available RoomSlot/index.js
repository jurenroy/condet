import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const NotAvailableRoomslot = (props) => {
  const selectedRoomslot = useSelector((state) => state.auth.roomslot);

  const [roomslotData, setRoomslotData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);  

  const [courseList, setCourseList] = useState([]);
  const selectedCollege = useSelector((state) => state.auth.college);

  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        // Filter instructors by college
        setInstructors(response.data); // Store the filtered instructor names in state
      })
      .catch((error) => {
        console.error('Error fetching instructor data:', error);
      });
  }, []);

  useEffect(() => {
    // Make Axios GET request when selectedCollege changes
    if (selectedCollege) {
      axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/')
      .then(response => {
        // Update the courseList state with the response data
        setCourseList(response.data);
      })
      .catch(error => {
        // Handle errors here
        console.error(error);
      });
    }
  },);

  useEffect(() => {
    // Fetch roomslot data where selectedRoomslot matches roomslot.roomslotID
    async function fetchRoomslotData() {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_roomslot_json/');
        const data = await response.json();

        // Filter the data to find the matching roomslot by ID
        const matchingRoomslot = data.find((roomslot) => roomslot.roomslotID === selectedRoomslot);

        if (matchingRoomslot) {
          setRoomslotData(matchingRoomslot);
          fetchScheduleData(matchingRoomslot);
        } else {
          // Handle case where no matching roomslot is found
          console.warn('No matching roomslot found');
        }
      } catch (error) {
        console.error('Error fetching roomslot data:', error);
      }
    }

    // Fetch schedule data where course matches roomslot.course
    async function fetchScheduleData(roomslotData) {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/');
        const data = await response.json();

        // Filter the data to find schedules matching the course and roomslot details
        const matchingSchedules = data.filter((schedule) => {
            if (roomslotData.roomslottype === 'Lecture') {
              const isMatch = (
                schedule.lecture_day === roomslotData.day &&
                schedule.lecture_starttime === roomslotData.starttime &&
                schedule.lecture_endtime === roomslotData.endtime &&
                schedule.lecture_building_number === roomslotData.building_number &&
                schedule.lecture_roomname === roomslotData.roomname
              );
              return isMatch;
            } else if (roomslotData.roomslottype === 'Laboratory') {
              const isMatch = (
                schedule.lab_day === roomslotData.day &&
                schedule.lab_starttime === roomslotData.starttime &&
                schedule.lab_endtime === roomslotData.endtime &&
                schedule.lab_building_number === roomslotData.building_number &&
                schedule.lab_roomname === roomslotData.roomname
              );
              return isMatch;
            }
            return false;
          });
          
        setScheduleData(matchingSchedules);

      } catch (error) {
        console.error('Error fetching schedule data:', error);
      }
    }

    if (selectedRoomslot) {
      fetchRoomslotData();
    }
  }, [selectedRoomslot]);

  const [instructorName, setInstructorName] = useState(null);

  useEffect(() => {
    console.log(scheduleData);
  
    // Check if scheduleData is not null before proceeding
    if (!scheduleData) {
      setScheduleData()
    }
  
    const getInstructorName = (instructorId) => {
      const matchedInstructor = instructors.find(
        (instructor) => parseInt(instructor.instructorID) === parseInt(instructorId)
      );
      return matchedInstructor ? matchedInstructor.name : null;
    };
  
    const instructorId = parseInt(scheduleData?.[0]?.instructor);
    if (instructorId !== undefined && instructorId !== null) {
      const name = getInstructorName(instructorId);
      setInstructorName(name);
    } else {
      setInstructorName(null);
    }
  }, [scheduleData, instructors]);
  

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999, // Ensure it appears above other content
        display: 'flex',
        alignItems: 'center', // Vertically center content
        flexDirection: 'column',
        marginLeft: '10%'
      }}
    >
      {/* Color sa container na popup */}
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid black',
          height: 'auto', // Adjust height as needed
          width: 'auto',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '20px',
        }}
      >
        {/* Color blue sa taas */}
        <div
          style={{
            backgroundColor: '#060E57',
            height: '14px',
            width: '97%', // Adjust width as needed
            top: '0px',
            marginLeft: '-20px',
            borderTopRightRadius: '18px',
            borderTopLeftRadius: '18px',
            padding: '10px',
            position: 'fixed'
          }}
        />

        {/* Color yellow sa ubos */}
        <div
          style={{
            backgroundColor: '#FAB417',
            height: '14px',
            width: '99.3%', // Adjust width as needed
            borderBottomRightRadius: '18px',
            borderBottomLeftRadius: '18px',
            bottom: '0px', // Adjust margin as needed
            marginLeft: '-19px',
            position: 'absolute',
            padding: '1px',
          }}
        />
        {roomslotData ? (
          <div>
            <h3 style={{ marginTop: '12px' }}>Roomslot Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Roomslot Type</th>
                  <th>Day</th>
                  <th>Room Name</th>
                  <th>Building Number</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{roomslotData.roomslottype}</td>
                  <td>{roomslotData.day}</td>
                  <td>{roomslotData.roomname}</td>
                  <td>{roomslotData.building_number}</td>
                  <td>{roomslotData.starttime}</td>
                  <td>{roomslotData.endtime}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading roomslot data...</p>
        )}

        {!scheduleData ? (
          <p>Loading schedule data...</p>
        ):(
          <div>
        {scheduleData && scheduleData[0] && scheduleData[0].instructor ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <h3 style={{ marginTop: '12px', marginRight: '10px' }}>Schedule Details Instructor:</h3>
              <h3>{instructorName || 'Not Assigned'}</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Subject Code</th>
                  <th>Subject Name</th>
                  <th>Roomslot Type</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((schedule, index) => {
                  const matchedCourse = courseList.find(course => course.courseID === schedule.course);
                  return (
                    <tr key={index}>
                      <td>{matchedCourse ? matchedCourse.abbreviation : 'No matching course'}</td>
                      <td>{schedule.section_year} - Section {schedule.section_number}</td>
                      <td>{schedule.subject_code}</td>
                      <td>{schedule.subject_name}</td>
                      <td>{roomslotData.roomslottype}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1>Occupied by Another College</h1>
        )}
      </div>
        ) 
        }
      </div>
    </div>
  );
};

export default NotAvailableRoomslot;
