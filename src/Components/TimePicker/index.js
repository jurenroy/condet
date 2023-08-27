import React, { useState, useEffect } from 'react';

const TimePicker = ({ onMilitaryTimeChange, militaryTimeProp }) => {
  const [isPickerOpen, setPickerOpen] = useState(false);
  console.log('militaryTimeProp:', militaryTimeProp);

  const militaryTimePropValid = /^(\d{1,2}:\d{2} (AM|PM))$/.test(militaryTimeProp);

  const [hour, setHour] = useState(militaryTimePropValid ? militaryTimeProp.split(':')[0].padStart(2, '0') : '01');
  const [minute, setMinute] = useState(militaryTimePropValid ? militaryTimeProp.split(':')[1].split(' ')[0] : '00');
  const [ampm, setAmPm] = useState(militaryTimePropValid ? militaryTimeProp.split(' ')[1] : 'AM');
  

  // eslint-disable-next-line
  const [militaryTime, setMilitaryTime] = useState('');

  const togglePicker = () => {
    setPickerOpen(!isPickerOpen);
  };

  const handleHourChange = (e) => {
    setHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setMinute(e.target.value);
  };

  const handleAmPmChange = (e) => {
    setAmPm(e.target.value);
  };

  useEffect(() => {
    const time = `${hour}:${minute} ${ampm}`;
    setMilitaryTime(convertToMilitaryTime(time));

    // Call the callback function when military time is updated
    if (onMilitaryTimeChange) {
      onMilitaryTimeChange(convertToMilitaryTime(time));
    }
  }, [hour, minute, ampm, onMilitaryTimeChange]);

  const convertToMilitaryTime = (time) => {
    const [formattedTime, meridiem] = time.split(' ');
    let [hours, minutes] = formattedTime.split(':');

    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    if (meridiem === 'PM' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="time-picker">
      <input
        style={{ height: '20px', borderRadius: '5px', fontSize: '20px', width: '30%', textAlign: 'center'}}
        type="text"
        value={`${hour}:${minute} ${ampm}`}
        readOnly
        onClick={togglePicker}
      />
      {isPickerOpen && (
        <div className="dropdowns">
          <select value={hour} onChange={handleHourChange}>
            {/* Populate hours */}
            {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
              <option key={hour} value={hour.toString().padStart(2, '0')}>
                {hour.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          <span>:</span>
          <select value={minute} onChange={handleMinuteChange}>
            {/* Populate minutes */}
            {Array.from({ length: 4 }, (_, i) => i * 15).map((minute) => (
              <option key={minute} value={minute.toString().padStart(2, '0')}>
                {minute.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          <select value={ampm} onChange={handleAmPmChange}>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TimePicker;