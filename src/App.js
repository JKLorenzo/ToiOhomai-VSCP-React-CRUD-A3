import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CRUD_ELEMENT from './components/crud_component';
import FRONTPAGE_ELEMENT from './components/frontpage_component';
import DISPLAYDOCUMENT_COMPONENT from './components/displaydocument_component';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<FRONTPAGE_ELEMENT />} />
        <Route path='/document/:id' element={<DISPLAYDOCUMENT_COMPONENT />} />
        <Route path='/CRUD' element={<CRUD_ELEMENT />} />
      </Routes>
    </Router>
  );
}

export default App;
