import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './Components/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Index from './Components/Index';
import Course from './Screens/Course';
import Year from './Screens/Year';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/:course/" element={<Course/>} /> 
            <Route path="/:course/:year" element={<Year/>} />
          </Routes>
        </Router>
    </PersistGate>
    </Provider>
  );
}

export default App;
