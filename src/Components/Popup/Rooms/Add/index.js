import React, { useState } from 'react'

const AddRooms = () => {
    const [data, setData] = useState({
        coursename: '',
        abbreviation: ''
    });
  return (
    <div style={{ backgroundColor: 'red',position:'absolute',left:'600px', height:'250px', width: '300px', padding: '20px',display:'flex',justifyContent:'center', flexDirection:'column', borderRadius:'10%'}}>
    <h1>Add Rooms</h1>
   
    <h3 style={{marginTop:'12px'}}>Rooms Name:</h3>
    <input style ={{height:'300px', borderRadius:'10px'}}/>

    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Add</button>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Cancel</button>
    </div>
    
    
    </div>
  )
}

export default AddRooms;