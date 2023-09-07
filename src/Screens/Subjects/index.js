import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png';
import editicon from '../../Assets/edit1.png';
import deleteicon from '../../Assets/delete.png';
import AddSubject from '../../Components/Popup/Subjects/Add';
import UpdateSubject from '../../Components/Popup/Subjects/Update';
import DeleteSubject from '../../Components/Popup/Subjects/Delete';
import { selectSubject} from '../../Components/Redux/Auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

function Subjects() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const [showAddSubject , setShowAddSubject] = useState(false)
  const [showUpdateSubject , setShowUpdateSubject] = useState(false)
  const [showDeleteSubject , setShowDeleteSubject] = useState(false)

  const handleNoClickSubject = () => {
    setShowAddSubject(prevShow => !prevShow);
  };

  const handleCancelClickSubject = (subject) => {
    setShowUpdateSubject(prevShow => !prevShow);
    dispatch(selectSubject(subject.subjectID)); 
  }

  const handleNoDeleteClickSubject = (subject) => {
    setShowDeleteSubject(prevShow => !prevShow);
    dispatch(selectSubject(subject.subjectID));  
  }  
  

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
        <h2 style={{ textAlign: 'center', margin: '0 10px' }}>Subjects</h2>
        {isAdmin && (
        <img src={add} alt="add icon" style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer' }}
        onClick={() => {handleNoClickSubject();
          setShowUpdateSubject(false);
          setShowDeleteSubject(false)
        }}/>
        )}
        {showAddSubject ? <AddSubject setShowAddSubject={setShowAddSubject} handleNoClickSubject={handleNoClickSubject} /> : null}
      </div>
      {filteredSubjects.map((subject) => (
        <div key={subject.subjectcode}>
          
          <span style={{ fontSize: '17px', fontWeight: 'bold' }}>{subject.subjectcode} - <span style={{textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic', fontWeight: 'bold'}} onClick={() => {navigate(`/subject/${subject.subjectname}`);}}>{subject.subjectname}</span></span>
          {isAdmin && (
          <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
          onClick={() => {handleCancelClickSubject(subject);
            setShowAddSubject(false);
            setShowDeleteSubject(false)}}/>
          )}
          {isAdmin && (
          <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer' }} 
          onClick={() => {handleNoDeleteClickSubject(subject);
            setShowUpdateSubject(false);
            setShowAddSubject(false)}}/> 
          )}
        </div>
      ))}
      {showDeleteSubject ? <DeleteSubject setShowDeleteSubject={setShowDeleteSubject} handleNoDeleteClickSubject={handleNoDeleteClickSubject} /> : null}
      {showUpdateSubject ? <UpdateSubject setShowUpdateSubject={setShowUpdateSubject} handleCancelClickSubject={handleCancelClickSubject} /> : null}
    </div>
  );
}

export default Subjects;
