// import React, { useState } from 'react'

// const AddCourse = () => {
//     const [data, setData] = useState({
//         coursename: '',
//         abbreviation: ''
//     });
//   return (
//     <div style={{ backgroundColor: 'red',position:'absolute',left:'600px', height:'350px', width: '500px', padding: '20px',display:'flex',justifyContent:'center', flexDirection:'column', borderRadius:'10%'}}>
//     <h1>Add Course</h1>
   
//     <h3 style={{marginTop:'12px'}}>Course Name:</h3>
//     <input style ={{height:'500px', borderRadius:'10px'}}/>

//     <h3 style={{marginTop:'12px'}}>Abbreviation:</h3>
//     <input style ={{height:'500px', borderRadius:'10px'}}/>
    
//     <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
//     <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Add</button>
//     <button style = {{height:'35px', width:'30%', borderRadius:'10%'}}>Cancel</button>
//     </div>
    
    
//     </div>
//   )
// }

// export default AddCourse;


import React, { useState } from 'react';

const AddCourse = (props) => {
  const [data, setData] = useState({
    coursename: '',
    abbreviation: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddCourse = () => {
    // Send a request to http://127.0.0.1:8000/get_course_json/ with the course data
    fetch('http://127.0.0.1:8000/add_course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response from the server
        console.log(result);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error:', error);
      });
  };

  return (
    <div style={{ backgroundColor: 'red', position: 'absolute', left: '600px', height: '350px', width: '500px', padding: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column', borderRadius: '10%' }}>
      <h1>Add Course</h1>

      <h3 style={{ marginTop: '12px' }}>Course Name:</h3>
      <input style={{ height: '500px', borderRadius: '10px' }} name="coursename" value={data.coursename} onChange={handleInputChange} />

      <h3 style={{ marginTop: '12px' }}>Abbreviation:</h3>
      <input style={{ height: '500px', borderRadius: '10px' }} name="abbreviation" value={data.abbreviation} onChange={handleInputChange} />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }} onClick={handleAddCourse}>Add</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%' }} onClick={() => props.setShow(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddCourse;
