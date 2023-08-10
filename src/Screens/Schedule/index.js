import React, { useState, useEffect } from 'react';

function Schedule() {
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    async function fetchScheduleData() {
      try {
        const response = await fetch('http://localhost:8000/get_schedule_json/');
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchScheduleData();
  }, []);

  return (
    <div>
      <h2>Schedule for yawa</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            {/* <th>Section</th> */}
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
                {/* <td>{schedule.course.substring(2)}{yearValue}S{schedule.section_number}</td> */}
                <td>{schedule.subject_code}</td>
                <td>{schedule.subject_name}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;
