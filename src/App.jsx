import { useState } from 'react'
// import './App.css'
import Users from './components/Users'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Team from './components/Team'
import Home from './components/Home'
function App() {
  return (<div>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/team/:id' element={<Team />} />
      <Route path='*' element={<h1>404 Not Found</h1>} />
    </Routes>

    </BrowserRouter>
    
    </div>
  )
}

export default App