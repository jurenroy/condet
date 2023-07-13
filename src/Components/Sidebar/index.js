import React, { useEffect, useState } from 'react';
import list from '../../Assets/listicon.png';
import add from '../../Assets/addicon.png';
import AddCourse from '../Popup/Course/Add';
import UpdateCourse from '../Popup/Course/Update';
import DeleteCourse from '../Popup/Course/Delete';
import AddRooms from '../Popup/Rooms/Add';

function Sidebar() {
  const [courseData, setCourseData] = useState([]);
  const [show , setShow] = useState(false)
  const handleNoClick = () => {
    setShow(false);
  }

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_course_json/')
      .then(response => response.json())
      .then(data => setCourseData(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div style={{ backgroundColor: '#060e57', width: '150px', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <img src={list} alt="list icon" style={{ width: '25px', height: '25px' }} />
        <h3 style={{ color: 'white', marginTop: '0px', marginLeft: '10px' }}>Courses</h3>
        <img src={add} alt="add icon" style={{ width: '20px', height: '20px', marginTop: '1px', marginLeft: '10px', borderRadius: '50%', border: '2px solid white' }} onClick={() => setShow(true)}/>
        {show && <AddCourse setShow={setShow} handleNoClick={handleNoClick}/>}
      </div>
      <ul>
        {courseData.map(course => (
          <li key={course.courseID}>
            {course.abbreviation}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

