import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useSelector} from 'react-redux';
import Rooms from '../Rooms';
import Timeslots from '../Timeslots';

function Course() {
  const selectedCourse = useSelector(state => state.auth.course);

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'column' }}>
          <h1 style={{ marginTop: '15px', fontSize: '30px'}}>{selectedCourse}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-start', width: '100%' }}>
            <Rooms />             
            <Timeslots />
          </div>
          <button style={{ position: 'absolute', bottom: '40px'}}>Generate Schedule</button>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>footer man ni sya</p>
      </footer>
    </div>
  );
}

export default Course;




