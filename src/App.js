import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AddRemove from "./AddRemove.js";
import Help from "./Help.js";

import { MdVerified } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';

// 0 = twitch, 1 = youtube, 2 = kick
const StreamerCard = ({dataObject, platform}) => {
  return(
    <a 
      href={platform == 0 ? 
        `https://twitch.tv/${dataObject.name}` : platform == 1 ? 
        `https://youtube.com/@${dataObject.name}` : 
        `https://kick.com/${dataObject.name}`} 
      className="flex bg-blue-500 max-w-[500px] p-2 rounded gap-2 shadow hover:-translate-y-1 transition-all"
    >
      <img src={dataObject.profileImageURL} className="w-24 h-24 rounded-full"/>
      <div>
        <h1 className="font-bold text-xl flex gap-2">{dataObject.displayName}<span className="my-auto mr-auto">{dataObject.verified ? <MdVerified/> : <></>}</span></h1>
        <div className="flex">
          <div className="my-auto w-3 h-3 bg-red-500 rounded-full"></div>
          <h2>{dataObject.viewers}</h2>
        </div>
        <h3 className="text-xs wrap">{dataObject.streamTitle}</h3>
      </div>
    </a>
  )
}

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [twitchLive, setTwitchLive] = useState([]);
  const [youtubeLive, setYoutubeLive] = useState([]);
  const [kickLive, setKickLive] = useState([]);

  const [allLive, setAllLive] = useState([]);

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
    retrieveStreamData(newData[0], newData[1], newData[2]);
  }

  const getCookies = () => {
    let twitchData = Cookies.get('twitch-list');
    let youtubeData = Cookies.get('youtube-list');
    let kickData = Cookies.get('kick-list');
    if (twitchData) {
      twitchData = JSON.parse(twitchData);
      setTwitchList([...twitchData]);
    } else {
      twitchData = [];
    }
    if (youtubeData) {
      youtubeData = JSON.parse(youtubeData);
      setYoutubeList([...youtubeData]);
    } else {
      youtubeData = [];
    }
    if (kickData) {
      kickData = JSON.parse(kickData);
      setKickList([...kickData]);
    } else {
      kickData = [];
    }
    retrieveStreamData(twitchData, youtubeData, kickData);
  }

  const retrieveStreamData = (twitchData, youtubeData, kickData) => {
    let newAllLive = [];
    // getting twitch data
    if (twitchData.length > 0) {
      fetch('https://api.isanyone.live/twitch', {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(twitchData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        let liveOnly = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].live) {
            liveOnly.push(data[i]);
            newAllLive.push(data[i]);
          }
        }
        setTwitchLive([...liveOnly]);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllLive([...newAllLive]);
      })
      .catch(console.log)
    }

    // getting youtube data
    if (youtubeData.length > 0) {
      fetch('https://api.isanyone.live/youtube', {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(youtubeData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        let liveOnly = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].live) {
            liveOnly.push(data[i]);
            newAllLive.push(data[i]);
          }
        }
        setYoutubeLive([...liveOnly]);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllLive([...newAllLive]);
      })
      .catch(console.log)
    }

    // getting kick data
    if (kickData.length > 0) {
      fetch('https://api.isanyone.live/kick', {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(kickData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        let liveOnly = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].live) {
            liveOnly.push(data[i]);
            newAllLive.push(data[i]);
          }
        }
        setKickLive([...liveOnly]);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllLive([...newAllLive]);
      })
      .catch(console.log)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-800 p-8">
      <div className="flex mx-auto gap-4">
        <button onClick={() => setIsAddRemoveOpen(true)} className="mx-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-2">Edit</button>
        <button onClick={() => retrieveStreamData(twitchList, youtubeList, kickList)} className="mx-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-2 text-2xl"><BiRefresh/></button>
        <button onClick={() => setIsHelpOpen(true)} className="mx-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-2">Help</button>
      </div>
      <div className="mx-auto flex flex-col text-zinc-100 my-8">
        <h1 className="text-5xl font-bold">WHO IS LIVE?</h1>
        <h2 className="m-auto">made by <a href="https://twitter.com/captinturt1e" className="text-blue-200 hover:text-blue-300 transition-all">captinturtle</a></h2>
      </div>
      <div className="mx-auto text-white gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {allLive.map(dataObject =>
            <StreamerCard
              key={dataObject.name}
              dataObject={dataObject}
              platform={0}
            />
          )}
        </div>
      </div>

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

      <div>
        {isHelpOpen ?
          <Help
            setIsHelpOpen={setIsHelpOpen}
          /> 
        : 
          <></>
        }
      </div>
    </div>
  )
}