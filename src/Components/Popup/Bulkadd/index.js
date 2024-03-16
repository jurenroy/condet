import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import exit from '../../../Assets/exit.png';
import './scroll.css'



const Bulkssss = (props) => {

    const selectedCollege = useSelector(state => state.auth.college);
    const selectedSemester = useSelector(state => state.auth.semester);

    // Array for courses
    const [course, setCourse] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showAddCourses, setShowAddCourses] = useState(false);
    const [showCourses, setShowCourses] = useState(false);

    const [courselist, setCourselist] = useState([]);
    // eslint-disable-next-line
    const [courselang, setCourselang] = useState([]);
    const [coursejud, setCoursejud] = useState([]);

    const [showAllExistingCourses, setShowAllExistingCourses] = useState(false);
    const [showAllAddedCourses, setShowAllAddedCourses] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const courselistResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_courselist_json/');
          const courselangResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/');
        
          const courselistData = courselistResponse.data.filter(courseItem => courseItem.college === parseInt(selectedCollege));
          const courselangData = courselangResponse.data.filter(courseItem => courseItem.college === parseInt(selectedCollege));
          setCoursejud(courselistData);
          setCourses(courselangData);
          // Extract course names from courselangData
          const courselangNames = courselangData.map(courseItem => courseItem.coursename);
        
          // Filter out courses from courselistData that are already in courselangNames
          const filteredCourses = courselistData.filter(courseItem => !courselangNames.includes(courseItem.coursename));
          setCourselist(filteredCourses);
          setCourselang(courselangNames);
        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [selectedCollege, setCourselist, setCourselang]);


    const submit = () => {
      // Function to retrieve the course ID based on course name from coursejud
      function getCourseID(courseName) {
          return axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/')
              .then(response => {
                  const courseID = response.data.filter(courseItem => courseItem.coursename === courseName)[0].courseID;
                  return courseID;
              })
              .catch(error => {
                  console.error('Error fetching course data:', error);
                  throw error; // Propagate the error further
              });
      }
  
      function addCourse(courseItem) {
        const formData = new FormData();
        formData.append('course', courseItem);
    
        const abbreviation = coursejud.find(course => course.coursename === courseItem)?.abbreviation;
        formData.append('coursename', courseItem);
        formData.append('abbreviation', abbreviation);
        formData.append('college', parseInt(selectedCollege));
    
        return axios.post('https://classscheeduling.pythonanywhere.com/add_course/', formData)
            .then(response => {
                console.log('Course added successfully:', response.data);
                // Optionally, return any relevant data from the response
                return response.data;
            })
            .catch(error => {
                console.error('Error adding course:', error);
                // Rethrow the error to propagate it further
                throw error;
            });
    }
    
  
      // Function to recursively add courses
      function addCoursesRecursively(courses) {
          if (courses.length === 0) {
              // All courses added, exit recursion
              return Promise.resolve();
          } else {
              const courseItem = courses.shift(); // Get and remove the first course
              return addCourse(courseItem)
                  .then(() => {
                      // Course added successfully, continue adding the rest
                      return addCoursesRecursively(courses);
                  })
                  .catch(error => {
                      // Handle error
                      console.error('Error adding course:', error);
                      // Continue adding the rest of the courses even if one fails
                      return addCoursesRecursively(courses);
                  });
          }
      }
  
      // Function to add a single lecture room
      function addLectureRoom(roomname) {
        console.log(toBeAddedLectureRooms)
        console.log(roomname)
          const building = roomz.find(room => room.name === roomname)?.building;
          if (!building) {
              return Promise.reject('Building not found for the given room');
          }
  
          const buildingID = buildingz.find(buildingItem => buildingItem.buildinglistID === building)?.name;
          if (!buildingID) {
              return Promise.reject('Building ID not found in buildingz');
          }
  
          const formData = new FormData();
          formData.append('roomname', roomname);
          formData.append('building_number', buildingID);
          formData.append('roomtype', 'Lecture');
  
          return axios.post(`https://classscheeduling.pythonanywhere.com/add_room/${parseInt(selectedCollege)}/`, formData);
      }
  
      // Function to add a single lab room
      function addLabRoom(roomname) {
          const building = roomz.find(room => room.name === roomname)?.building;
          if (!building) {
              return Promise.reject('Building not found for the given room');
          }
  
          const buildingID = buildingz.find(buildingItem => buildingItem.buildinglistID === building)?.name;
          if (!buildingID) {
              return Promise.reject('Building ID not found in buildingz');
          }
  
          const formData = new FormData();
          formData.append('roomname', roomname);
          formData.append('building_number', buildingID);
          formData.append('roomtype', 'Laboratory');
  
          return axios.post(`https://classscheeduling.pythonanywhere.com/add_room/${parseInt(selectedCollege)}/`, formData);
      }
  
      // Function to recursively add rooms
      function addRoomsRecursively(roomList, addRoomFunction) {
          if (roomList.length === 0) {
              // All rooms added, exit recursion
              return Promise.resolve();
          } else {
              const room = roomList.shift(); // Get and remove the first room
              return addRoomFunction(room)
                  .then(() => {
                      // Room added successfully, continue adding the rest
                      return addRoomsRecursively(roomList, addRoomFunction);
                  })
                  .catch(error => {
                      // Handle error
                      console.error('Error adding room:', error);
                      // Continue adding the rest of the rooms even if one fails
                      return addRoomsRecursively(roomList, addRoomFunction);
                  });
          }
      }
  
      // Function to process subjects one by one
async function processSubjectsOneByOne(subjectsArray) {
  for (const subjectID of subjectsArray) {
      try {
          // Find the subject in the subjects array
          const foundSubject = subjectlist.find(subject => subject.subjectlistID === subjectID);
          if (!foundSubject) {
              console.error(`Subject not found for subjectlistID ${subjectID}`);
              continue; // Skip to the next subject
          }

          // Find the corresponding course in coursejud
          const foundCourse = coursejud.find(course => course.courselistID === foundSubject.course);
          if (!foundCourse) {
              console.error(`Course not found in coursejud for subjectlistID ${subjectID}`);
              continue; // Skip to the next subject
          }

          // Get the course ID from the API
          const courseID = await getCourseID(foundCourse.coursename);

          // Construct the processed subject object
          const processedSubject = {
              year: foundSubject.year,
              subjectcode: foundSubject.subjectcode,
              subjectname: foundSubject.subjectname,
          };

          // Make axios post call to add subject
          const response = await axios.post(`https://classscheeduling.pythonanywhere.com/add_subject/${courseID}/`, processedSubject);
          console.log('Subject added successfully:', response.data);
      } catch (error) {
          console.error('Error processing subject:', error);
      }
  }
}

  
      // Call the function to start adding courses
      addCoursesRecursively(course)
          .then(() => {
              console.log('All courses added successfully');
              // Perform any actions after all courses have been added
  
              // Call the function to start adding lecture rooms
              return addRoomsRecursively(toBeAddedLectureRooms, addLectureRoom);
          })
          .then(() => {
              console.log('All lecture rooms added successfully');
              // Perform any actions after all lecture rooms have been added
  
              // Call the function to start adding lab rooms
              return addRoomsRecursively(toBeAddedLabRooms, addLabRoom);
          })
          .then(() => {
              console.log('All lab rooms added successfully');
              // Perform any actions after all lab rooms have been added
  
              // Process the subjects
              const processedSubjects = processSubjectsOneByOne(subjects);
              console.log('All subjects processed:', processedSubjects);
          })
          .catch(error => {
              console.error('Error:', error);
          });
  };


    const handleToggleAddCourses = () => {
        setShowAddCourses(!showAddCourses);
      };

      const handleToggleShowCourses = () => {
        setShowCourses(!showCourses);
        setShowAddCourses(false);
      };

      const handleCheckboxChange = (selectedCourse) => {
        // Check if the course is already in the array
        if (course.includes(selectedCourse)) {
          // If it is, remove it
          setCourse(course.filter(item => item !== selectedCourse));
        } else {
          // If it's not, add it
          setCourse([...course, selectedCourse]);
        }
      };

      // Array for rooms
    const [showAddRooms, setShowAddRooms] = useState(false);
    const [showRooms, setShowRooms] = useState(false);

    const [toBeAddedLabRooms, setToBeAddedLabRooms] = useState([]);
    const [toBeAddedLectureRooms, setToBeAddedLectureRooms] = useState([]);

    const [showAllExistingRooms, setShowAllExistingRooms] = useState(false);
  const [showAllAddedRooms, setShowAllAddedRooms] = useState(false);

    const [buildingz, setBuildingz] = useState([]);
    const [roomz, setRoomz] = useState([]);

    const [roomlang, setRoomlang] = useState([]);

    useEffect(() => {
        // Fetch building data
        axios.get('https://classscheeduling.pythonanywhere.com/get_buildinglist_json/')
          .then((response) => {
            setBuildingz(response.data); // Assuming the API returns an array of buildings
          })
          .catch((error) => {
            console.error('Error fetching buildings:', error);
          });
    
        // Fetch room data
        axios.get('https://classscheeduling.pythonanywhere.com/get_roomlist_json/')
          .then((response) => {
            setRoomz(response.data); // Assuming the API returns an array of rooms
          })
          .catch((error) => {
            console.error('Error fetching rooms:', error);
          });
      }, []); // Run only once when the component mounts

      const [expandedBuildings, setExpandedBuildings] = useState([]);

      const toggleBuilding = (buildingId) => {
        setExpandedBuildings((prevExpanded) => {
          if (prevExpanded.includes(buildingId)) {
            // If the building is already expanded, close it
            return prevExpanded.filter((id) => id !== buildingId);
          } else {
            // If the building is not expanded, close all other buildings and open this one
            return [buildingId];
          }
        });
      };
      

    

  const handleToggleAddRooms = () => {
    setShowAddRooms(!showAddRooms);
    setExpandedBuildings([])
  };

  const handleToggleShowRooms = () => {
    setShowRooms(!showRooms);
    setShowAddRooms(false);
  };

    // Inside your component function
