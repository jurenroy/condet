import React, { useEffect, useState } from 'react';
import list from '../../Assets/listicon.png';
import add from '../../Assets/addicon.png';
import edit from '../../Assets/edit1.png';
import generate from '../../Assets/generate-icon.png';
import AddCourse from '../Popup/Course/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCourse, selectYear, selectRoom, selectSection, selectSubject, selectTime, selectType } from '../Redux/Auth/AuthSlice';
import UpdateCourse from '../Popup/Course/Update';
import DeleteCourse from '../Popup/Course/Delete';
import AutomateSchedule from '../Popup/Schedule/Automate';

function Sidebar() {
  const [courseData, setCourseData] = useState([]);
  const [showAdd  , setShowAdd] = useState(false)
  const [showUpdate  , setShowUpdate] = useState(false)
  const [showDelete  , setShowDelete] = useState(false)
  const [showAutomate  , setShowAutomate] = useState(false)
  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedCollege = useSelector(state => state.auth.college);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const closeAllPopups = () => {
    setShowAdd(false);
    setShowUpdate(false);
    setShowDelete(false);
    setShowAutomate(false);
  };

  const handleYearClick = (year) => {
    dispatch(selectYear(year));
    const formattedYear = year.replace(/\s+/g, '-'); // Replace spaces with hyphens
    if (selectedCourse && selectedCourse !== '') {
      navigate(`/${selectedCourse}/${formattedYear}`);
      dispatch(selectRoom(''));
      dispatch(selectSection(''));
      dispatch(selectTime(''));
      dispatch(selectSubject(''));
      dispatch(selectType(''));
  }
  };

  const handleNoClick = () => {
    closeAllPopups();
    setShowAdd(prevShow => !prevShow);
  };

  const handleCancelClick = (course) => {
    dispatch(selectCourse(course.courseID));
    closeAllPopups();
    setShowUpdate(prevShow => !prevShow);
  }

  const handleNoDeleteClick = (course) => {
    dispatch(selectCourse(course.courseID));
    closeAllPopups();
    setShowDelete(prevShow => !prevShow);
  }  
  const handleAutomateClick = (course) => {
    dispatch(selectCourse(course.courseID));
    closeAllPopups();
    setShowAutomate(prevShow => !prevShow);
  }  

  useEffect(() => {
    fetch('https://classscheeduling.pythonanywhere.com/get_course_json/')
      .then(response => response.json())
      .then(data => setCourseData(data))
      .catch(error => console.log(error));
  }, []);

  const navigateToRooms = (course) => {
    dispatch(selectCourse(course.courseID));
    navigate(`/${course.courseID}`);
    dispatch(selectRoom(''));
    dispatch(selectSection(''));
    dispatch(selectTime(''));
    dispatch(selectSubject(''));
    dispatch(selectType(''));
  };  

  return (
    <div style={{ backgroundColor: '#060e57', width: '15%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <img src={list} alt="list icon" style={{ width: '25px', height: '25px', position: 'absolute', marginLeft: '-100px' }} />
        <h3 style={{ color: 'white', marginTop: '0px', marginLeft: '10px' }}>Courses</h3>
        {isAdmin && (
        <img 
          src={add}
          alt="add icon" 
          style={{ width: '20px', height: '20px', marginTop: '1px', marginLeft: '110px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer', position: 'absolute' }} 
          onClick={handleNoClick}
        />
        )}
        {showAdd  ? <AddCourse setShowAdd={setShowAdd} handleNoClick={handleNoClick} /> : null}
      </div>
      <ul style={{ listStyleType: 'none', marginLeft: '-40%', width: '60%' }}>
        {courseData.map(course => {
          // Check if the college of the course matches the college in the Redux state
          const isMatchingCollege = course.college === selectedCollege;

          if (isMatchingCollege) {
            return (
              <li key={course.courseID}  style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ backgroundColor: selectedCourse === course.id ? 'yellow' : 'gold', marginBottom: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px', width: '140%', marginLeft: '0%'}}>
                  <span style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }} onClick={() => [navigateToRooms(course), handleYearClick('')]}>{course.abbreviation}</span>
                  
                  {!isAdmin && (

                  <img 
                    src={generate} 
                    alt="generate icon" 
                    style={{ width: '25px', height: '25px', marginRight: '10px', cursor: 'pointer' }} 
                    onClick={() => { 
                      handleAutomateClick(course);    
                    }}
                  />
                  )}
                  
                  {isAdmin && (

                    <img 
                      src={edit} 
                      alt="edit icon" 
                      style={{ width: '25px', height: '25px', marginRight: '10px', cursor: 'pointer' }} 
                      onClick={() => { 
                        handleCancelClick(course);
                      }}
                    />
                    )}
                  
                  {isAdmin && (
                  <img 
                    src={add} 
                    alt="add icon" 
                    style={{ position: 'absolute', width: '15px', height: '15px', marginLeft: '12.4%', marginBottom: '45px', borderRadius: '50%', border: '2px solid white', cursor: 'pointer', transform: 'rotate(45deg)', marginTop: '-0.5%' }}
                    onClick={() => {
                      handleNoDeleteClick(course)
                  }}  
                  />
                  )}
                   
                </div>
  
                {/* Show years only if the course is selected */}
                {selectedCourse === course.courseID && (
                  <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '-17px', marginBottom: '15px', marginLeft: '25%' }}>
                    {years.map((year, index) => (
                      <div key={index} style={{ backgroundColor: selectedYear === year ? '#AAAAAA' : 'white', marginBottom: '3px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', width: '120%', fontWeight: 'bold', cursor: 'pointer', marginLeft: '30%'}} onClick={() => handleYearClick(year)}>
                        {year}
                      </div>
                    ))}
                  </div>
                )}
  
              </li>
            );
          } else {
            return null; // Skip rendering this course if the college doesn't match
          }
        })}
      </ul>
      {showAutomate  ? <AutomateSchedule setShowAutomate={setShowAutomate} handleNoClick={handleAutomateClick} /> : null}
      {showUpdate  ? <UpdateCourse setShowUpdate={setShowUpdate} handleNoClick={handleCancelClick} /> : null}
      {showDelete  ? <DeleteCourse setShowDelete={setShowDelete} handleNoClick={handleNoDeleteClick} /> : null}
    </div>
  );
}

export default Sidebar;