// UpdateAvailability.js
import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const UpdateAvailability = () => {
  const location = useLocation();

  const updateAvailability = async () => {
    try {
      await axios.get('https://classscheeduling.pythonanywhere.com/update-availability/');
      console.log('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  useEffect(() => {
    // Run updateAvailability when the component mounts or when the route changes
    updateAvailability();
  }, [location]);

  return null; // This component doesn't render anything
};

export default UpdateAvailability;