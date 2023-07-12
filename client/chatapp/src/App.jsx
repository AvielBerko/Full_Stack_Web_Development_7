import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [text, setText] = useState("")

  fetch("http://127.0.0.1:3000/users").then(res => res.json()).then(res => {console.log(res); setText(res[2].name);});
  return (
    <>
      <p>{text}</p>
    </> 
  )
}

export default App
