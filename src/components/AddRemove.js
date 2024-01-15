import { useState, useEffect } from "react";

import { ImCross } from 'react-icons/im';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import { RiKickFill } from 'react-icons/ri';

const ChannelList = ({id, list, handleRemove}) => {
  return (
    <div className="flex flex-col gap-2 h-96 overflow-y-auto">
      {list.map((value, index) => 
        <div key={value} onClick={() => handleRemove(id, index)} className="flex bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer px-2 rounded">
          <div className="">{value}</div>
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

  const [validInput, setValidInput] = useState(false);

  useEffect(() => {
    setAddedTwitch([...currentLists[0]]);
    setAddedYoutube([...currentLists[1]]);
    setAddedKick([...currentLists[2]]);
  }, [])

  const valdiateInput = (input, platform) => {
    if (input) {
      if (input.match(/^[a-zA-Z0-9_]+$/i)) {
        if (platform == 0) {
          if (!addedTwitch.includes(input)) {
            return true;
          }
        } else if (platform == 1) {
          if (!addedYoutube.includes(input)) {
            return true;
          }
        } else {
          if (!addedKick.includes(input)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  const handleSetPlatform = (platform) => {
    setPlatformSelected(platform);
    if (valdiateInput(userInput, platform)) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
    if (valdiateInput(e.target.value, platformSelected)) {
      setValidInput(true);
    } else {
      setValidInput(false);
    }
  }

  const addChannel = () => {
    setUserInput('');
    setValidInput(false);
    let newChannels = [];
    if (valdiateInput(userInput, platformSelected)) {
      if (platformSelected == 0) {
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

  const onClickStopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    <div onClick={handleCancel} className="fixed left-0 right-0 top-0 bottom-0 flex gap-8 bg-black backdrop-blur bg-opacity-10 text-white">
      <div onClick={(e) => onClickStopPropagation(e)} className="m-auto">
        <div className="flex justify-center">
          <button onClick={() => handleSetPlatform(0)} className={`bg-violet-500 py-2 cursor-pointer rounded-t ${platformSelected == 0 ? "w-full" : "w-32"} flex items-center gap-2 justify-center transition-all font-bold`}><BsTwitch/>{platformSelected == 0 ? "Twitch" : ""}</button>
          <button onClick={() => handleSetPlatform(1)} className={`bg-red-400 py-2 cursor-pointer rounded-t ${platformSelected == 1 ? "w-full" : "w-32"} flex items-center gap-2 justify-center transition-all font-bold`}><BsYoutube/>{platformSelected == 1 ? "Youtube" : ""}</button>
          <button onClick={() => handleSetPlatform(2)} className={`bg-green-400 py-2 cursor-pointer rounded-t ${platformSelected == 2 ? "w-full" : "w-32"} flex items-center gap-2 justify-center transition-all font-bold`}><RiKickFill/>{platformSelected == 2 ? "Kick" : ""}</button>
        </div>
        <div className={`${platformSelected == 0 ? "bg-violet-500" : platformSelected == 1 ? "bg-red-400" : "bg-green-400"} flex flex-col p-16`}>
          {platformSelected == 0 ?
            <a 
              href="https://id.twitch.tv/oauth2/authorize?response_type=token&redirect_uri=https://isanyone.live/twitchimport&scope=user:read:follows&client_id=1zhazzeh06yvmnb52iiixw5s8e60qk"
              className="bg-blue-500 hover:bg-blue-600 transition-all rounded p-2 mb-2 w-fit m-auto flex items-center gap-1"><BsTwitch/> Import with Twitch
            </a>  
          : <></>}
          <form onSubmit={(e) => e.preventDefault()} className="flex  m-auto">
            <input
              value={userInput}
              onChange={handleUserInput}
              placeholder="Channel"
              pattern="[A-Za-z0-9_]+"
              className="bg-black focus:bg-zinc-800 outline-none invalid:outline invalid:outline-1 invalid:outline-red-500 p-2 rounded-l"
            />
            <div onClick={validInput ? addChannel : null} className={validInput ? "bg-blue-500 hover:bg-blue-600 transition-all p-2 cursor-pointer rounded-r" : "bg-gray-500 text-gray-300 transition-all p-2 rounded-r select-none"}>add</div>
          </form>
          <h2 className="mx-auto font-bold mt-4 mb-2">Click to remove</h2>
          {platformSelected == 0 ? <ChannelList id={0} list={addedTwitch} handleRemove={handleRemove}/> : <></>}
          {platformSelected == 1 ? <ChannelList id={1} list={addedYoutube} handleRemove={handleRemove}/> : <></>}
          {platformSelected == 2 ? <ChannelList id={2} list={addedKick} handleRemove={handleRemove}/> : <></>}
          <div className="flex gap-8 mt-8">
            <button onClick={handleCancel} className='ml-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded'>Cancel</button>
            <button onClick={handleSave} className='mr-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded'>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}