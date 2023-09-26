import React,{useState, useEffect} from 'react';
import home from '../../Assets/homeicon2.png'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse, selectYear } from '../Redux/Auth/AuthSlice';

function Navbar() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const [courseAbbreviation, setCourseAbbreviation] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
  };

    // Assuming you have a function to fetch data from an API
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

  // Inside your component
  const getCourseAbbreviation = async (courseId) => {
    const courseData = await fetchCourseData();

    // Find the course with the matching course ID
    const matchingCourse = courseData.find(course => course.courseID === courseId);

    if (matchingCourse) {
      return matchingCourse.abbreviation;
    } else {
      return null; // Course not found
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      getCourseAbbreviation(selectedCourse)
        .then(abbreviation => setCourseAbbreviation(abbreviation))
        .catch(error => console.error('Error fetching course abbreviation:', error));
    }
  // eslint-disable-next-line
  }, [selectedCourse]);

  return (
    <div style={{ backgroundColor: 'white', height: '40px', padding: '1px', marginTop: '10px', marginBottom: '10px', display:'flex', flexDirection: 'row', width: '100vv'}}>
      <img src={home} alt="home icon" style={{ width: '25px', height: '25px', marginLeft: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={handleNavigateToHome}/>
      <h3 style={{color: '#AAAAAA', marginLeft: '5px', marginTop: '5px', cursor: 'pointer'}} onClick={handleNavigateToHome}>Home</h3>
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
    </div>
  );
  
}

export default Navbar;