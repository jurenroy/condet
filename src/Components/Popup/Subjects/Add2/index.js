import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSubject2 = (props) => {
  const [subjectcode, setSubjectcode] = useState('');
  const [subjectname, setSubjectname] = useState('');
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]); // State for storing the courses

  const selectedCollege = useSelector(state => state.auth.college);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year)

  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleAddSubject();
      }

      if (e.key === 'Escape') {
        props.setShowAddSubject(false)
      }
    };

    useEffect(() => {
      // Fetch courses from the API
      axios
        .get('https://classscheeduling.pythonanywhere.com/get_course_json/')
        .then((response) => {
          const filteredData = response.data.filter((course) => course.college === selectedCollege);
          setCourses(filteredData); // Store the courses in state
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
        });
    }, []);

  const handleAddSubject = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (subjectcode.trim() === '' && subjectname.trim() === '' && course.trim() === '' && year.trim() === '') {
      setError('All fields are required to fill in.');
    
    }else if (subjectcode.trim() === ''|| !course || !year ) {
      setError('Please input a valid Subject Code');
    
    }else if (subjectname.trim() === ''|| !course || !year) {
        setError('Please input a valid Subject Name');

    }else if (course.trim() === '') {
      setError('Please Select Course');
    
    }else if (year.trim() === '') {
        setError('Please Select Year Level');
  
    }else{

    // Create FormData object
    const formData = new FormData();
    formData.append('subjectcode', subjectcode);
    formData.append('subjectname', subjectname);
    formData.append('year', year);

    // Send the room data to the Django backend
    axios
      .post(`https://classscheeduling.pythonanywhere.com/add_subject/${course}/`, formData)
      .then((response) => {
        console.log(response.data.message); // You can show this message to the user if needed
        props.setShowAddSubject(false); // Close the add room form
        window.location.reload();
      })
      .catch((error) => {
        // Handle error response
        if (error.response) {
          setError(error.response.data.message || 'An error occurred.');
        } else {
          setError('An error occurred.');
        }
      });
    }
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '380px',
      width: '400px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      border: '1px solid black',
      borderRadius: '10px'
    }}>

      <div style={{
      backgroundColor: '#060E57', 
      height: '20px',
      width: '400px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Subject</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '437.5px', 
      position: 'absolute',
      left:'0.4%',
      top: '98.5%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      }}/>
      <div style={{display: 'flex', flexDirection: 'row', marginTop: '40px', marginBottom: '-40px', justifyContent: 'space-around'}}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
      <h3 style={{ marginTop: '12px' }}>Course:</h3>
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '18px' }}
        value={course} // Make sure you have a state variable 'course' to store the selected course ID
        onChange={(e) => {
          setCourse(e.target.value); // Update the 'course' state with the selected ID
        }}
      >
        <option value="">Course</option>
        {courses.map((course) => (
          <option key={course.courseID} value={course.courseID}>
            {course.abbreviation}
          </option>
        ))}
      </select>

      </div>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
      <h3 style={{ marginTop: '12px' }}>Year Level:</h3>
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        value={year}
        onChange={(e) => {setYear(e.target.value)
        }}
      >
        <option value="">Year Level</option>
        <option value="First Year">First Year</option>
        <option value="Second Year">Second Year</option>
        <option value="Third Year">Third Year</option>
        <option value="Fourth Year">Fourth Year</option>
      </select>
      </div>
      </div>

      <h3 style={{marginTop:'50px'}}>Subject Code:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize:'20px' }}
        type="text" 
        value={subjectcode} 
        onChange={e => setSubjectcode(e.target.value)}
        onKeyDown={handleKeyPress}
        required
      />

      <h3 style={{marginTop:'12px'}}>Subject Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px'}}
        type="text" 
        value={subjectname} 
        onChange={e => setSubjectname(e.target.value)}
        onKeyDown={handleKeyPress}
        required
      />

      {error && <p style={{ color: 'red', marginBottom: '-20px' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddSubject}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddSubject(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSubject2;
