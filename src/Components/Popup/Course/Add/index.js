import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddCourse = (props) => {
    const [coursename, setCoursename] = useState('');
    const [abbreviation, setAbbreviation] = useState('');
    const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const college = useSelector(state => state.auth.college);
    const [cabbreviation, setCabbreviation] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://classscheeduling.pythonanywhere.com/get_college_json/');
          const selectedCollege = response.data.find(collegeItem => collegeItem.collegeID === parseInt(college));
          setCabbreviation(selectedCollege.abbreviation)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [college, setCabbreviation]);


    const [courselist, setCourselist] = useState([]);
    // eslint-disable-next-line
    const [courselang, setCourselang] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const courselistResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_courselist_json/');
          const courselangResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/');
        
          const courselistData = courselistResponse.data.filter(courseItem => courseItem.college === parseInt(college));
          const courselangData = courselangResponse.data.filter(courseItem => courseItem.college === parseInt(college));
        
          // Extract course names from courselangData
          const courselangNames = courselangData.map(courseItem => courseItem.coursename);
        
          // Filter out courses from courselistData that are already in courselangNames
          const filteredCourses = courselistData.filter(courseItem => !courselangNames.includes(courseItem.coursename));
        
          setCourselist(filteredCourses);
        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [college, setCourselist, setCourselang]);



    // State for tracking dragging functionality
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({
      x: (window.innerWidth - 400) / 2, // 400 is the width of the component
      y: (window.innerHeight - 300) / 2, // 300 is the height of the component
    });

    const dragStartPos = useRef(null);
  
    const handleMouseDown = (e) => {
      setIsDragging(true);
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    };
  
    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartPos.current = null;
    };
  
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
      
        setPosition({
          x: position.x + deltaX,
          y: position.y + deltaY,
        });
      
        dragStartPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleAddCourse();
      }
      if (e.key === 'Escape') {
        props.setShowAdd(false)
      }
    };

    const handleAddCourse = () => {
      if (coursename.trim() === '' && abbreviation.trim() === '') {
        setErrorMessage('Please provide a valid coursename, abbreviation');
      }else
       if (coursename.trim() === ''){
        setErrorMessage('Please provide a valid coursename');
        
      }else
       if (abbreviation.trim() === ''){
        setErrorMessage('Please provide a valid abbreviation');
      
      }else{

        setButtonDisabled(true); // Disable the button
        setLoading(true);

      const formData = new FormData();
      formData.append('coursename', coursename);
      formData.append('abbreviation', abbreviation);
      formData.append('college', parseInt(college));
      
  
      axios
        .post('https://classscheeduling.pythonanywhere.com/add_course/', formData)
        .then(response => {
          // setSuccessMessage(response.data.message);
          // setErrorMessage('');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error:', error);
          setErrorMessage('Error adding course');
          setSuccessMessage('');
        })
        .finally(() => {
          setButtonDisabled(false); // Re-enable the button after request completion
          setLoading(false); // Re-enable the button after request completion
        });
      }
    };
    
  return (
    <div
      style={{
        backgroundColor: 'white',
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px',
        height: '300px',
        width: '400px',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px solid black',
        borderRadius: '10px',
        zIndex: '999',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >

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
         <h2 style={{marginTop:'-2px',color:'white'}}>Add Course ({cabbreviation})</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '437.5px', 
      position: 'absolute',
      left:'0.4%',
      top: '98%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      }}/>

      <h3 style={{ marginTop: '50px' }}>Course Name:</h3>
      <select
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        value={coursename}
        onChange={(e) => {
          const selectedCourse = e.target.value;
          setCoursename(selectedCourse);
        
          // Find the course in courselist based on the selected course name
          const selectedCourseData = courselist.find(course => course.coursename === selectedCourse);
        
          // Set the abbreviation based on the selected course data
          if (selectedCourseData) {
            setAbbreviation(selectedCourseData.abbreviation);
          } else {
            setAbbreviation('');
          }
        }}
        onKeyDown={handleKeyPress}
      >
        <option value="" disabled style={{ fontSize: '20px', color: 'white' }}>Select</option>
        {courselist.map(course => (
          <option key={course.id} value={course.coursename} style={{ fontSize: '20px', color: 'black' }}>
            {course.coursename}
          </option>
        ))}
      </select>
        
      <h3 style={{ marginTop: '12px' }}>Abbreviation:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={abbreviation}
        readOnly // Set the input as read-only
        onKeyDown={handleKeyPress}
      />

      {/* {successMessage && <p>{successMessage}</p>} */}
      {errorMessage && <p>{errorMessage}</p>}
      
      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
      
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddCourse} disabled={isButtonDisabled}> {isLoading ? 'Adding...' : 'Add'} </button>
      
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAdd(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default AddCourse;