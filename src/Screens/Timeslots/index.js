import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import { selectType, selectTime, selectTimeslots} from '../../Components/Redux/Auth/AuthSlice';
import AddTimeslot from '../../Components/Popup/Timeslots/Add';
import DeleteTimeslot from '../../Components/Popup/Timeslots/Delete';
import UpdateTimeslot from '../../Components/Popup/Timeslots/Update';
import YourComponent from '../../Components/Popup/Timeslots/Interval';

function Timeslots() {
  const dispatch = useDispatch();
  const [showAddTimeslot , setShowAddTimeslot] = useState(false)
  const [showUpdateTimeslot , setShowUpdateTimeslot] = useState(false)
  const [showDeleteTimeslot , setShowDeleteTimeslot] = useState(false)
  const [timeslotData, setTimeslotData] = useState([]);
  const selectedCollege = useSelector(state => state.auth.college);
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
    fetch('https://classscheeduling.pythonanywhere.com/get_timeslot_json/')
      .then(response => response.json())
      .then(data => {
        // Filter the data based on the selected college
        const filteredTimeslot = data.filter(timeslot => timeslot.college === parseInt(selectedCollege));
        // Sort the filteredTimeslot array based on starttime (earliest timeslot first)
        filteredTimeslot.sort((a, b) => a.starttime.localeCompare(b.starttime));
        setTimeslotData(filteredTimeslot);
      })
      .catch(error => console.log(error));
  }, [selectedCollege]);

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

              {/* Lecture */}
              <h3>Lecture</h3>
              {isAdmin && (
                <div style={{display:'flex',flexDirection:'column'}}>
                <label style={{cursor:'pointer',fontSize:'12px',position:'relative',fontWeight:'bold',top:'-5px',left:'5px'}}>
                  Add
                </label>
              <img src={add} alt="add icon" style={{top:'-5px',position:'relative', width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}} 
              onClick={() => {handleNoClickTimeslot();
                setShowUpdateTimeslot(false);
                setShowDeleteTimeslot(false)}}
                title='Add Time'/>
                </div>
                )}
              {showAddTimeslot ? <AddTimeslot setShowAddTimeslot={setShowAddTimeslot} handleNoClickTimeslot={handleNoClickTimeslot} /> : null}

            </div>
            <div>
              <table className="schedule-table">
                <thead>
                  <tr>
                    
                    
                  </tr>
                </thead>
                <tbody>
                  {lectureTimeslots.map((timeslot) => (
                    <tr key={timeslot.timeslotID}>
                      <td>
                        <span style={{ fontSize: '17px', fontWeight: 'bold' }}>
                          {formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}
                        </span>
                      </td>
                      {isAdmin && (
                      <td>
                         <div style={{top:'-2px',position:'relative',flex:'1',display:'flex',flexDirection:'row'}}>
                    <label style={{fontWeight:'bold',fontSize:'10px',position:'relative',marginRight:'12px'}}>
                      Edit
                    </label>
                    <label style={{fontWeight:'bold',fontSize:'10px',position:'relative'}}>
                      Delete
                    </label>
                    </div>
                          <img
                            src={editicon}
                            alt="edit icon"
                            style={{ width: '19px', height: '19px', cursor: 'pointer', marginTop: '10px' }}
                            onClick={() => {
                              handleCancelClickTimeslot(timeslot);
                              setShowAddTimeslot(false);
                              setShowDeleteTimeslot(false);
                            }}
                            title='Edit Time'
                          />

                          <img
                            src={deleteicon}
                            alt="delete icon"
                            style={{ width: '20px', height: '20px', cursor: 'pointer', marginTop: '10px', marginLeft: '30%' }}
                            onClick={() => {
                              handleNoDeleteClickTimeslot(timeslot);
                              setShowUpdateTimeslot(false);
                              setShowAddTimeslot(false);
                            }}
                            title='Delete Time'
                          />
                          </td>
                      )}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              {lectureTimeslots.length > 0 ?
              <YourComponent selectedCollege={selectedCollege} selectedType="Lecture"/> :
              null }
            </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

            {/* Laboratory */}
            <h3>Laboratory</h3>
            {isAdmin && ( 
              <div style={{display:'flex',flexDirection:'column'}}>
                 <label style={{cursor:'pointer',fontSize:'12px',position:'relative',fontWeight:'bold',top:'-5px',left:'5px'}}>
                   Add
                 </label>
              <img src={add} alt="add icon" style={{top:'-5px',position:'relative' ,width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}
                 onClick={() => {handleNoClickTimeslot2();
                  setShowUpdateTimeslot(false);
                  setShowDeleteTimeslot(false)}}
                  title='Add Time'
                  />
                  </div>
            )} 
            </div>

            <div>
              <table className="schedule-table">
                <thead>
                  <tr> 
                  </tr>
                </thead>
                <tbody>
                  {laboratoryTimeslots.map((timeslot) => (
                    <tr key={timeslot.timeslotID}>
                      <td>
                        <span style={{ fontSize: '17px', fontWeight: 'bold' }}>
                          {formatTimeTo12Hour(timeslot.starttime)} - {formatTimeTo12Hour(timeslot.endtime)}
                        </span>
                      </td>
                      
                      {isAdmin && (
                        <td>
                          <div style={{top:'-2px',position:'relative',flex:'1',display:'flex',flexDirection:'row'}}>
                    <label style={{fontWeight:'bold',fontSize:'10px',position:'relative',marginRight:'12px'}}>
                      Edit
                    </label>
                    <label style={{fontWeight:'bold',fontSize:'10px',position:'relative'}}>
                      Delete
                    </label>
                    </div>


                          <img
                            src={editicon}
                            alt="edit icon"
                            style={{ width: '19px', height: '19px', cursor: 'pointer', marginTop: '5px' }}
                            onClick={() => {
                              handleCancelClickTimeslot2(timeslot);
                              setShowAddTimeslot(false);
                              setShowDeleteTimeslot(false);
                            }}
                            title='Edit Time'
                          />
                          <img
                            src={deleteicon}
                            alt="delete icon"
                            style={{ width: '19px', height: '19px', cursor: 'pointer', marginTop: '10px', marginLeft: '30%' }}
                            onClick={() => {
                              handleNoDeleteClickTimeslot2(timeslot);
                              setShowUpdateTimeslot(false);
                              setShowAddTimeslot(false);
                            }}
                            title='Delete Time'
                          />
                          </td>
                      )}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
              {laboratoryTimeslots.length > 0 ?
              <YourComponent selectedCollege={selectedCollege} selectedType="Laboratory"/> :
              null }
            </div>


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