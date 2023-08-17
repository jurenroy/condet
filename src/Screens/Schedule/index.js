import React, { useState, useEffect } from 'react';
import editicon from '../../Assets/edit1.png';
import { useSelector, useDispatch } from 'react-redux';
import { selectSchedule } from '../../Components/Redux/Auth/AuthSlice';
import UpdateSchedule from '../../Components/Popup/Schedule/Update';

function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);
  const dispatch = useDispatch();
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSection = useSelector(state => state.auth.sectionnumber);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const [showUpdateSchedule , setShowUpdateSchedule] = useState(false)

  const handleCancelClickSchedule = (schedule) => {
    setShowUpdateSchedule(prevShow => !prevShow);
    dispatch(selectSchedule(schedule.scheduleID)); 
  }

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch('http://localhost:8000/get_schedule_json/');
        const data = await response.json();

        // Filter data based on selectedCourse, selectedYear, and selectedSection
        const filteredData = data.filter(schedule =>
          schedule.course === selectedCourse &&
          schedule.section_year === selectedYear &&
          schedule.section_number === selectedSection
        );

        setScheduleData(filteredData);
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

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>Schedule for {selectedCourse.substring(2)}{yearvalue}S{selectedSection}</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Subject Code</th>
            <th>Subject Name</th>
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
              yearValue = '4';
            }

            return (
                
              <tr key={schedule.scheduleID}>
                <td>{schedule.subject_code}</td>
                <td>{schedule.subject_name}</td>
                <td>{schedule.instructor}</td>
                <td>{schedule.lecture_day}:{schedule.lecture_building_number}-{schedule.lecture_roomname}[{schedule.lecture_starttime}-{schedule.lecture_endtime}]</td>
                <td>{schedule.lab_day}:{schedule.lab_building_number}-{schedule.lab_roomname}[{schedule.lab_starttime}-{schedule.lab_endtime}]</td>
                <td>{isAdmin && (
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
  );
}

export default Schedule;
