import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png';
import { selectSection } from '../../Components/Redux/Auth/AuthSlice';

function Sections() {
  const dispatch = useDispatch();
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSection = useSelector(state => state.auth.sectionnumber);
  const [filteredSections, setFilteredSections] = useState([]);

  const [courseabbreviation, setCourseabbreviation] = useState('');

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
          .then(abbreviation => setCourseabbreviation(abbreviation))
          .catch(error => console.error('Error fetching course abbreviation:', error));
      }
    // eslint-disable-next-line
    }, [selectedCourse]);

  const handleClick = (section) => {
    if (section.sectionnumber === selectedSection) {
      // Dispatch an empty value to deselect the section
      dispatch(selectSection(''));
    } else {
      // Dispatch the action when a different section is clicked
      dispatch(selectSection(section.sectionnumber));
    }
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('https://classscheeduling.pythonanywhere.com/get_section_json/')
      .then(response => response.json())
      .then(data => {
        // Filter subjects based on selected course and year
        const filteredSections = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
        setFilteredSections(filteredSections);
      })
      .catch(error => console.error('Error fetching sections:', error));
  }, [selectedCourse, selectedYear]);

  const courseAbbreviation = courseabbreviation.substring(2); // Removing the first 2 characters
  let yearValue = '1';
  if (selectedYear === 'Second Year') {
    yearValue = '2';
  } else if (selectedYear === 'Third Year') {
    yearValue = '3';
  } else if (selectedYear === 'Fourth Year') {
    yearValue = '4';
  }

  const addSection = () => {
    // Make a POST request to the add_section endpoint with the selectedCourse and selectedYear
    fetch(`https://classscheeduling.pythonanywhere.com/add_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        // Refresh the sections after adding
        fetch('https://classscheeduling.pythonanywhere.com/get_section_json/')
          .then(response => response.json())
          .then(data => {
            const filteredSections = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
            setFilteredSections(filteredSections);              
          })
          .catch(error => console.error('Error fetching sections:', error));
      })
      .catch(error => console.error('Error adding section:', error));
  };

  const deleteSection = () => {
    // Make a DELETE request to the delete_section endpoint with the selectedCourse and selectedYear
    fetch(`https://classscheeduling.pythonanywhere.com/delete_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        // Refresh the sections after deleting
        fetch('https://classscheeduling.pythonanywhere.com/get_section_json/')
          .then(response => response.json())
          .then(data => {
            const filteredSections = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
            setFilteredSections(filteredSections);
          })
          .catch(error => console.error('Error fetching sections:', error));
      })
      .catch(error => console.error('Error deleting section:', error));
  };  
  // eslint-disable-next-line
  const columnsPerRow = 5;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '30px',
      }}
    >
      {filteredSections.map((section, index) => (
        <div
          key={section.sectionnumber}
          style={{
            background:
              section.sectionnumber === selectedSection
                ? 'yellow'
                : 'gold',
            marginRight: '10px', // Adjust the margin between columns
            marginBottom: '10px', // Adjust the margin between rows
            padding: '5px',
            width: '100px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            onClick={() => {
              handleClick(section);
            }}
            style={{
              fontSize: '17px',
              fontWeight: 'bold',
              marginRight: '5px',
              cursor: 'pointer',
            }}
          >
            {courseAbbreviation}
            {yearValue}S{section.sectionnumber}
          </span>
          {index === filteredSections.length - 1 &&
            filteredSections.length !== 1 && (
              <div style={{display:'flex',flexDirection:'column'}}>
                 <label style={{cursor:'pointer',fontSize:'10px',position:'relative',fontWeight:'bold',top:'-1px',left:'-3px'}}>
                   Delete
                 </label>
              <img
                src={add}
                alt="add icon"
                onClick={deleteSection}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: '2px solid black',
                  cursor: 'pointer',
                  left:'-10px',
                  position:'relative',
                  marginLeft: 'auto',
                  transform: 'rotate(45deg)',
                }}
                title='Delete Section' 
              />
              </div>
            )}
        </div>
      ))}
      {filteredSections.length === 0 ||
      (filteredSections.length > 0 &&
        filteredSections[filteredSections.length - 1].sectionnumber !== 1) ? (
          <div style={{display:'flex',flexDirection:'column'}}>
                 <label style={{cursor:'pointer',fontSize:'10px',position:'relative',fontWeight:'bold',top:'-1px',left:'2px'}}>
                   Add
                 </label>
        <img
          src={add}
          alt="add icon"
          onClick={addSection}
          style={{
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            border: '2px solid black',
            cursor: 'pointer',
            marginTop: '2px',
            marginLeft: '3px',
          }}
          title='Add Section'
        />
        </div>
      ) : (
        <span
          style={{
            fontSize: '17px',
            fontWeight: 'bold',
            marginTop: '7px',
            marginLeft: '5px',
          }}
        >
          1 section default
        </span>
      )}
    </div>
  );
}

export default Sections;
