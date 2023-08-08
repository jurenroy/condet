import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import AddRooms from '../../Components/Popup/Rooms/Add';
import DeleteRooms from '../../Components/Popup/Rooms/Delete';
import UpdateRooms from '../../Components/Popup/Rooms/Update';
import { selectType, selectRoom} from '../../Components/Redux/Auth/AuthSlice';

function Timeslots() {
  const dispatch = useDispatch();
  const [showAddRooms , setShowAddRooms] = useState(false)
  const [showUpdateRooms , setShowUpdateRooms] = useState(false)
  const [showDeleteRooms , setShowDeleteRooms] = useState(false)
  const [timeslotData, setTimeslotData] = useState([]);
  const selectedCourse = useSelector(state => state.auth.course);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const handleNoClickRooms = () => {
    setShowAddRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
  };

  const handleCancelClickRooms = (room) => {
    setShowUpdateRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectRoom(room.roomname)); 
  }

  const handleNoDeleteClickRooms = (room) => {
    setShowDeleteRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectRoom(room.roomname)); 
  }  

  const handleNoClickRooms2 = () => {
    setShowAddRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
  };

  const handleCancelClickRooms2 = (room) => {
    setShowUpdateRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectRoom(room.roomname)); 
  }

  const handleNoDeleteClickRooms2 = (room) => {
    setShowDeleteRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectRoom(room.roomname)); 
  }  


  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:8000/get_timeslot_json/')
      .then(response => response.json())
      .then(data => {
        // Filter the data based on the selected course
        const filteredTimeslot = data.filter(timeslot => timeslot.course === selectedCourse);
        // Sort the filteredTimeslot array based on starttime (earliest timeslot first)
        filteredTimeslot.sort((a, b) => a.starttime.localeCompare(b.starttime));
        setTimeslotData(filteredTimeslot);
      })
      .catch(error => console.log(error));
  }, [selectedCourse]);

  const lectureTimeslots = timeslotData.filter(timeslot => timeslot.timeslottype === 'Lecture');
  const laboratoryTimeslots = timeslotData.filter(timeslot => timeslot.timeslottype === 'Laboratory');


  // Utility function to convert time from 24-hour format to 12-hour format
  const formatTimeTo12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      period = 'PM';
      formattedHours = formattedHours === 12 ? formattedHours : formattedHours - 12;
    }

    formattedHours = formattedHours === 0 ? 12 : formattedHours;

    return `${formattedHours}:${minutes} ${period}`;
  };

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <h2>Timeslots</h2>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <h3>Lecture</h3>
              {isAdmin && (
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}} 
              onClick={() => {handleNoClickRooms();
                setShowUpdateRooms(false);
                setShowDeleteRooms(false)}}/>
                )}
              {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms} /> : null}
              {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}

            </div>
            {lectureTimeslots.map((timeslot) => (
                <div key={timeslot.timeslotID}>
                    <span style={{fontSize: '17px', fontWeight: 'bold'}}>{formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}</span>
                  {isAdmin && ( 
                    <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                     onClick={() => {handleCancelClickRooms(timeslot);
                      setShowAddRooms(false);
                      setShowDeleteRooms(false)}}/>
                  )}
                  {isAdmin && (
                    <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                    onClick={() => {handleNoDeleteClickRooms(timeslot);
                      setShowUpdateRooms(false);
                      setShowAddRooms(false)}}/> 
                  )}
                 </div>
            ))}
            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms} /> : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h3>Laboratory</h3>
            {isAdmin && ( 
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}
                 onClick={() => {handleNoClickRooms2();
                  setShowUpdateRooms(false);
                  setShowDeleteRooms(false)}}/>
            )}
                {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms2} /> : null}

              {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms2} /> : null}
            </div>
            {laboratoryTimeslots.map((timeslot) => (
              <div key={timeslot.timeslotID}>
                <span style={{fontSize: '17px', fontWeight: 'bold'}}>{formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}</span>
              {isAdmin && (  
                <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                 onClick={() => {handleCancelClickRooms2(timeslot);
                  setShowAddRooms(false);
                  setShowDeleteRooms(false)}}/>
              )}
              {isAdmin && (
                <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                  onClick={() => {handleNoDeleteClickRooms2(timeslot);
                  setShowUpdateRooms(false);
                  setShowAddRooms(false)}}/> 
              )}
              </div>
            ))}
            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms2} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms2} /> : null}
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}

export default Timeslots;
