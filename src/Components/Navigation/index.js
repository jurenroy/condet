import React from 'react';
import home from '../../Assets/homeicon2.png'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse, selectYear } from '../Redux/Auth/AuthSlice';

function Navbar() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
  };

  return (
    <div style={{ backgroundColor: 'white', height: '40px', padding: '1px', marginTop: '10px', marginBottom: '10px', display:'flex', flexDirection: 'row'}}>
      <img src={home} alt="home icon" style={{ width: '25px', height: '25px', marginLeft: '10px', marginTop: '5px', cursor: 'pointer'}} onClick={handleNavigateToHome}/>
      <h3 style={{color: '#AAAAAA', marginLeft: '5px', marginTop: '5px', cursor: 'pointer'}} onClick={handleNavigateToHome}>Home</h3>
      {selectedCourse && (
        <>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> > </h3>
          <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{selectedCourse}</h3>
          {selectedYear && (
            <>
              <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}> > </h3>
              <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{selectedYear}</h3>
            </>
          )}
        </>
      )}
    </div>
  );
  
}

export default Navbar;
