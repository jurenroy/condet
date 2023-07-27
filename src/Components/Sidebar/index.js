import React, { useEffect, useState } from 'react';
import list from '../../Assets/listicon.png';
import add from '../../Assets/addicon.png';
import edit from '../../Assets/edit1.png';
import del from '../../Assets/delete.png';
import AddCourse from '../Popup/Course/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCourse, selectYear } from '../Redux/Auth/AuthSlice';
import UpdateCourse from '../Popup/Course/Update';
import DeleteCourse from '../Popup/Course/Delete';

function Sidebar() {
  const [courseData, setCourseData] = useState([]);
  const [showAdd , setShowAdd] = useState(false)
  const [showUpdate , setShowUpdate] = useState(false)
  const [showDelete , setShowDelete] = useState(false)
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleYearClick = (year) => {
    dispatch(selectYear(year));
    const formattedYear = year.replace(/\s+/g, '-'); // Replace spaces with hyphens
    if (selectedCourse && selectedCourse !== '') {
      navigate(`/${selectedCourse}/${formattedYear}`);
  }
  };

  const handleNoClick = () => {
    setShowAdd(prevShow => !prevShow);
  };

  const handleCancelClick = () => {
    setShowUpdate(prevShow => !prevShow);
  }

  const handleNoDeleteClick = (course) => {
    dispatch(selectCourse(course.abbreviation));
    setShowDelete(prevShow => !prevShow);
  }  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_course_json/')
      .then(response => response.json())
      .then(data => setCourseData(data))
      .catch(error => console.log(error));
  }, []);

  const navigateToRooms = (course) => {
    dispatch(selectCourse(course.abbreviation));
    navigate(`/${course.abbreviation}`);
  };  


  

  return (
    <div style={{ backgroundColor: '#060e57', width: '15%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <img src={list} alt="list icon" style={{ width: '25px', height: '25px' }} />
        <h3 style={{ color: 'white', marginTop: '0px', marginLeft: '10px' }}>Courses</h3>
        <img 
          src={add}
          alt="add icon" 
          style={{ width: '20px', height: '20px', marginTop: '1px', marginLeft: '10px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer' }} 
          onClick={() => {
            handleNoClick();
            setShowUpdate(false);
            setShowDelete(false)
          }}
        />
        {showAdd ? <AddCourse setShowAdd={setShowAdd} handleNoClick={handleNoClick} /> : null}
      </div>
      <ul style={{ listStyleType: 'none', marginLeft: '-20px', width: '60%' }}>
        {courseData.map(course => (
          <li key={course.courseID}  style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ backgroundColor: 'gold', marginBottom: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }}>
              <span style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }} onClick={() => [navigateToRooms(course), handleYearClick('')]}>{course.abbreviation}</span>

              <img 
                src={edit} 
                alt="edit icon" 
                style={{ width: '25px', height: '25px', marginRight: '10px', cursor: 'pointer' }} 
                onClick={() => { 
                  handleCancelClick(); 
                  dispatch(selectCourse(course.abbreviation)); 
                  setShowAdd(false)
                  setShowDelete(false)
              }}
              />
              {showUpdate? <UpdateCourse setShowUpdate={setShowUpdate} handleNoClick={handleCancelClick} /> : null}
              
              <img 
                // src={del} 
                src = {add}
                alt="add icon" 
                // style={{ display:'flex',width: '25px', height: '25px',marginBottom: '1px', marginLeft: '-35px', cursor: 'pointer' }}
                style={{ position: 'absolute', width: '15px', height: '15px', marginLeft: '8.2%', marginBottom: '45px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer', transform: 'rotate(45deg)' }}
                onClick={() => {
                  handleNoDeleteClick(course)
                  setShowAdd(false)
                  setShowUpdate(false)
              }}
              />
              {showDelete? <DeleteCourse setShowDelete={setShowDelete} handleNoClick={handleNoDeleteClick} /> : null}
              
            </div>

            

            {/* Show years only if the course is selected */}
            {selectedCourse === course.abbreviation && (
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '-17px', marginBottom: '15px' }}>
                {years.map((year, index) => (
                  <div key={index} style={{ backgroundColor: selectedYear === year ? '#AAAAAA' : 'white', marginBottom: '3px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', width: '100px', fontWeight: 'bold', cursor: 'pointer'}} onClick={() => handleYearClick(year)}>
                    {year}
                  </div>
                ))}
              </div>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
