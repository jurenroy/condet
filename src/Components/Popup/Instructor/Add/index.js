import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddInstructor = (props) => {
  const [name, setname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const college = useSelector((state) => state.auth.college);
  const [instructors, setInstructors] = useState([]);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);

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

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        // Filter instructors by college
        const filteredInstructors = response.data.filter((instructor) => instructor.college === parseInt(college));
        setInstructors(filteredInstructors); // Store the filtered instructor names in state
      })
      .catch((error) => {
        console.error('Error fetching instructor data:', error);
      });
  }, [college]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCourse();
    }
    if (e.key === 'Escape') {
      props.setShowAddInstructor(false);
    }
  };

  const handleAddCourse = () => {
    if (name.trim() === '') {
      setErrorMessage('Please provide Instructor');
    } else if (instructors.some((instructor) => instructor.name === name.trim())) {
      setErrorMessage('Instructor with the same name already exists');
    } else {
      setButtonDisabled(true); // Disable the button
      setLoading(true); // Set loading to true

      const formData = new FormData();
      formData.append('name', name);
      formData.append('college', college);

      axios
        .post('https://classscheeduling.pythonanywhere.com/add_instructor/', formData)
        .then((response) => {
          setErrorMessage('');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error:', error);
          setErrorMessage('Error adding instructor');

        })
        .finally(() => {
          setButtonDisabled(false); // Re-enable the button after request completion
          setLoading(false); 
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
      <div
        style={{
          backgroundColor: '#060E57',
          height: '20px',
          width: '400px',
          position: 'absolute',
          left: '0',
          top: '0%',
          borderTopRightRadius: '8px',
          borderTopLeftRadius: '8px',
          padding: '20px',
        }}
      >
        <h2 style={{ marginTop: '-2px', color: 'white' }}>Add Instructor</h2>
      </div>

      <div
        style={{
          backgroundColor: '#FAB417',
          height: '7px',
          width: '437.5px',
          position: 'absolute',
          left: '0.4%',
          top: '98%',
          borderBottomRightRadius: '8px',
          borderBottomLeftRadius: '8px',
        }}
      />

      <h3 style={{ marginTop: '50px' }}>Instructor Name:</h3>

      <input
        style={{ height: '40px', borderRadius: '10px', fontSize: '20px' }}
        type="text"
        value={name}
        onChange={(e) => setname(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      {errorMessage && <p>{errorMessage}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button
          style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }}
          onClick={handleAddCourse}
          disabled={isButtonDisabled} 
        >
           {isLoading ? 'Adding...' : 'Add'}
        </button>
        <button
          style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }}
          onClick={() => props.setShowAddInstructor(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddInstructor;
