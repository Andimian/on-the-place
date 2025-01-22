import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { DNDComponent } from './components/DndContextComponent'
import {DndContext} from '@dnd-kit/core';
import TagGroups from './components/TagGroups'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TagGroups />
    </>
  )
}

export default App
