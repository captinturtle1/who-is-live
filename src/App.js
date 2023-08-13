import { useState } from 'react';

import AddRemove from './AddRemove.js';

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  return (
    <div className='h-screen flex flex-col bg-slate-800'>
      <button onClick={() => setIsAddRemoveOpen(true)} className='mx-auto p-2 text-white bg-blue-500 rounded-lg my-5'>Edit</button>
      <div>
        {isAddRemoveOpen ?
          <AddRemove
            setIsAddRemoveOpen={setIsAddRemoveOpen}
            twitchList={twitchList}
            setTwitchList={setTwitchList}
            youtubeList={youtubeList}
            setYoutubeList={setYoutubeList}
            kickList={kickList}
            setKickList={setKickList}
          /> 
        : 
          <></>
        }
      </div>
      <div>{twitchList}</div>
      <div>{youtubeList}</div>
      <div>{kickList}</div>
    </div>
  )
}