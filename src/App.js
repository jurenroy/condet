import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './Components/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './Screens/Home';
import Login from './Screens/Login';
import UpdateCourse from './Components/Popup/Course/Update';
import Course from './Screens/Course';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/:course" element={<Course/>} /> // Define the parameter in the route path
            <Route path="/update_course/:courseId" element={<UpdateCourse />} />
          </Routes>
        </Router>
    </PersistGate>
    </Provider>
  );
}

export default App;
