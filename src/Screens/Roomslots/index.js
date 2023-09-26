import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotAvailableRoomslot from '../../Components/Popup/Schedule/Not Available RoomSlot';
import { selectRoomslot } from '../../Components/Redux/Auth/AuthSlice';

function Roomslots() {
  const dispatch = useDispatch();
  const [roomslotsData, setRoomslotsData] = useState([]);
  const [selectedRoomslotType, setSelectedRoomslotType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availability, setAvailability] = useState('');
  const availabilityValue = availability === "true";
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
  
  const selectedCourse = useSelector(state => state.auth.course);

  const [courseAbbreviation, setCourseAbbreviation] = useState('');

    // Assuming you have a function to fetch data from an API
    async function fetchCourseData() {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_course_json/');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching course data:', error);
        return [];
      }
    }
  
    // Inside your component
    const getCourseAbbreviation = async (courseId) => {
      const courseData = await fetchCourseData();
  
      // Find the course with the matching course ID
      const matchingCourse = courseData.find(course => course.courseID === courseId);
  
      if (matchingCourse) {
        return matchingCourse.abbreviation;
      } else {
        return null; // Course not found
      }
    };
  
    useEffect(() => {
      if (selectedCourse) {
        getCourseAbbreviation(selectedCourse)
          .then(abbreviation => setCourseAbbreviation(abbreviation))
          .catch(error => console.error('Error fetching course abbreviation:', error));
      }
    // eslint-disable-next-line
    }, [selectedCourse]);


  useEffect(() => {
    async function fetchRoomslotsData() {
      try {
        const response = await fetch('https://classscheeduling.pythonanywhere.com/get_roomslot_json/');
        const data = await response.json();
        setRoomslotsData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchRoomslotsData();
  }, []);

  // Filtered data based on selected roomslot type and room
  const filteredRoomslots = roomslotsData.filter(roomslot =>
    roomslot.course === selectedCourse && 
    (!selectedRoomslotType || roomslot.roomslottype === selectedRoomslotType) &&
    (!selectedDay || roomslot.day === selectedDay) &&
    (!selectedRoom || `${roomslot.building_number} - ${roomslot.roomname}` === selectedRoom)&&
    (!availability || roomslot.availability === availabilityValue)
  );

  const uniqueRooms = Array.from(new Set(
    roomslotsData
    .filter(roomslot => roomslot.course === selectedCourse && (!selectedRoomslotType || roomslot.roomslottype === selectedRoomslotType) )
      .map(roomslot => `${roomslot.building_number} - ${roomslot.roomname}`)
  ));

  return (
    <div>
      <h2>Roomslot for {courseAbbreviation}</h2>
      <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
        <div>
          <label>Roomslot Type:</label>
          <select
            value={selectedRoomslotType}
            onChange={e => setSelectedRoomslotType(e.target.value)}
          >
            <option value="">All</option>
            <option value="Lecture">Lecture</option>
            <option value="Laboratory">Laboratory</option>
          </select>
        </div>
        <div>
          <label>Room:</label>
          <select
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
          >
            <option value="">All</option>
            {uniqueRooms.map((roomOption, index) => (
              <option key={index} value={roomOption}>
                {roomOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Day:</label>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
          >
            <option value="">All</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>
        <div>
          <label>Availability:</label>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Roomslot Type</th>
            <th>Room</th>
            <th>Day</th>
            <th>Time</th>
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoomslots.map(roomslot => (
            <tr key={roomslot.roomslotID}>
              <td>{roomslot.roomslottype}</td>
              <td>{roomslot.building_number} - {roomslot.roomname}</td>
              <td>{roomslot.day}</td>
              <td>{roomslot.starttime} - {roomslot.endtime}</td>
              <td onMouseEnter={() => handleMouseEnter(roomslot.roomslotID)} onMouseLeave={handleMouseLeave} style={{ backgroundColor: hoveredRoomslotID === roomslot.roomslotID && !roomslot.availability ? 'red' : 'white' }}>
                {roomslot.availability ? 'Yes' : 'No'}
                {showNotAvailableRoomslot && hoveredRoomslotID === roomslot.roomslotID && !roomslot.availability ? <NotAvailableRoomslot setNotAvailableRoomslot={setNotAvailableRoomslot} /> : null}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roomslots;
