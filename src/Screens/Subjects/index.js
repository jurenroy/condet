import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png';
import editicon from '../../Assets/edit1.png';
import deleteicon from '../../Assets/delete.png';
import AddSubject from '../../Components/Popup/Subjects/Add';
import UpdateSubject from '../../Components/Popup/Subjects/Update';
import DeleteSubject from '../../Components/Popup/Subjects/Delete';
import { selectSubject } from '../../Components/Redux/Auth/AuthSlice';
import { useNavigate } from 'react-router-dom';

function Subjects() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCourse = useSelector((state) => state.auth.course);
  const selectedYear = useSelector((state) => state.auth.year);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showUpdateSubject, setShowUpdateSubject] = useState(false);
  const [showDeleteSubject, setShowDeleteSubject] = useState(false);

  const handleNoClickSubject = () => {
    setShowAddSubject((prevShow) => !prevShow);
  };

  const handleCancelClickSubject = (subject) => {
    setShowUpdateSubject((prevShow) => !prevShow);
    dispatch(selectSubject(subject.subjectID));
    console.log(subject.subjectID);
    console.log(selectedCourse);
    console.log(selectedYear);
  };

  const handleNoDeleteClickSubject = (subject) => {
    setShowDeleteSubject((prevShow) => !prevShow);
    dispatch(selectSubject(subject.subjectID));
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('https://classscheeduling.pythonanywhere.com/get_subject_json/')
      .then((response) => response.json())
      .then((data) => {
        // Filter subjects based on selected course and year
        const filteredSubjects = data.filter(
          (subject) =>
            subject.course === selectedCourse && subject.year === selectedYear
        );
        setFilteredSubjects(filteredSubjects);
      })
      .catch((error) => console.error('Error fetching subjects:', error));
  }, [selectedCourse, selectedYear]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ textAlign: 'center', margin: '0 10px' }}>Subjects</h2>
        {isAdmin && (
          <div style={{display:'flex',flexDirection:'column'}}>
          <label style={{cursor:'pointer',fontSize:'10px',position:'relative',fontWeight:'bold',top:'-1px',left:'-2px'}}>
            Add
          </label>
          <img
            src={add}
            alt="add icon"
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              border: '2px solid black',
              cursor: 'pointer',
            }}
            onClick={() => {
              handleNoClickSubject();
              setShowUpdateSubject(false);
              setShowDeleteSubject(false);
            }}
            title='Add Subjects'
          />
          </div>
        )}
        {showAddSubject ? (
          <AddSubject setShowAddSubject={setShowAddSubject} handleNoClickSubject={handleNoClickSubject} />
        ) : null}
      </div>
      <table className="schedule-table" style={{width: 'auto'}}>
        <thead>
          <tr>
            <th>Subject</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((subject) => (
            <tr key={subject.subjectcode}>
              <td>
                {subject.subjectcode} -{' '}
                <span
                  style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => {
                    navigate(`/subject/${subject.subjectname}`);
                  }}
                >
                  {subject.subjectname}
                </span>
              </td>
              {isAdmin && (
                <td>
                  <img
                    src={editicon}
                    alt="edit icon"
                    style={{ width: '0px', height: '0px', cursor: 'pointer', marginRight: '30%' }}
                    onClick={() => {
                      handleCancelClickSubject(subject);
                      setShowAddSubject(false);
                      setShowDeleteSubject(false);
                    }}
                  />
                  <div style={{top:'-10px',position:'relative',flex:'1',display:'flex',flexDirection:'column'}}>
                    <label style={{fontWeight:'bold',fontSize:'10px',left:'10px',position:'relative'}}>
                      Delete
                    </label>
                  <img
                    src={deleteicon}
                    alt="delete icon"
                    style={{ width: '17px', height: '17px', marginLeft: '15px',cursor: 'pointer' }}
                    onClick={() => {
                      handleNoDeleteClickSubject(subject);
                      setShowUpdateSubject(false);
                      setShowAddSubject(false);
                    }}
                    title='Delete Subjects'
                  />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showDeleteSubject ? <DeleteSubject setShowDeleteSubject={setShowDeleteSubject} handleNoDeleteClickSubject={handleNoDeleteClickSubject} /> : null}
      {showUpdateSubject ? <UpdateSubject setShowUpdateSubject={setShowUpdateSubject} handleCancelClickSubject={handleCancelClickSubject} /> : null}
    </div>
  );
}

export default Subjects;
