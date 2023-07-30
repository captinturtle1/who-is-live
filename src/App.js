import { useState } from "react";

export default function App() {
  // twitch 1, youtube 2, kick 3
  const [platformSelected, setPlatformSelected] = useState(0);
  const [userInput, setUserInput] = useState('');

  const [addedTwitch, setAddedTwitch] = useState([]);
  const [addedYoutube, setAddedYoutube] = useState([]);
  const [addedKick, setAddedKick] = useState([]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  }

  const addChannel = () => {
    setUserInput('');
    let newChannels = [];
    if (platformSelected == 0) {
      newChannels = addedTwitch;
      newChannels.push(userInput);
      setAddedTwitch([...newChannels]);
    } else if (platformSelected == 1) {
      newChannels = addedYoutube
      newChannels.push(userInput);
      setAddedYoutube([...newChannels]);
    } else if (platformSelected == 2) {
      newChannels = addedKick;
      newChannels.push(userInput);
      setAddedKick([...newChannels]);
    }
  }

  const handleRemove = (platform, index) => {
    if (platform == 0) {
      let newArray = addedTwitch;
      newArray.splice(index, 1);
      setAddedTwitch([...newArray]);
    } else if (platform == 1) {
      let newArray = addedYoutube;
      newArray.splice(index, 1);
      setAddedYoutube([...newArray]);
    } else if (platform == 2) {
      let newArray = addedKick;
      newArray.splice(index, 1);
      setAddedKick([...newArray]);
    }
    
  }

  return (
    <div className="bg-blue-300 text-white h-screen flex flex-col gap-8">
      <div className="m-auto flex flex-col gap-8">
        <form className="flex gap-5">
          <input
            value={userInput}
            onChange={handleUserInput}
            placeholder="Channel"
            className="bg-black p-2"
          />
          <div onClick={addChannel} className="text-white bg-blue-500 p-2 cursor-pointer">add</div>
          {platformSelected}
        </form>
        <div className="w-64 flex gap-2 justify-center">
          <div onClick={() => setPlatformSelected(0)} className={platformSelected == 0 ? "bg-purple-500 p-2 cursor-pointer" : "bg-purple-700 p-2 cursor-pointer text-zinc-300"}>Twitch</div>
          <div onClick={() => setPlatformSelected(1)} className={platformSelected == 1 ? "bg-red-500 p-2 cursor-pointer" : "bg-red-700 p-2 cursor-pointer text-zinc-300"}>Youtube</div>
          <div onClick={() => setPlatformSelected(2)} className={platformSelected == 2 ? "bg-green-500 p-2 cursor-pointer" : "bg-green-700 p-2 cursor-pointer text-zinc-300"}>Kick</div>
        </div>
        <div className="flex">
          <div className="">Twitch: {addedTwitch.map((value, index) => 
            <div className="flex">
              <div className="mr-auto">{value}</div>
              <div onClick={() => handleRemove(0, index)} className="ml-5 text-red-500 font-black text-xl cursor-pointer">x</div>
            </div>
          )}</div>
          <div className="">Youtube: {addedYoutube.map((value, index) => 
            <div className="flex">
              <div className="mr-auto">{value}</div>
              <div onClick={() => handleRemove(1, index)} className="ml-5 text-red-500 font-black text-xl cursor-pointer">x</div>
            </div>
          )}</div>
          <div className="">Kick: {addedKick.map((value, index) => 
            <div className="flex">
              <div className="mr-auto">{value}</div>
              <div onClick={() => handleRemove(2, index)} className="ml-5 text-red-500 font-black text-xl cursor-pointer">x</div>
            </div>
          )}</div>
        </div>
      </div>
    </div>
  );
}