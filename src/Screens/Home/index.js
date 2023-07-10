import React from 'react';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';

function Home() {
  const name = 'John Doe';
  const age = 25;

  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div style={{backgroundColor: '#dcdee4', height: '100vh'}}>
        <Header/>
        <Navbar/>
        <Sidebar/>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}

export default Home;
