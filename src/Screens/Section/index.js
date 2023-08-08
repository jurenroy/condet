import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import add from '../../Assets/addicon2.png';
import editicon from '../../Assets/edit1.png';
import deleteicon from '../../Assets/delete.png';
import deleteicon2 from '../../Assets/delete2.png';

function Sections() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const [filteredSections, setFilteredSections] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch('http://127.0.0.1:8000/get_section_json/')
      .then(response => response.json())
      .then(data => {
        // Filter subjects based on selected course and year
        const filteredSections = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
        setFilteredSections(filteredSections);
      })
      .catch(error => console.error('Error fetching sections:', error));
  }, [selectedCourse, selectedYear]);

  const courseAbbreviation = selectedCourse.substring(2); // Removing the first 2 characters
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
    fetch(`http://127.0.0.1:8000/add_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        // Refresh the sections after adding
        fetch('http://127.0.0.1:8000/get_section_json/')
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
    fetch(`http://127.0.0.1:8000/delete_section/${selectedCourse}/${selectedYear.replace(' ', '%20')}/`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        // Refresh the sections after deleting
        fetch('http://127.0.0.1:8000/get_section_json/')
          .then(response => response.json())
          .then(data => {
            const filteredSections = data.filter(subject => subject.course === selectedCourse && subject.year === selectedYear);
            setFilteredSections(filteredSections);
          })
          .catch(error => console.error('Error fetching sections:', error));
      })
      .catch(error => console.error('Error deleting section:', error));
  };  

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: '30px' }}>
      {filteredSections.map((section, index) => (
        <div key={section.sectionnumber} style={{ background: 'gold', marginRight: '1px', padding: '5px', width: '100px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '17px', fontWeight: 'bold', marginRight: '5px' }}>{courseAbbreviation}{yearValue}S{section.sectionnumber}</span>
          {index === filteredSections.length - 1 && filteredSections.length !== 1 && (
            <img src={add} alt="add icon" onClick={deleteSection} style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer', marginLeft: 'auto', transform: 'rotate(45deg)' }} />
          )}
        </div>
      ))}
      {filteredSections.length === 0 || (filteredSections.length > 0 && filteredSections[filteredSections.length - 1].sectionnumber !== 1) ? (
        <img src={add} alt="add icon" onClick={addSection} style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer', marginTop: '7px', marginLeft: '3px' }} />
      ) : (
        <span style={{ fontSize: '17px', fontWeight: 'bold', marginTop: '7px', marginLeft: '5px' }}>1 section default</span>
      )}
    </div>
  );
}

export default Sections;
