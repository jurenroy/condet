import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import add from '../../Assets/addicon2.png';
import editicon from '../../Assets/edit1.png';
import deleteicon from '../../Assets/delete.png';
import deleteicon2 from '../../Assets/delete2.png';

function Subjects() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);

  const handleSubjectCheckboxChange = (event) => {
    setIsSubjectSelected(event.target.checked);
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('http://127.0.0.1:8000/get_subject_json/')
      .then(response => response.json())
      .then(data => {
        // Filter subjects based on selected course and year
        const filteredSubjects = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
        setFilteredSubjects(filteredSubjects);
      })
      .catch(error => console.error('Error fetching subjects:', error));
  }, [selectedCourse, selectedYear]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
        <input
          type="checkbox"
          checked={isSubjectSelected}
          onChange={handleSubjectCheckboxChange}
        />
        <h2 style={{ textAlign: 'center', margin: '0 10px' }}>Subjects</h2>
        <img src={add} alt="add icon" style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer' }} />
        {isSubjectSelected ?
          <img src={deleteicon} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'pointer' }} />
          :
          <img src={deleteicon2} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'not-allowed' }} />
        }
      </div>
      {filteredSubjects.map((subject) => (
        <div key={subject.subjectcode}>
          <input type='checkbox'></input>
          <span style={{ fontSize: '17px', fontWeight: 'bold' }}>{subject.subjectcode} - {subject.subjectname}</span>
          <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} />
          <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} />
        </div>
      ))}
    </div>
  );
}

export default Subjects;
