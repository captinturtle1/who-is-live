import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AddRemove from "./AddRemove.js";

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);

  useEffect(() => {
    getCookies();
  }, [])

  const setLists = (newData) => {
    setTwitchList([...newData[0]]);
    setYoutubeList([...newData[1]]);
    setKickList([...newData[2]]);
    setCookies(newData)
  }

  const setCookies = (newData) => {
    let twitchData = JSON.stringify(newData[0]);
    let youtubeData = JSON.stringify(newData[1]);
    let kickData = JSON.stringify(newData[2]);
    Cookies.set('twitch-list', twitchData, { expires: 7 });
    Cookies.set('youtube-list', youtubeData, { expires: 7 });
    Cookies.set('kick-list', kickData, { expires: 7 });
  }

  const getCookies = () => {
    let twitchData = Cookies.get('twitch-list');
    let youtubeData = Cookies.get('youtube-list');
    let kickData = Cookies.get('kick-list');
    if (twitchData) setTwitchList([...JSON.parse(twitchData)]);
    if (youtubeData) setYoutubeList([...JSON.parse(youtubeData)]);
    if (kickData) setKickList([...JSON.parse(kickData)]);
  }

  return (
    <div className="h-screen flex flex-col bg-slate-800">
      <button onClick={() => setIsAddRemoveOpen(true)} className="mx-auto p-2 text-white bg-blue-500 rounded-lg my-5">Edit</button>
      <div>
        {isAddRemoveOpen ?
          <AddRemove
            setIsAddRemoveOpen={setIsAddRemoveOpen}
            setLists={setLists}
            currentLists={[twitchList, youtubeList, kickList]}
          /> 
        : 
          <></>
        }
      </div>
      <div className="text-white flex gap-8">
        <div className="flex flex-col">
          {twitchList.map(name =>
            <div>{name}</div>
          )}
        </div>
        <div className="flex flex-col">
          {youtubeList.map(name =>
            <div>{name}</div>
          )}
        </div>
        <div className="flex flex-col">
          {kickList.map(name =>
            <div>{name}</div>
          )}
        </div>
      </div>
    </div>
  )
}