const [defaultRoomType, setDefaultRoomType] = useState('Lecture');

  // Function to handle adding or removing a room
const handleAddRoom = (roomName) => {
  // If the room is already added to lecture rooms, remove it
  if (toBeAddedLectureRooms.includes(roomName) && defaultRoomType === 'Lecture') {
    setToBeAddedLectureRooms(prevRooms => prevRooms.filter(room => room !== roomName));
  }
  // If the room is already added to lab rooms, remove it
  else if (toBeAddedLabRooms.includes(roomName) && defaultRoomType === 'Laboratory') {
    setToBeAddedLabRooms(prevRooms => prevRooms.filter(room => room !== roomName));
  }// If the room is already added to lecture rooms and the default room type is Laboratory, remove it from lecture rooms and add it to lab rooms
  else if (toBeAddedLectureRooms.includes(roomName) && defaultRoomType === 'Laboratory') {
    setToBeAddedLectureRooms(prevRooms => prevRooms.filter(room => room !== roomName));
    setToBeAddedLabRooms(prevRooms => [...prevRooms, roomName]);
  }
  // If the room is already added to lab rooms and the default room type is Lecture, remove it from lab rooms and add it to lecture rooms
  else if (toBeAddedLabRooms.includes(roomName) && defaultRoomType === 'Lecture') {
    setToBeAddedLabRooms(prevRooms => prevRooms.filter(room => room !== roomName));
    setToBeAddedLectureRooms(prevRooms => [...prevRooms, roomName]);
  }
  // If the room is not added, add it to the appropriate array
  else {
    if (defaultRoomType === 'Lecture') {
      setToBeAddedLectureRooms(prevRooms => [...prevRooms, roomName]);
    } else {
      setToBeAddedLabRooms(prevRooms => [...prevRooms, roomName]);
    }
  }
};



