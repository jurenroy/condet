import React, { useState } from 'react'

const DeleteCourse = (props) => {

  return (
    <div style={{ backgroundColor: 'red',position:'absolute',left:'600px', height:'150px', width: '200px', padding: '20px',display:'flex',justifyContent:'center', flexDirection:'column', borderRadius:'10%'}}>
    <h2>DeleteCourse</h2>
   
    
    <div style = {{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Yes</button>
    <button style = {{height:'35px', width:'30%', borderRadius:'10%'}} onClick={() => props.setShow(false)}>No</button>
    </div>
    
    </div>
  )
}

export default DeleteCourse;