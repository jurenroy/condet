import React,{useState, useEffect} from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Subjects from '../Subjects';
import Sections from '../Section';
import Schedule from '../Schedule';
import edit from '../../Assets/edit1.png';
import EditSection from '../../Components/Popup/Section';

function Year() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSection = useSelector(state => state.auth.sectionnumber);
  const [showUpdate  , setShowUpdate] = useState(false)
  const [courseAbbreviation, setCourseAbbreviation] = useState('');

    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    useEffect(() => {
      // Check if the user is logged in and navigate accordingly
      if (!isLoggedIn) {
        navigate('/'); // Redirect to the '/' route
      }
    }, [isLoggedIn, navigate]);

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

    const handleCancelClick = (course) => {
      setShowUpdate(prevShow => !prevShow);
    }


  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px' }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column', width: '100%' }}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
          <h1 style={{ marginTop: '15px', fontSize: '30px'}}>{courseAbbreviation} - {selectedYear}</h1>
          <img 
            src={edit} 
            alt="edit icon" 
            style={{ width: '25px', height: '25px', marginLeft: '20px',marginTop: '25px' , cursor: 'pointer' }} 
            onClick={() => { 
              handleCancelClick();
            }}
            title='Edit Section'
          />
          {showUpdate  ? <EditSection setShowUpdate={setShowUpdate} handleNoClick={handleCancelClick} /> : null}
          </div>
          <Sections/>
          {selectedSection ? <Schedule /> : <Subjects />}
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: '100', height: '10px' }}>
        <p style={{ marginTop: '-5px' }}>Team Kokkak</p>
      </footer>
    </div>
  );
}

export default Year;
