import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DeleteCourse = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_course_json/')
      .then(response => {
        const courses = response.data;
        const foundCourse = courses.find(course => course.abbreviation === selectedCourseAbbreviation);
        setSelectedCourse(foundCourse);
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation]);

  return (
    <div style={{
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '130px',
      width: '300px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10%'
    }}>

      <h2>DeleteCourse</h2>
      {selectedCourse ? (
        <div>
          <h3>Are you sure you want to delete {selectedCourse.coursename} ({selectedCourse.abbreviation}) ?</h3>
        </div>
      ) : (
        <div>
          <h3>Loading course data...</h3>
        </div>
      )}
    
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }} onClick={() => props.setShow3(false)}>No</button>
      </div>
    
    </div>
  );
};

export default DeleteCourse;



// import React from 'react';
// import axios from 'axios';

// const DeleteCourse = ({ courseId, onDelete }) => {
//   const handleDelete = () => {
//     axios
//       .delete('http://127.0.0.1:8000/delete_course/${courseId}')
//       .then(response => {
//         console.log(response.data);
//         onDelete();
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   };

//   return (
//     <div>
//       <h1>Delete Course</h1>
//       <p>Are you sure you want to delete this course?</p>
//       <button onClick={handleDelete}>Delete</button>
//     </div>
//   );
// };

// export default DeleteCourse;