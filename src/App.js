import { useState } from 'react';

import AddRemove from './AddRemove.js';

export default function App() {
  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(true);
  return (
    <div className='h-screen flex flex-col bg-zinc-100'>
      <button onClick={() => setIsAddRemoveOpen(!isAddRemoveOpen)} className='mx-auto p-2 text-white bg-blue-500 rounded-lg'>Toggle</button>
      <div>{isAddRemoveOpen ? <AddRemove/> : <></>}</div>
    </div>
  )
}