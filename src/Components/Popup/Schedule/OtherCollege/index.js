import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OtherCollege = (props) => {

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999, // Ensure it appears above other content
        display: 'flex',
        alignItems: 'center', // Vertically center content
        flexDirection: 'column',
        marginLeft: '10%'
      }}
    >
      {/* Color sa container na popup */}
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid black',
          height: 'auto', // Adjust height as needed
          width: 'auto',
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: '20px',
        }}
      >
        {/* Color blue sa taas */}
        <div
          style={{
            backgroundColor: '#060E57',
            height: '14px',
            width: '97%', // Adjust width as needed
            top: '0px',
            marginLeft: '-20px',
            borderTopRightRadius: '18px',
            borderTopLeftRadius: '18px',
            padding: '10px',
            position: 'fixed'
          }}
        />

        {/* Color yellow sa ubos */}
        <div
          style={{
            backgroundColor: '#FAB417',
            height: '14px',
            width: '99.3%', // Adjust width as needed
            borderBottomRightRadius: '18px',
            borderBottomLeftRadius: '18px',
            bottom: '0px', // Adjust margin as needed
            marginLeft: '-19px',
            position: 'absolute',
            padding: '1px',
          }}
        />
        <h1>The Roomslot is used or conflict with other college</h1>
    </div>
    </div>
  );
};

export default OtherCollege;
