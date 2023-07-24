import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useSelector} from 'react-redux';
import Subjects from '../Subjects';
import Sections from '../Section';


function Year() {
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column' }}>
          <h1 style={{ marginTop: '15px', fontSize: '30px'}}>{selectedCourse} - {selectedYear}</h1>
          <Sections/>
          <Subjects/>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>footer man ni sya</p>
      </footer>
    </div>
  );
}

export default Year;




