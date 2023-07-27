import React, { useState } from 'react'

const DeleteRooms = (props) => {

  return (
    <div style={{
      backgroundColor: 'red',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px'
    }}>
      <h2 style={{marginBottom: '-10px'}}>Delete Course</h2>
      {/* {selectedCourse ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>{selectedCourse.coursename}</span>
          <br/>
          <span style={{fontSize: '25px', fontWeight: 'bold', textAlign: 'center'}}>{selectedCourse.abbreviation}</span>
        </div>
      ) : (
        <div>
          <h3>Loading course data...</h3>
        </div>
      )} */}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px'}} >Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px' }} onClick={() => props.setShowDeleteRooms(false)}>No</button>
      </div>
    </div>
  );
}

export default DeleteRooms;