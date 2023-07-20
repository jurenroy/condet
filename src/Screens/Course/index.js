import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import USTP from '../../Assets/USTP logo.png';
import { useSelector} from 'react-redux';

function Course() {
  const selectedCourse = useSelector(state => state.auth.course);

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ marginLeft: '5px', marginTop: '5px', color: '#AAAAAA' }}>{selectedCourse}</h3>
          <img src={USTP} alt="USTP logo" style={{ width: '450px', height: '450px', margin: '5px' }}/>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>footer man ni sya</p>
      </footer>
    </div>
  );
}

export default Course;




