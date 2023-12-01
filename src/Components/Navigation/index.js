import React, { useState, useEffect } from 'react';
import home from '../../Assets/homeicon2.png';
import edit1 from '../../Assets/edit1.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { selectCourse, selectYear } from '../Redux/Auth/AuthSlice';
import EditSemester from '../Popup/Semester';

function Navbar() {
  const selectedCourse = useSelector((state) => state.auth.course);
  const selectedYear = useSelector((state) => state.auth.year);
  const selectedSemester = useSelector((state) => state.auth.semester);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [showUpdate  , setShowUpdate] = useState(false)
  const [courseAbbreviation, setCourseAbbreviation] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCancelClick = () => {
    setShowUpdate(prevShow => !prevShow);
    console.log('agay')
  }

  const handleNavigateToHome = () => {
    navigate('/');
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
  };

  // Function to fetch course data from an API
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

  // Function to get the course abbreviation based on course ID
  const getCourseAbbreviation = async (courseId) => {
    const courseData = await fetchCourseData();

    // Find the course with the matching course ID
    const matchingCourse = courseData.find((course) => course.courseID === courseId);

    if (matchingCourse) {
      return matchingCourse.abbreviation;
    } else {
      return null; // Course not found
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      getCourseAbbreviation(selectedCourse)
        .then((abbreviation) => setCourseAbbreviation(abbreviation))
        .catch((error) => console.error('Error fetching course abbreviation:', error));
    }
    // eslint-disable-next-line
  }, [selectedCourse]);

  

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '40px',
        padding: '1px',
        marginTop: '65px',
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '50',
      }}
    >
      <img
        src={home}
        alt="home icon"
        style={{ width: '25px', height: '25px', marginLeft: '10px', marginTop: '5px', cursor: 'pointer' }}
        onClick={handleNavigateToHome}
      />
      <h3
        style={{ color: '#AAAAAA', marginLeft: '5px', marginTop: '5px', cursor: 'pointer' }}
        onClick={handleNavigateToHome}
      >
        Home
      </h3>
      {selectedCourse && (
        <>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> {'>'} </h3>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{courseAbbreviation}</h3>
          {selectedYear && (
            <>
              <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> {'>'} </h3>
              <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{selectedYear}</h3>
            </>
          )}
        </>
      )}
      {location.pathname.startsWith('/instructor/') && (
        <>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> {'>'} </h3>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>Instructor</h3>
        </>
      )}
      {location.pathname.startsWith('/subject/') && (
        <>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> {'>'} </h3>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>Subject</h3>
        </>
      )}

      {selectedSemester && isAdmin && (
                      <><div style={{position: 'absolute', width: 'auto', display: 'flex', flexDirection: 'row', right: '15px'}}>
                        <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{selectedSemester}</h3>
                        <button style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                          <img
                            src={edit1} // Replace with the actual path to your edit2 image
                            alt="Edit1"
                            style={{ height: '20px', width: 'auto', marginTop: '-7px', marginLeft: '5px' }}
                            onClick={() => { 
                              handleCancelClick();
                            }}
                          />
                        </button> 
                        </div>
                      </>
                    )}
                    {showUpdate  ? <EditSemester setShowUpdate={setShowUpdate} handleNoClick={handleCancelClick} /> : null}
    </div>
  );
}

export default Navbar;
