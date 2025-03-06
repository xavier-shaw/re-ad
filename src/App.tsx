import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GraphPanel from './GraphPanel'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GraphPanel />
    </div>
  )
}

export default App
