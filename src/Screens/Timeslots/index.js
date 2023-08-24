import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import { selectType, selectTime, selectTimeslots} from '../../Components/Redux/Auth/AuthSlice';
import AddTimeslot from '../../Components/Popup/Timeslots/Add';
import DeleteTimeslot from '../../Components/Popup/Timeslots/Delete';
import UpdateTimeslot from '../../Components/Popup/Timeslots/Update';

function Timeslots() {
  const dispatch = useDispatch();
  const [showAddTimeslot , setShowAddTimeslot] = useState(false)
  const [showUpdateTimeslot , setShowUpdateTimeslot] = useState(false)
  const [showDeleteTimeslot , setShowDeleteTimeslot] = useState(false)
  const [timeslotData, setTimeslotData] = useState([]);
  const selectedCourse = useSelector(state => state.auth.course);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const handleNoClickTimeslot = () => {
    setShowAddTimeslot(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
  };

  const handleCancelClickTimeslot = (timeslot) => {
    setShowUpdateTimeslot(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectTime(timeslot.timeslotID));
    dispatch(selectTimeslots({ starttime: timeslot.starttime, endtime: timeslot.endtime }));
  }

  const handleNoDeleteClickTimeslot = (timeslot) => {
    setShowDeleteTimeslot(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectTime(timeslot.timeslotID));
  }  

  const handleNoClickTimeslot2 = () => {
    setShowAddTimeslot(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
  };

  const handleCancelClickTimeslot2 = (timeslot) => {
    setShowUpdateTimeslot(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectTime(timeslot.timeslotID));
    dispatch(selectTimeslots({ starttime: timeslot.starttime, endtime: timeslot.endtime }));
  }

  const handleNoDeleteClickTimeslot2 = (timeslot) => {
    setShowDeleteTimeslot(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectTime(timeslot.timeslotID));
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
              onClick={() => {handleNoClickTimeslot();
                setShowUpdateTimeslot(false);
                setShowDeleteTimeslot(false)}}/>
                )}
              {showAddTimeslot ? <AddTimeslot setShowAddTimeslot={setShowAddTimeslot} handleNoClickTimeslot={handleNoClickTimeslot} /> : null}
              {showDeleteTimeslot ? <DeleteTimeslot setShowDeleteTimeslot={setShowDeleteTimeslot} handleNoDeleteClickTimeslot={handleNoDeleteClickTimeslot} /> : null}

            </div>
            {lectureTimeslots.map((timeslot) => (
                <div key={timeslot.timeslotID}>
                    <span style={{fontSize: '17px', fontWeight: 'bold'}}>{formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}</span>
                  {isAdmin && ( 
                    <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                     onClick={() => {handleCancelClickTimeslot(timeslot);
                      setShowAddTimeslot(false);
                      setShowDeleteTimeslot(false)}}/>
                  )}
                  {isAdmin && (
                    <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                    onClick={() => {handleNoDeleteClickTimeslot(timeslot);
                      setShowUpdateTimeslot(false);
                      setShowAddTimeslot(false)}}/> 
                  )}
                 </div>
            ))}
            {showDeleteTimeslot ? <DeleteTimeslot setShowDeleteTimeslot={setShowDeleteTimeslot} handleNoDeleteClickTimeslot={handleNoDeleteClickTimeslot} /> : null}
            {showUpdateTimeslot ? <UpdateTimeslot setShowUpdateTimeslot={setShowUpdateTimeslot} handleCancelClickTimeslot={handleCancelClickTimeslot} /> : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <h3>Laboratory</h3>
            {isAdmin && ( 
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}
                 onClick={() => {handleNoClickTimeslot2();
                  setShowUpdateTimeslot(false);
                  setShowDeleteTimeslot(false)}}/>
            )}
                {showAddTimeslot ? <AddTimeslot setShowAddTimeslot={setShowAddTimeslot} handleNoClickTimeslot2={handleNoClickTimeslot2} /> : null}

              {showDeleteTimeslot ? <DeleteTimeslot setShowDeleteTimeslot={setShowDeleteTimeslot} handleNoDeleteClickTimeslot2={handleNoDeleteClickTimeslot2} /> : null}
            </div>
            {laboratoryTimeslots.map((timeslot) => (
              <div key={timeslot.timeslotID}>
                <span style={{fontSize: '17px', fontWeight: 'bold'}}>{formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}</span>
              {isAdmin && (  
                <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                 onClick={() => {handleCancelClickTimeslot2(timeslot);
                  setShowAddTimeslot(false);
                  setShowDeleteTimeslot(false)}}/>
              )}
              {isAdmin && (
                <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                  onClick={() => {handleNoDeleteClickTimeslot2(timeslot);
                  setShowUpdateTimeslot(false);
                  setShowAddTimeslot(false)}}/> 
              )}
              </div>
            ))}
            {showDeleteTimeslot ? <DeleteTimeslot setShowDeleteTimeslot={setShowDeleteTimeslot} handleNoDeleteClickTimeslot2={handleNoDeleteClickTimeslot2} /> : null}
            {showUpdateTimeslot ? <UpdateTimeslot setShowUpdateTimeslot={setShowUpdateTimeslot} handleCancelClickTimeslot2={handleCancelClickTimeslot2} /> : null}
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}

export default Timeslots;
