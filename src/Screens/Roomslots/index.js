import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function Roomslots() {
  const [roomslotsData, setRoomslotsData] = useState([]);
  const [selectedRoomslotType, setSelectedRoomslotType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [availability, setAvailability] = useState('');
  const availabilityValue = availability === "true";
  
  const selectedCourse = useSelector(state => state.auth.course);


  useEffect(() => {
    async function fetchRoomslotsData() {
      try {
        const response = await fetch('http://localhost:8000/get_roomslot_json/');
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
      <h2>Roomslot for {selectedCourse}</h2>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoomslots.map(roomslot => (
            <tr key={roomslot.roomslotID}>
              <td>{roomslot.roomslottype}</td>
              <td>{roomslot.building_number} - {roomslot.roomname}</td>
              <td>{roomslot.day}</td>
              <td>{roomslot.starttime} - {roomslot.endtime}</td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Roomslots;
