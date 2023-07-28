import { useState } from "react";

function Channels({Platform}) {
  const [addedChannels, setAddedChannels] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  }

  const addChannel = () => {
    let newChannels = addedChannels;
    newChannels.push(userInput);
    console.log(newChannels);
    setUserInput('');
    setAddedChannels([...newChannels]);
  }

  return (
    <div className="">
      <div>platform: {Platform}</div>
      <div>channels: {addedChannels}</div>
      <form className="flex pt-1 gap-3">
        <input
          value={userInput}
          onChange={handleUserInput}
          placeholder="Channel"
          className="bg-zinc-500"
        />
        <div onClick={addChannel} className="text-white bg-black p-2">add</div>
      </form>
    </div>
  )
}

export default function App() {
  return (
    <div className="bg-blue-300 text-white h-screen flex flex-col gap-8">
      <Channels Platform={'Twitch'}/>
      <Channels Platform={'Youtube'}/>
      <Channels Platform={'Kick'}/>
    </div>
  );
}