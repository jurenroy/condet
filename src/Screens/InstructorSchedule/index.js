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
  const dispatch = useDispatch();
  const { instructor } = useParams();
  const instructorID = parseInt(instructor)
  const [roomSlots, setRoomSlots] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const [scheduleData, setScheduleData] = useState(null);

  const [showNotAvailableRoomslot, setNotAvailableRoomslot] = useState(false);

  const [hoveredRoomslotID, setHoveredRoomslotID] = useState(null);

  const [instructorList, setInstructorList] = useState([]);
  const selectedCollege = useSelector((state) => state.auth.college);

  useEffect(() => {
    // Make Axios GET request when selectedCollege changes
    if (selectedCollege) {
      axios.get('https://classscheeduling.pythonanywhere.com/get_instructor_json/', {
        params: {
          college: parseInt(selectedCollege),
          instructorID: instructorID
        }
      })
        .then(response => {
          // Update the courseList state with the response data
          setInstructorList(response.data);
        })
        .catch(error => {
          // Handle errors here
          console.error(error);
        });
    }
  }, [selectedCollege, instructorID]);

  const handleMouseEnter = (roomslotID) => {
    setHoveredRoomslotID(roomslotID);
    setNotAvailableRoomslot(true);
    dispatch(selectRoomslot(roomslotID));
  };

  const handleMouseLeave = () => {
    setHoveredRoomslotID(null);
    setNotAvailableRoomslot(false);
    dispatch(selectRoomslot(''));
  };

  const [selectedRoomType, setSelectedRoomType] = useState('Lecture');

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedRoomType(value);
    // Call a function or perform actions here based on the selected value if needed
  };

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_schedule_json/')
      .then(response => {
        const schedules = response.data;

        // Use .filter to find the room with the matching roomID
        const filteredSchedule = schedules.filter(schedule => schedule.instructor === instructor);

        if (filteredSchedule.length > 0) {
          setScheduleData(filteredSchedule);
        } else {
          console.error('Instructor not Found');
        }
      })
      .catch(error => {
        console.error('Error fetching instructor data:', error);
      });
  }, [instructor]);


  useEffect(() => {
    // Check if the user is logged in and navigate accordingly
    if (!isLoggedIn) {
      navigate('/'); // Redirect to the '/' route
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_roomslot_json/')
      .then(response => {
        setRoomSlots(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching room slot data:', error);
        setRoomSlots([]);
        setError('Error fetching room slot data');
      });
  }, [scheduleData]);


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
  const sortedRoomSlots = sortRoomSlotsByTime(roomSlots.filter((slot) => slot.roomslottype === selectedRoomType && slot.college === parseInt(selectedCollege)));

  const timeSlots = Array.from(new Set(sortedRoomSlots.map((slot) => `${slot.starttime} - ${slot.endtime}`)));

  const [matchedRoomSlots, setMatchedRoomSlots] = useState([]);

  useEffect(() => {
    const matchRoomSlots = (roomSlotsData, scheduleData) => {
      const matchedRoomSlots = [];

      roomSlotsData.forEach(roomSlot => {
        const lectureRoomslotnumber = scheduleData && scheduleData.find(schedule =>
          schedule.lecture_roomslotnumber &&
          parseInt(schedule.lecture_roomslotnumber) === roomSlot.roomslotnumber &&
          roomSlot.roomslottype === 'Lecture'
        );
        const labRoomslotnumber = scheduleData && scheduleData.find(schedule =>
          schedule.lab_roomslotnumber &&
          parseInt(schedule.lab_roomslotnumber) === roomSlot.roomslotnumber &&
          roomSlot.roomslottype === 'Laboratory'
        );

        if (lectureRoomslotnumber && roomSlot.roomslottype === 'Lecture') {
          matchedRoomSlots.push({
            roomSlot,
            scheduleData: lectureRoomslotnumber
          });
        } else if (labRoomslotnumber && roomSlot.roomslottype === 'Laboratory') {
          matchedRoomSlots.push({
            roomSlot,
            scheduleData: labRoomslotnumber
          });
        }
      });

      setMatchedRoomSlots(matchedRoomSlots);
    };

    // Example usage
    matchRoomSlots(roomSlots, scheduleData);
  }, [roomSlots, scheduleData]);

  const instructorName = instructorList.find((instructor) => instructor.instructorID === instructorID)?.name || 'Unknown Instructor';

  // eslint-disable-next-line
  const formattedTime = (timeString) => {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
  
    const formattedTime = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  
    return formattedTime;
  };

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px' }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div>

            <h2 style={{ textAlign: 'center' }}>Schedule for Instructor:  {instructorName}</h2>
            <div style={{marginBottom: '20px'}}>
              <label htmlFor="roomType">Select Room Type: </label>
              <select id="roomType" value={selectedRoomType} onChange={handleSelectChange}>
                <option value="Lecture">Lecture</option>
                <option value="Laboratory">Laboratory</option>
              </select>
            </div>
            {error ? (
  <p>{error}</p>
) : matchedRoomSlots.length === 0 ? (
  <p>No matching room slots available for the specified room.</p>
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
            const matchingRoomSlot = matchedRoomSlots.find(slot => slot.roomSlot.roomslottype === selectedRoomType && slot.roomSlot.day === day && `${slot.roomSlot.starttime} - ${slot.roomSlot.endtime}` === timeSlot);

            return (
              <td
                key={dayIndex}
                onMouseEnter={() => handleMouseEnter(matchingRoomSlot?.roomSlot?.roomslotID)}
                onMouseLeave={handleMouseLeave}
                style={{
                  backgroundColor: matchingRoomSlot
                    ? matchingRoomSlot.roomSlot.availability
                      ? 'green'
                      : matchingRoomSlot.roomSlot.roomslottype === 'Lecture'
                        ? 'orange'
                        : matchingRoomSlot.roomSlot.roomslottype === 'Laboratory'
                          ? 'red'
                          : 'white'
                    : 'white',
                }}
              >
                {matchingRoomSlot ? (matchingRoomSlot.roomSlot.availability ? 'Available' : 'Hover for Info') : null}
                {showNotAvailableRoomslot && hoveredRoomslotID === matchingRoomSlot?.roomSlot?.roomslotID && matchingRoomSlot && !matchingRoomSlot.roomSlot.availability ? <NotAvailableRoomslot setNotAvailableRoomslot={setNotAvailableRoomslot} /> : null}
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
