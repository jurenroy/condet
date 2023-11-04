import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { selectCourse, selectYear, setAdmin, setCollege, selectSubject, selectInstructor } from '../../Components/Redux/Auth/AuthSlice';
import axios from 'axios';
import AddSubject2 from '../../Components/Popup/Subjects/Add2';
import UpdateSubject from '../../Components/Popup/Subjects/Update';
import DeleteSubject from '../../Components/Popup/Subjects/Delete';
import AddInstructor from '../../Components/Popup/Instructor/Add';
import UpdateInstructor from '../../Components/Popup/Instructor/Update';
import DeleteInstructor from '../../Components/Popup/Instructor/Delete';
import { useNavigate } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUsername = useSelector(state => state.auth.username);
  const [subjectdata, setSubjectData] = useState([]);
  const [collegee, setCollegee] = useState([]);
  const [courses, setCourses] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const [showAddSubject , setShowAddSubject] = useState(false)
  const [showUpdateSubject , setShowUpdateSubject] = useState(false)
  const [showDeleteSubject , setShowDeleteSubject] = useState(false)

  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');

  const [instructors, setInstructors] = useState([]);

  const [showAddInstructor , setShowAddInstructor] = useState(false)
  const [showUpdateInstructor , setShowUpdateInstructor] = useState(false)
  const [showDeleteInstructor , setShowDeleteInstructor] = useState(false)

  const handleNoClickSubject = () => {
    setShowAddSubject(prevShow => !prevShow);
  };

  const handleCancelClickSubject = (subject) => {
    setShowUpdateSubject(prevShow => !prevShow);
    dispatch(selectSubject(subject.subjectID));
    dispatch(selectCourse(subject.course));
    dispatch(selectYear(subject.year));
  }

  const handleNoDeleteClickSubject = (subject) => {
    setShowDeleteSubject(prevShow => !prevShow);
    dispatch(selectSubject(subject.subjectID));
    dispatch(selectCourse(subject.course));
    dispatch(selectYear(subject.year));  
  }  

  const handleNoClickInstructor = () => {
    setShowAddInstructor(prevShow => !prevShow);
  };

  const handleCancelClickInstructor = (instructor) => {
    dispatch(selectInstructor(instructor.instructorID));
    setShowUpdateInstructor(prevShow => !prevShow);
  }

  const handleNoDeleteClickInstructor = (instructor) => {
    dispatch(selectInstructor(instructor.instructorID));
    setShowDeleteInstructor(prevShow => !prevShow);
  } 

  const getCourseAbbreviation = (courseID) => {
    const course = courses.find((c) => c.courseID === courseID);
    return course ? course.abbreviation : '';
  };
  
  useEffect(() => {
        // Fetch user data from the API using Axios
    axios.get('https://classscheeduling.pythonanywhere.com/users/')
  .then(response => {
    console.log('Fetched data:', response.data);
    const userData = response.data.find(user => user.email === storedUsername);
    console.log('User data:', userData);
    if (userData) {
      dispatch(setAdmin(userData.isAdmin));
      dispatch(setCollege(userData.college));
      setCollegee(userData.college);
    }
  })
  .catch(error => console.log('Error fetching data:', error));
  }, [dispatch, location.pathname, storedUsername]);


  useEffect(() => {
    // Step 1: Fetch courses
    axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/')
      .then((response) => {
        const filteredData = response.data.filter((course) => course.college === collegee);
        setCourses(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, [collegee]);


  useEffect(() => {
    // Step 2: Fetch subjects based on the filtered courses
    axios.get('https://classscheeduling.pythonanywhere.com/get_subject_json/')
      .then((response) => {
        // Filter the data to include only subjects with the matching course
        const filteredSubjects = response.data.filter((subject) =>
          courses.some((course) => course.courseID === subject.course)
        );
        setSubjectData(filteredSubjects);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [courses]);

  const filteredSubjects = subjectdata.filter((subject) => {

    // Check if both course and year are selected, and filter subjects accordingly
    if (course && year) {
      return parseInt(subject.course) === parseInt(course) && subject.year === year;
    }
    // If only one of course or year is selected, filter subjects based on the selected value
    if (course) {
      return parseInt(subject.course) === parseInt(course);
    }
    if (year) {
      return subject.year === year;
    }
    // If neither course nor year is selected, return all subjects
    return true;
  });

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        // Filter instructors by college
        const filteredInstructors = response.data.filter((instructor) => instructor.college === collegee);
        setInstructors(filteredInstructors); // Store the filtered instructor names in state
      })
      .catch((error) => {
        console.error('Error fetching instructor data:', error);
      });
  }, [collegee]);

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px' }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column' }}>
          <div style={{display: 'flex', flexDirection: 'row'}}>
          <h1>Subjects</h1>
          

          
          {isAdmin && (
        <img src={add} alt="add icon" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer', marginTop: '32px', marginLeft: '15px' }}
        onClick={() => {handleNoClickSubject();
          setShowUpdateSubject(false);
          setShowDeleteSubject(false)
        }}/>
        )}

          <select
            style={{ height: '30px', borderRadius: '10px', fontSize: '18px', marginTop: '30px', marginLeft: '20px' }}
            value={course} // Make sure you have a state variable 'course' to store the selected course ID
            onChange={(e) => {
              setCourse(e.target.value); // Update the 'course' state with the selected ID
              console.log(e.target.value)
            }}
          >
            <option value="">Course</option>
            {courses.map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.abbreviation}
              </option>
            ))}
          </select>
          <select
            style={{ height: '30px', borderRadius: '10px', fontSize: '20px', marginTop: '30px', marginLeft: '20px' }}
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
        {showAddSubject ? <AddSubject2 setShowAddSubject={setShowAddSubject} handleNoClickSubject={handleNoClickSubject} /> : null}
        </div>
          <table className="schedule-table" style={{width: 'auto'}}>
            <thead>
              <tr>
                <th>Course</th>
                <th>Year</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                {isAdmin && (
                <th>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.subjectcode}>
                  <td>{getCourseAbbreviation(subject.course)}</td>
                  <td>{subject.year}</td>
                  <td>{subject.subjectcode}</td>
                  <td><span style={{ fontSize: '17px', fontWeight: 'bold' }}><span style={{textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {navigate(`/subject/${subject.subjectname}`);}}>{subject.subjectname}</span></span></td>
                  
                  {isAdmin && (
                  <td>
                    <img src={editicon} alt="edit icon" style={{ widths: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
                    onClick={() => {handleCancelClickSubject(subject);
                      setShowAddSubject(false);
                      setShowDeleteSubject(false)}}/>
                    
                    <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
                    onClick={() => {handleNoDeleteClickSubject(subject);
                      setShowUpdateSubject(false);
                      setShowAddSubject(false)}}/>
                      
                      </td>
                    )}
                  
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <h1>Instructor List</h1>
            {isAdmin && (
              <img src={add} alt="add icon" style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer', marginTop: '32px', marginLeft: '15px'}}
              onClick={() => {handleNoClickInstructor();
                setShowUpdateInstructor(false);
                setShowDeleteInstructor(false)
              }}/>
            )}
            </div>
            {showAddInstructor ? <AddInstructor setShowAddInstructor={setShowAddInstructor} handleNoClickInstructor={handleNoClickInstructor} /> : null}
            <table className="schedule-table" style={{width: 'auto'}}>
              <thead>
                <tr>
                  <th>Instructor Name</th>
                  {isAdmin &&(
                  <th>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor.instructorID}>
                    <td><span style={{ fontSize: '17px', fontWeight: 'bold' }}><span style={{textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {navigate(`/instructor/${instructor.instructorID}`);}}>{instructor.name}</span></span></td>
                    {isAdmin && (
                    
                    <td>
                      <img src={editicon} alt="edit icon" style={{ widths: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
                      onClick={() => {handleCancelClickInstructor(instructor);
                        setShowAddInstructor(false);
                        setShowDeleteInstructor(false)}}/>
                      
                      <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
                      onClick={() => {handleNoDeleteClickInstructor(instructor);
                        setShowUpdateInstructor(false);
                        setShowAddInstructor(false)}}/> 
                    </td>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showDeleteSubject ? <DeleteSubject setShowDeleteSubject={setShowDeleteSubject} handleNoDeleteClickSubject={handleNoDeleteClickSubject} /> : null}
        {showUpdateSubject ? <UpdateSubject setShowUpdateSubject={setShowUpdateSubject} handleCancelClickSubject={handleCancelClickSubject} /> : null}
        {showDeleteInstructor ? <DeleteInstructor setShowDeleteInstructor={setShowDeleteInstructor} handleNoDeleteClickInstructor={handleNoDeleteClickInstructor} /> : null}
        {showUpdateInstructor ? <UpdateInstructor setShowUpdateInstructor={setShowUpdateInstructor} handleCancelClickInstructor={handleCancelClickInstructor} /> : null}
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>Team Kokkak</p>
      </footer>
    </div>
  );
}

export default Home;