// Button to toggle between "Lecture" and "Laboratory"
const toggleRoomType = () => {
  setDefaultRoomType((prevType) =>
    prevType === 'Lecture' ? 'Laboratory' : 'Lecture'
  );
};
  

  useEffect(() => {
    // Fetch room data from the excluded API
    axios.get('https://classscheeduling.pythonanywhere.com/get_room_json/')
      .then((response) => {
        // Filter the data based on the selected college
        const filteredRooms = response.data.filter(room => room.college === parseInt(selectedCollege));
        
        // Set the filtered rooms in the state
        setRoomlang(filteredRooms);
      })
      .catch((error) => {
        console.error('Error fetching excluded rooms:', error);
      });
}, [selectedCollege]); // Run whenever selectedCollege changes
    // Sort the roomlang array by building_number and then by roomname
    const sortedRoomlang = roomlang.slice().sort((a, b) => {
        // Compare building_number
        const buildingComparison = parseInt(a.building_number, 10) - parseInt(b.building_number, 10);

        // If building numbers are different, use that for sorting
        if (buildingComparison !== 0) {
          return buildingComparison;
        }
    
        // If building numbers are the same, compare by roomname
        return a.roomname.localeCompare(b.roomname);
      });

// Array for courses
const [subjects, setSubjects] = useState([]);
const [subjectjud, setSubjectjud] = useState([]);
const [showAddSubjects, setShowAddSubjects] = useState(false);
const [showSubjects, setShowSubjects] = useState(false);
const [courseInt, setCourseInt] = useState([]);
const [courseIntList, setCourseIntList] = useState([]);
const combinedCourses = [...courseInt, ...courseIntList];
const [subjectlist, setSubjectlist] = useState([]);
// eslint-disable-next-line
const [subjectlang, setSubjectlang] = useState([]);
const year = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

