import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [text, setText] = useState("")

  fetch("http://127.0.0.1:3000/").then(res => res.json()).then(res => setText(res.data));
  return (
    <>
      <p>{text}</p>
    </>
  )
}

export default App
