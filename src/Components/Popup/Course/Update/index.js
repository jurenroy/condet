// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const UpdateCourse = () => {
//   const { courseId } = useParams();
//   const [courseData, setCourseData] = useState([]);
//   const [coursename, setCoursename] = useState('');
//   const [abbreviation, setAbbreviation] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/get_course_json/')
//       .then(response => response.json())
//       .then(data => {
//         setCourseData(data);
//         const selectedCourse = data.find(course => course.courseID === parseInt(courseId));
//         if (selectedCourse) {
//           setCoursename(selectedCourse.coursename);
//           setAbbreviation(selectedCourse.abbreviation);
//         }
//       })
//       .catch(error => console.log(error));
//   }, [courseId]);

//   const handleFormSubmit = (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('coursename', coursename);
//     formData.append('abbreviation', abbreviation);

//     axios.post('http://127.0.0.1:8000/update_course/${courseId}/', formData)
//       .then((response) => {
//         console.log(response.data);
//         // Handle the response or perform any additional actions
//         navigate('/');
//       })
//       .catch((error) => {
//         console.error(error);
//         // Handle the error
//       });
//   };

//   return (
//     <div>
//       <h1>Update Course</h1>
//       <form onSubmit={handleFormSubmit} encType="multipart/form-data">
//         <label>Course Name:</label>
//         <input type="text" value={coursename} onChange={(e) => setCoursename(e.target.value)} />
//         <label>Abbreviation: </label>
//         <input type="text" value={abbreviation} onChange={(e) => setAbbreviation(e.target.value)} />
//         <button type="submit">Update Course</button>
//       </form>
//     </div>
//   );
// };

// export default UpdateCourse;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const UpdateCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  

  const [coursename, setCoursename] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.abbreviation === selectedCourseAbbreviation);
        if (foundCourse) {
          setCoursename(foundCourse.coursename);
          setAbbreviation(foundCourse.abbreviation);
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('coursename', coursename);
    formData.append('abbreviation', abbreviation);

    axios.post(`http://127.0.0.1:8000/update_course/${selectedCourseAbbreviation}/`, formData)
      .then((response) => {
        console.log(response.data);
        // Handle the response or perform any additional actions
      })
      .catch((error) => {
        console.error(error);
        // Handle the error
      });
  };

  return (
    <div style={{
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '300px',
      width: '400px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10%'
    }}>
      <h2 style={{ marginTop: '12px' }}>Update Course</h2>
      <h3 style={{ marginTop: '12px' }}>Course Name:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={coursename}
        onChange={(e) => setCoursename(e.target.value)}
      />

      <h3 style={{ marginTop: '12px' }}>Abbreviation:</h3>
      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={abbreviation}
        onChange={(e) => setAbbreviation(e.target.value)}
      />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }} onSubmit={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }} onClick={() => props.setShow2(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateCourse;