const [selectedYear, setSelectedYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  console.log(subjects)
  console.log(subjectjud)
  console.log(subjectlist)
  console.log(subjectlang)


// Function to handle selecting a course
const handleCourseSelect = (courseIdInt) => {
  if (selectedCourse === courseIdInt) {
    // If the course is already selected, deselect it
    setSelectedCourse(null);
  } else {
    // Otherwise, select the course
    setSelectedCourse(courseIdInt);
  }
};

// Function to handle selecting a year
const handleYearSelect = (selectedyear) => {
  if (selectedyear === null) {
    // If no year is selected, set the new year as selected
    setSelectedYear(selectedyear); // Replace selectedYearValue with the desired value
  } else if (selectedyear !== selectedYear) {
    // If the selected year is different from the currently selected year, replace it with the new year
    setSelectedYear(selectedyear); // Replace selectedYearValue with the desired value
  } else {
    // If the selected year is the same as the currently selected year, deselect it
    setSelectedYear(null);
  }
};

    useEffect(() => {
        fetch('https://classscheeduling.pythonanywhere.com/get_courselist_json/')
            .then(response => response.json())
            .then(data => {
                // Extracting course names from the fetched data
            const courseNames = data.map(item => item.coursename);
            
            // Filtering out the course names that are in courselang
            const filteredCourseNames = courseNames.filter(courseName => course.includes(courseName));
            
            // Filtering the data array to get only the items whose coursenames are included in courselang
            const filteredCourses = data.filter(item => course.includes(item.coursename));
            
            // Extracting the courselistIDs from the filtered courses
            const filteredCourseIDs = filteredCourses.map(course => course.courselistID);
            
            console.log('Filtered Course Names:', filteredCourseNames);
            console.log('Filtered Course IDs:', filteredCourseIDs);
            
            // Setting the filtered course IDs to courseInt state
            setCourseInt(filteredCourseIDs);
            })
            .catch(error => console.error('Error fetching subject list:', error));
    }, [course]);

    useEffect(() => {
      fetch('https://classscheeduling.pythonanywhere.com/get_courselist_json/')
          .then(response => response.json())
          .then(data => {
              // Extracting course names from the fetched data
          const courseNames = data.map(item => item.coursename);
          
          // Filtering out the course names that are in courselang
          const filteredCourseNames = courseNames.filter(courseName => courselang.includes(courseName));
          
          // Filtering the data array to get only the items whose coursenames are included in courselang
          const filteredCourses = data.filter(item => courselang.includes(item.coursename));
          
          // Extracting the courselistIDs from the filtered courses
          const filteredCourseIDs = filteredCourses.map(course => course.courselistID);
          
          console.log('Filtered Course Names:', filteredCourseNames);
          console.log('Filtered Course IDssadasd:', filteredCourses);
          console.log('Filtered Course IDs:', filteredCourseIDs);
          
          // Setting the filtered course IDs to courseInt state
          setCourseIntList(filteredCourseIDs);
          })
          .catch(error => console.error('Error fetching subject list:', error));
  }, [courselang]);


  useEffect(() => {
    const fetchSubjectlist = async () => {
      try {
        const response = await axios.get('https://classscheeduling.pythonanywhere.com/get_subjectlist_json/', {
          params: {
            semester: selectedSemester,
            year: selectedYear,
            course: selectedCourse
          }
        });
        setSubjectjud(response.data);
      } catch (error) {
        console.error('Error fetching subject list:', error);
      }
    };

    const fetchSubject = async () => {
      try {
        const response = await axios.get('https://classscheeduling.pythonanywhere.com/get_subject_json/', {
          params: {
            year: selectedYear,
            course: selectedCourse
          }
        });
        setSubjectlang(response.data);
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    };
    

    fetchSubjectlist();
    fetchSubject();
  }, [selectedSemester, selectedYear, selectedCourse]);

  useEffect(() => {
    const filteredSubjects = subjectjud.filter(subject => !subjectlang.includes(subject));
    setSubjectlist(filteredSubjects);
  }, [subjectjud, subjectlang]);



const handleToggleAddSubjects = () => {
    setShowAddSubjects(!showAddSubjects);
    setSelectedCourse('')
    setSelectedYear('')
  };

  const handleToggleShowSubjects = () => {
    setShowSubjects(!showSubjects);
    setShowAddSubjects(false);
  };

// Function to handle adding or removing a subject
const handleCheckboxChangeSubject = (selectedSubject) => {
  // Check if the subject is already added by comparing IDs
  const isAlreadyAdded = subjects.some(subject => subject === selectedSubject);

  if (isAlreadyAdded) {
      // If subject is already added, remove it
      setSubjects(prevSubjects => prevSubjects.filter(subject => subject !== selectedSubject));
  } else {
      // If subject is not added, add it
      setSubjects(prevSubjects => [...prevSubjects, selectedSubject]);
  }
};

  
  console.log(subjectlist)

  // Add state variables for showing all subjects or limited subjects
  const [showExistingSubjects, setShowExistingSubjects] = useState(false);

  // Function to toggle showing all subjects or limited subjects
  const toggleShowExistingSubjects = () => {
      setShowExistingSubjects(!showExistingSubjects);
  };

  // Add state variables for showing all subjects or limited subjects
  const [showToBeAddedSubjects, setShowToBeAddedSubjects] = useState(false);

  // Function to toggle showing all subjects or limited subjects
  const toggleShowToBeAddedSubjects = () => {
      setShowToBeAddedSubjects(!showToBeAddedSubjects);
  };



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


    

  return (
    <div>
        <div
        style={{
            backgroundColor: 'white',
            position: 'absolute',
            left: position.x + 'px',
            top: position.y + 'px',
            height: '400px',
            width: '700px',
            padding: '20px',
            // display: 'flex',    
            justifyContent: 'center',
            flexDirection: 'column',
            // overflowY: 'auto',
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
                width: '700px', 
                position: 'absolute',
                left:'0',
                top: '0%', 
                borderTopRightRadius:'8px',
                borderTopLeftRadius:'8px',
                padding: '20px',
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-evenly'
            }}>
                <h2 style={{marginTop:'-2px',color:'white'}}>Bulk Add </h2>
                <img 
                    src={exit} 
                    alt="add icon" 
                    style={{width: '25px', height: '25px', marginLeft: '560px', borderRadius: '50%', border: '2px solid white',backgroundColor:'transparent' , cursor: 'pointer' }}
                    onClick={() => props.setShowBulkAdd(false)}
                  title='Exit Bulk'
                  />
            </div>
            
            <div style={{
            backgroundColor: '#FAB417', 
            height: '7px',
            width: '735.8px', 
            position: 'absolute',
            left:'0.2%',
            top: '98.54%', 
            borderBottomRightRadius:'8px',
            borderBottomLeftRadius:'8px',
            }}/>

            <div  style={{ overflowY: 'scroll', maxHeight: '412.4px', display:'flex', flexDirection:'column'}}>
                {!coursejud.length > 0 && (
                  
                  <h1 style={{marginTop:'40px', marginBottom:'-40px',color:'red',textAlign:'center',justifyContent:'center'}}>Please wait loading....</h1>
                  
                )}
                
                <div > 
                {coursejud.length > 0 && (
                    <div style={{marginTop:'40px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <h2>Courses:</h2>
                        {showCourses && (
                        <button style={{height: '30px', marginLeft: '20px'}} onClick={handleToggleAddCourses}>
                            {showAddCourses ? 'Done Adding' : 'Add Courses'}
                        </button>
                        )}
                        <button style={{height: '30px', marginLeft: '20px' }} onClick={handleToggleShowCourses}>
                            {showCourses ? 'Done Managing' : 'Manage Courses'}
                        </button>
                    </div>
                )}
                    {showAddCourses && showCourses && (
                    <div>
                        <table className='schedule-table'>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courselist.map((courseItem, index) => (
                                    <tr key={index}>
                                        <td>{courseItem.coursename}</td>
                                        <td style={{textAlign: 'center', alignSelf: 'center'}}>
                                            <button onClick={() => handleCheckboxChange(courseItem.coursename)}>
                                                {course.includes(courseItem.coursename) ? "Remove" : "Add"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    )}
        
                    <div>
                        {showCourses && courselang.length > 0 && (
                            <div>
                                <h3>
                                    Existing Courses{' '}
                                    {showCourses && courselang.length > 0 && (
                                        <button onClick={() => setShowAllExistingCourses(!showAllExistingCourses)}>
                                            {showAllExistingCourses ? 'Less' : 'More'}
                                        </button>
                                    )}
                                </h3>
                                <ul>
                                    {courselang.slice(0,showCourses && showAllExistingCourses ? courselang.length : 0).map((course, index) => (
                                        <li key={index}>{course}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {showCourses && course.length > 0 && (
                            <div>
                                <h3>
                                    To be Added Courses{' '}
                                    {showCourses && course.length > 0 && (
                                        <button onClick={() => setShowAllAddedCourses(!showAllAddedCourses)}>
                                            {showAllAddedCourses ? 'Less' : 'More'}
                                        </button>
                                    )}
                                </h3>
                                <ul>
                                    {course.slice(0,showCourses && showAllAddedCourses ? course.length : 0).map((course, index) => (
                                        <li key={index}>{course}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                {coursejud.length > 0 && (
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <h2>Rooms:</h2>
                        {showRooms && (
                            <button style={{ height: '30px', marginLeft: '20px' }} onClick={handleToggleAddRooms}>
                                {showAddRooms ? 'Done Adding Rooms' : 'Add Rooms'}
                            </button>
                        )}
                        <button style={{ height: '30px', marginLeft: '20px' }} onClick={handleToggleShowRooms}>
                            {showRooms ? 'Done Managing' : 'Manage Rooms'}
                        </button>
                    </div>
                )}
                    {showAddRooms && (
                        <div>
            
                            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '20px' }}>
                                {/* Buildings */}
                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {buildingz.map((building) => (
                                        <div key={building.buildinglistID} style={{ marginRight: '20px', marginBottom: '10px' }}>
                                            <div style={{
                                                border: '2px solid black',
                                                backgroundColor: expandedBuildings.includes(building.buildinglistID) ? 'gold' : 'white',
                                                color: expandedBuildings.includes(building.buildinglistID) ? 'black' : 'black',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                borderRadius: '10px',
                                                marginBottom: '5px', 
                                                flexWrap: 'wrap'
                                            }}
                                                onClick={() => toggleBuilding(building.buildinglistID)}
                                            >
                                                {building.name}
                                                {expandedBuildings.includes(building.buildinglistID) ? '[-]' : '[+]'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
    

                                {/* Rooms */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
        
                                    {buildingz.map((building) => (
                                        <div key={building.buildinglistID}>
                                            {expandedBuildings.includes(building.buildinglistID) && (
                                                <table className='schedule-table'>
                                                    <thead>
                                                        <tr>
                                                            <th>Room</th>
                                                            <th>Action</th>
                                                            <th>
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <p style={{marginRight: '10px'}}>Status</p>
                                                                    {expandedBuildings.length > 0 && (
                                                                    <button onClick={toggleRoomType}>
                                                                        {defaultRoomType === 'Lecture' ? 'Lecture' : (defaultRoomType === 'Laboratory' ? 'Laboratory' : '')}
                                                                    </button>
                                                                    )}
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {roomz
                                                        .filter((room) => room.building === building.buildinglistID)
                                                        .filter((room) => !roomlang.some((langRoom) => langRoom.roomname === room.name)) // Exclude rooms present in roomlang
                                                        .map((room) => (
                                                            <tr key={room.roomID}>
                                                                <td>{room.name}</td>
                                                                <td>
                                                                    <button onClick={() => handleAddRoom(room.name)}>
                                                                        {toBeAddedLectureRooms.includes(room.name) && defaultRoomType === 'Lecture'
                                                                        ? 'Remove Lecture'
                                                                        : toBeAddedLectureRooms.includes(room.name) && defaultRoomType === 'Laboratory'
                                                                        ? 'Change into Laboratory'
                                                                        : toBeAddedLabRooms.includes(room.name) && defaultRoomType === 'Laboratory'
                                                                        ? 'Remove Laboratory'
                                                                        : toBeAddedLabRooms.includes(room.name) && defaultRoomType === 'Lecture'
                                                                        ? 'Change into Lecture'
                                                                        : 'Add ' + defaultRoomType}
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    {toBeAddedLectureRooms.includes(room.name)
                                                                    ? 'Added to Lecture'
                                                                    : toBeAddedLabRooms.includes(room.name)
                                                                    ? 'Added to Laboratory'
                                                                    : 'None'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {showRooms && (
                        <div>
                            <h3>
                            Existing Rooms{' '}
                            {sortedRoomlang.length > 0 && (
                                <button onClick={() => setShowAllExistingRooms(!showAllExistingRooms)}>
                                {showAllExistingRooms ? 'Less' : 'More'}
                                </button>
                            )}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                {showRooms && sortedRoomlang.length > 0 && (
                                    <div>
                                        {showAllExistingRooms &&(
                                            <h4>Lecture Rooms</h4>
                                        )}
                                        <ul>
                                            {sortedRoomlang
                                            .filter(room => room.roomtype === 'Lecture')
                                            .slice(0, showAllExistingRooms ? sortedRoomlang.filter(room => room.roomtype === 'Lecture').length : 0)
                                            .map((room, index) => (
                                                <li key={index}>{room.roomname} - ({room.roomtype})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {showRooms && sortedRoomlang.length > 0 && (
                                    <div style={{ marginLeft: '5%' }}>
                                    {showAllExistingRooms &&(
                                        <h4>Laboratory Rooms</h4>
                                    )}
                                    <ul>
                                        {sortedRoomlang
                                        .filter(room => room.roomtype === 'Laboratory')
                                        .slice(0, showAllExistingRooms ? sortedRoomlang.filter(room => room.roomtype === 'Laboratory').length : 0)
                                        .map((room, index) => (
                                            <li key={index}>{room.roomname} - ({room.roomtype})</li>
                                        ))}
                                    </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {showRooms && (toBeAddedLectureRooms.length > 0 || toBeAddedLabRooms.length > 0) && (
                        <div>
                            <h3>
                            To be Added Rooms{' '}
                            {(toBeAddedLectureRooms.length + toBeAddedLabRooms.length) > 0 && (
                                <button onClick={() => setShowAllAddedRooms(!showAllAddedRooms)}>
                                {showAllAddedRooms ? 'Less' : 'More'}
                                </button>
                            )}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div>
                                    {showAllAddedRooms && (
                                        <h4>Lecture Rooms</h4>
                                    )}
                                    <ul>
                                    {toBeAddedLectureRooms.slice(0, showAllAddedRooms ? toBeAddedLectureRooms.length : 0).map((room, index) => (
                                        <li key={index}>{room}</li>
                                    ))}
                                    </ul>
                                </div>
                                <div style={{ marginLeft: '5%' }}>
                                {showAllAddedRooms && (
                                    <h4>Laboratory Rooms</h4>
                                )}
                                    <ul>
                                    {toBeAddedLabRooms.slice(0, showAllAddedRooms ? toBeAddedLabRooms.length : 0).map((room, index) => (
                                        <li key={index}>{room}</li>
                                    ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                {coursejud.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <h2>Subjects:</h2>
                        {showSubjects && (
                            <button style={{ height: '30px', marginLeft: '20px' }} onClick={handleToggleAddSubjects}>
                            {showAddSubjects ? 'Done Adding' : 'Add Subjects'}
                            </button>
                        )}
                        <button style={{ height: '30px', marginLeft: '20px' }} onClick={handleToggleShowSubjects}>
                        {showSubjects ? 'Done Managing' : 'Manage Subjects'}
                        </button>
                    </div>
                )}

                    {showAddSubjects && showSubjects && (
                    <div>
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                {combinedCourses.map((courseID, index) => {
                                    // Parse courseID to integer for comparison
                                    const courseIdInt = parseInt(courseID);
                                    // Find the course object in courselist
                                    let foundCourse = coursejud.find(course => course.courselistID === courseIdInt);

                                    return (
                                        <div 
                                            key={index} 
                                            style={{ 
                                            background: selectedCourse === courseIdInt ? 'yellow' : 'white',
                                            color: selectedCourse === courseIdInt ? 'black' : 'black',
                                            border: '2px solid black', // This sets the border color to black with a width of 1px
                                            cursor: 'pointer,', // Change cursor to pointer to indicate clickable
                                            marginRight: '20px',
                                            padding: '10px',
                                            borderRadius: '10px',
                                            fontWeight: 'bold',
                                            }}
                                            onClick={() => handleCourseSelect(courseIdInt)}
                                        >
                                            {foundCourse ? foundCourse.abbreviation : ''}
                                        </div>
                                    );
                                })}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
                                {/* Rendering years */}
                                {year.map((yearItem, index) => (
                                    <div 
                                        key={index} 
                                        style={{ 
                                        background: selectedYear === yearItem ? 'yellow' : 'white',
                                        color: selectedYear === yearItem ? 'black' : 'black',
                                        border: '1px solid black', // This sets the border color to black with a width of 1px
                                        cursor: 'pointer,', // Change cursor to pointer to indicate clickable
                                        marginRight: '20px',
                                        padding: '5px',
                                        borderRadius: '10px'
                                        }}
                                        onClick={() => handleYearSelect(yearItem)}
                                    >
                                        {yearItem}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Display subject list */}
                        <table className='schedule-table'>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjectlist
                                .filter(subjectItem => subjectItem.year === selectedYear && subjectItem.course === selectedCourse && subjectItem.semester === selectedSemester)
                                .filter(subjectItem => !subjectlang.some(langSubject => langSubject.subjectname === subjectItem.subjectname))
                                .map((subjectItem, index) => (
                                    <tr key={index}>
                                        <td>{subjectItem.subjectname}</td>
                                        <td>
                                            {/* Button to add or remove subject */}
                                            <button onClick={() => handleCheckboxChangeSubject(subjectItem.subjectlistID)}>
                                                {subjects.includes(subjectItem.subjectlistID) ? 'Remove' : 'Add'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                    )}
      
                    {showSubjects && subjectlang.length > 0 && (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <h3>Existing Subjects</h3>
                            <button style={{height: '28px', marginTop: '18px', marginLeft: '5px'}}
                                onClick={toggleShowExistingSubjects}>
                                    {showExistingSubjects ? 'Less' : 'More'}
                            </button>
                        </div>
                    )}
                    {showSubjects && showExistingSubjects && (
                        <ul>
                            {courses.map(coursezz => {
                            // Find the corresponding courseID from courselang
                            const courseID = coursezz.courseID
                            console.log(courseID)
                            console.log(courses) //all courses of the college nga existing lang
                            console.log(course) //to be added
                            console.log(courselist) //not added yet
                            console.log(coursejud) //all courselists of the college
                            console.log(courselang) //coursename lang sa existing
                            console.log(combinedCourses) //courselistID sa existing and to be added
                            
                            // Filter subjectlang based on courseID
                            return subjectlang
                                .filter(subject => subject.course === courseID)
                                .map((subject, index) => (
                                <li key={index}>{subject.subjectname}</li>
                                ));
                            })}
                        </ul>
                    )}

                    {showSubjects && subjects.length > 0 && (
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <h3>To be Added Subjects</h3>
                            <button style={{height: '28px', marginTop: '18px', marginLeft: '5px'}}
                                onClick={toggleShowToBeAddedSubjects}>
                                {showToBeAddedSubjects ? 'Less' : 'More'}
                            </button>
                         </div>
                    )}
                    {showSubjects && showToBeAddedSubjects && (
                        <ul>
                            {subjectlist
                                .filter(subject => subjects.some(item => item === subject.subjectlistID))
                                .map((subject, index) => (
                                    <li key={index}>{subject.subjectname}</li>
                                ))}
                        </ul>
                        )} 
                </div>
              
                
                <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'40px'}}>

                    <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} 
                    disabled={coursejud.length === 0 ? true : false}
                    onClick={() => { props.setShowBulkAdd(false); submit(); }}>Submit</button>    

                    <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowBulkAdd(false)}>Cancel</button>
                </div>
                

            </div>
        </div>
    </div>
      
  )
}

export default Bulkssss