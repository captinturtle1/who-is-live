import { useState, useEffect } from "react";

import { ImCross } from 'react-icons/im';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import { RiKickFill } from 'react-icons/ri';

const ChannelList = ({id, list, handleRemove}) => {
  return (
    <div className="w-32 flex flex-col gap-2">
      <div>{id === 0 ? 'Twitch' : id === 1 ? 'Youtube' : 'Kick'}</div>
      {list.map((value, index) => 
        <div className="flex bg-blue-500 px-2 rounded">
          <div className="mr-auto my-auto overflow-hidden text-sm">{value}</div>
          <ImCross onClick={() => handleRemove(id, index)} className="m-1 text-red-500 hover:text-red-600 transition-all font-black cursor-pointer"/>
        </div>
      )}
    </div>
  )
}

export default function AddRemove({setIsAddRemoveOpen, setLists, currentLists}) {
  // twitch 1, youtube 2, kick 3
  const [platformSelected, setPlatformSelected] = useState(0);
  const [userInput, setUserInput] = useState('');

  const [addedTwitch, setAddedTwitch] = useState([]);
  const [addedYoutube, setAddedYoutube] = useState([]);
  const [addedKick, setAddedKick] = useState([]);

  useEffect(() => {
    setAddedTwitch([...currentLists[0]]);
    setAddedYoutube([...currentLists[1]]);
    setAddedKick([...currentLists[2]]);
  }, [])

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  }

  const addChannel = () => {
    setUserInput('');
    let newChannels = [];
    if (platformSelected === 0) {
      newChannels = addedTwitch;
      newChannels.push(userInput);
      setAddedTwitch([...newChannels]);
    } else if (platformSelected === 1) {
      newChannels = addedYoutube
      newChannels.push(userInput);
      setAddedYoutube([...newChannels]);
    } else if (platformSelected === 2) {
      newChannels = addedKick;
      newChannels.push(userInput);
      setAddedKick([...newChannels]);
    }
  }

  const handleRemove = (platform, index) => {
    if (platform === 0) {
      let newArray = addedTwitch;
      newArray.splice(index, 1);
      setAddedTwitch([...newArray]);
    } else if (platform === 1) {
      let newArray = addedYoutube;
      newArray.splice(index, 1);
      setAddedYoutube([...newArray]);
    } else if (platform === 2) {
      let newArray = addedKick;
      newArray.splice(index, 1);
      setAddedKick([...newArray]);
    }
  }

  const handleCancel = () => {
    setIsAddRemoveOpen(false)
  }

  const handleSave = () => {
    setLists([addedTwitch, addedYoutube, addedKick]);
    setIsAddRemoveOpen(false);
  }

  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 flex gap-8 bg-black backdrop-blur bg-opacity-10 text-white">
      <div className="flex flex-col gap-4 bg-slate-600 rounded-3xl m-auto p-32">
        <form className="flex gap-5 m-auto">
          <input
            value={userInput}
            onChange={handleUserInput}
            placeholder="Channel"
            className="bg-black focus:bg-zinc-800 outline-none p-2 rounded"
          />
          <button type="button" onClick={addChannel} className="bg-blue-500 hover:bg-blue-600 transition-all p-2 cursor-pointer rounded">add</button>
        </form>
        <h1 className="mx-auto">Select Platform</h1>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setPlatformSelected(0)} className={platformSelected === 0 ? "bg-purple-500 p-2 cursor-pointer -translate-y-1 transition-all rounded" : "bg-purple-700 p-2 cursor-pointer300 transition-all rounded"}><BsTwitch/></button>
          <button onClick={() => setPlatformSelected(1)} className={platformSelected === 1 ? "bg-red-500 p-2 cursor-pointer -translate-y-1 transition-all rounded" : "bg-red-700 p-2 cursor-pointer transition-all rounded"}><BsYoutube/></button>
          <button onClick={() => setPlatformSelected(2)} className={platformSelected === 2 ? "bg-green-500 p-2 cursor-pointer -translate-y-1 transition-all rounded" : "bg-green-700 p-2 cursor-pointer transition-all rounded"}><RiKickFill/></button>
        </div>
        <div className="flex gap-8 m-auto text-center overflow-scroll h-[200px]">
          <ChannelList id={0} list={addedTwitch} handleRemove={handleRemove}/>
          <ChannelList id={1} list={addedYoutube} handleRemove={handleRemove}/>
          <ChannelList id={2} list={addedKick} handleRemove={handleRemove}/>
        </div>
        <div className="flex gap-8">
          <button onClick={handleCancel} className='ml-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-5'>Cancel</button>
          <button onClick={handleSave} className='mr-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-5'>Save</button>
        </div>
      </div>
    </div>
  );
}