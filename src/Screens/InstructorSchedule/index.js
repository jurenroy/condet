import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { selectRoomslot } from '../../Components/Redux/Auth/AuthSlice';
import NotAvailableRoomslot from '../../Components/Popup/Schedule/Not Available RoomSlot';

function InstructorSchedule() {
  const dispatch = useDispatch()
  const { room } = useParams();
  const roomID = parseInt(room)
  const [roomSlots, setRoomSlots] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const [roomTitle, setRoomTitle] = useState('');

  const [roomData, setRoomData] = useState(null);

  const [showNotAvailableRoomslot, setNotAvailableRoomslot] = useState(false);

  const [hoveredRoomslotID, setHoveredRoomslotID] = useState(null);

  const handleMouseEnter = (roomslotID) => {
    setHoveredRoomslotID(roomslotID);
    setNotAvailableRoomslot(true);
    dispatch(selectRoomslot(roomslotID))
  };

  const handleMouseLeave = () => {
    setHoveredRoomslotID(null);
    setNotAvailableRoomslot(false);
    dispatch(selectRoomslot(''))
  };

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_room_json/')
      .then(response => {
        const rooms = response.data;
  
        // Use .filter to find the room with the matching roomID
        const filteredRoom = rooms.filter(room => room.roomID === roomID);
  
        if (filteredRoom.length > 0) {
          setRoomData(filteredRoom[0]);
          setRoomTitle(`${filteredRoom[0].building_number}: ${filteredRoom[0].roomname}`);
        } else {
          console.error('Room not found');
        }
      })
      .catch(error => {
        console.error('Error fetching room data:', error);
      });
  }, [roomID]);
  

  useEffect(() => {
    // Check if the user is logged in and navigate accordingly
    if (!isLoggedIn) {
      navigate('/'); // Redirect to the '/' route
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_roomslot_json/')
      .then(response => {
        const filteredSlots = response.data.filter(slot => 
          slot.roomslottype === roomData.roomtype && slot.roomname === roomData.roomname && slot.building_number === roomData.building_number
        );
  
        setRoomSlots(filteredSlots);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching room slot data:', error);
        setRoomSlots([]);
        setError('Error fetching room slot data');
      });
  }, [roomData]);
    

  // Helper function to sort room slots based on start time
  const sortRoomSlotsByTime = (slots) => {
    return slots.sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.starttime}`);
      const timeB = new Date(`1970-01-01T${b.starttime}`);
      return timeA - timeB;
    });
  };

  // Create an array of unique days
  // eslint-disable-next-line
  const days = Array.from(new Set(roomSlots.map((slot) => slot.day)));

  // Sort the room slots based on start time
  const sortedRoomSlots = sortRoomSlotsByTime(roomSlots);

  const timeSlots = Array.from(new Set(sortedRoomSlots.map((slot) => `${slot.starttime} - ${slot.endtime}`)));


  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px' }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>Schedule for Room:  {roomTitle}</h2>

            {error ? (
            <p>{error}</p>
          ) : sortedRoomSlots.length === 0 ? (
            <p>No room slots available for the specified room.</p>
          ) : (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Saturday</th>
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, index) => (
                  <tr key={index}>
                    <td>{timeSlot}</td>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, dayIndex) => {
                      const slotForDay = sortedRoomSlots.find(slot => slot.day === day && `${slot.starttime} - ${slot.endtime}` === timeSlot);

                      return (
                        <td
                          key={dayIndex}
                          onMouseEnter={() => handleMouseEnter(slotForDay.roomslotID)}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            backgroundColor: slotForDay ? (slotForDay.availability ? 'green' : 'red') : 'white',
                          }}
                        >
                          {slotForDay.availability ? 'Available' : 'Hover for Info'}
                          {showNotAvailableRoomslot && hoveredRoomslotID === slotForDay.roomslotID && !slotForDay.availability ? <NotAvailableRoomslot setNotAvailableRoomslot={setNotAvailableRoomslot} /> : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>Team Kokkak</p>
      </footer>
    </div>
  );
}

export default InstructorSchedule;
