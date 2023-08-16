import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AddRemove from "./AddRemove.js";

// 0 = twitch, 1 = youtube, 2 = kick
const StreamerCard = ({name, displayName, viewers, imageUrl, platform}) => {
  return(
    <a 
      href={platform == 0 ? 
        `https://twitch.tv/${name}` : platform == 1 ? 
        `https://youtube.com/@${name}` : 
        `https://kick.com/${name}`} 
      className="flex bg-blue-500 p-2 rounded-xl gap-4"
    >
      <img src={imageUrl} className="w-24 h-24 rounded-full"/>
      <div>
        <h1 className="font-bold text-xl">{displayName}</h1>
        <div className="flex">
          <div className="my-auto w-3 h-3 bg-red-500 rounded-full"></div>
          <h2>{viewers}</h2>
        </div>
      </div>
    </a>
  )
}

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);

  const [twitchLive, setTwitchLive] = useState([]);
  const [youtubeLive, setYoutubeLive] = useState([]);
  const [kickLive, setKickLive] = useState([]);

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

  const retrieveStreamData = () => {
    // getting twitch data
    if (twitchList.length > 0) {
      fetch('http://localhost:1337/twitch', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(twitchList)
      })
      .then(response => response.json())
      .then(data => {
        data = data.info;
        let liveOnly = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].live) {
            liveOnly.push(data[i]);
          }
        }
        setTwitchLive([...liveOnly])
      })
      .catch(console.log)
    }

    // getting youtube data
    fetch('http://localhost:1337/youtube', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(youtubeList)
    })
    .then(response => response.json())
    .then(data => {
      data = data.info;
      let liveOnly = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].live) {
          liveOnly.push(data[i]);
        }
      }
      setYoutubeLive([...liveOnly]);
    })
    .catch(console.log)

    // getting kick data
    fetch('http://localhost:1337/kick', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(kickList)
    })
    .then(response => response.json())
    .then(data => {
      data = data.info;
      let liveOnly = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].live) {
          liveOnly.push(data[i]);
        }
      }
      setKickLive([...liveOnly]);
    })
    .catch(console.log)
  }

  return (
    <div className="h-screen flex flex-col bg-slate-800">
      <div className="flex mx-auto gap-4">
        <button onClick={() => setIsAddRemoveOpen(true)} className="mx-auto p-2 text-white bg-blue-500 rounded-lg my-2">Edit</button>
        <button onClick={retrieveStreamData} className="mx-auto p-2 text-white bg-blue-500 rounded-lg my-2">Fetch</button>
      </div>
      <h1 className="text-white mx-auto text-5xl font-bold">WHO IS LIVE?</h1>
      <div className="mx-auto text-white flex flex-col gap-8">
        <div className="flex flex-col gap-8">
          {twitchLive.map(dataObject =>
            <StreamerCard
              name={dataObject.name}
              displayName={dataObject.displayName}
              viewers={dataObject.viewers}
              imageUrl={dataObject.profileImageURL}
              platform={0}
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {youtubeLive.map(dataObject =>
            <StreamerCard
              name={dataObject.name}
              displayName={dataObject.displayName}
              viewers={dataObject.viewers}
              imageUrl={dataObject.profileImageURL}
              platform={1}
            />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {kickLive.map(dataObject =>
            <StreamerCard
              name={dataObject.name}
              displayName={dataObject.displayName}
              viewers={dataObject.viewers}
              imageUrl={dataObject.imageURL}
              platform={2}
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
    </div>
  )
}