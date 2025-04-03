import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

const App = () => {
  return (
    <div className="min-h-screen bg-stone-300 font-sans">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
