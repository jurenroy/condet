import React, { useState, useEffect } from 'react';

function Roomslots() {
  const [roomslotsData, setRoomslotsData] = useState([]);

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

  return (
    <div>
      <h2>Roomslot for yawa</h2>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Roomslot Type</th>
            <th>Room</th>
            <th>Day</th>
            <th>Time</th>
            <th>Availability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roomslotsData.map(roomslot => (
            <tr key={roomslot.roomslotID}>
              <td>{roomslot.course}</td>
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
