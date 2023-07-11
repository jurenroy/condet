import React, { useState } from 'react'

const UpdateCourse = () => {
    const [data, setData] = useState({
        coursename: '',
        abbreviation: ''
    });
  return (
    <div style={{ backgroundColor: 'red',position:'absolute',left:'600px', height:'350px', width: '500px', padding: '20px',display:'flex',justifyContent:'center', flexDirection:'column', borderRadius:'10%'}}>
    <h1>Update Course</h1>
   
    <h3 style={{marginTop:'12px'}}>Course Name:</h3>
    <input style ={{height:'500px', borderRadius:'10px'}}/>

    <h3 style={{marginTop:'12px'}}>Abbreviation:</h3>
    <input style ={{height:'500px', borderRadius:'10px'}}/>
    
    <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Update</button>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Cancel</button>
    </div>
    
    
    </div>
  )
}

export default UpdateCourse