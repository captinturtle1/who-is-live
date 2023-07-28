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
        <div>
          <div>Twitch: {addedTwitch}</div>
          <div>Youtube: {addedYoutube}</div>
          <div>Kick: {addedKick}</div>
        </div>
      </div>
    </div>
  );
}