import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AddRemove from "./AddRemove.js";
import Help from "./Help.js";

import { MdVerified } from 'react-icons/md';
import { BiRefresh } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import { RiKickFill } from 'react-icons/ri';

let apiURL = '';
if (process.env.NODE_ENV == 'production') {
  apiURL = 'https://api.isanyone.live';
} else {
  apiURL = 'https://api.isanyone.live';
}

// 0 = twitch, 1 = youtube, 2 = kick
const StreamerCard = ({dataObject, displayThumbnails}) => {
  return(
    <a 
      href={dataObject.streamURL}
      target="_blank"
      className="bg-blue-500 p-2 rounded gap-2 flex flex-col shadow hover:-translate-y-1 transition-all"
    >
      <div className="flex gap-2">
      <img src={dataObject.profileImageURL} className={dataObject.live ? "w-12 h-12 lg:w-24 lg:h-24 rounded-full" : "w-12 h-12 lg:w-24 lg:h-24 rounded-full grayscale"}/>
      <div>
        <h1 className="font-bold text-lg lg:text-xl flex gap-2">{dataObject.displayName}
          <span className="mt-2 mr-auto flex gap-2">
            {dataObject.verified ? <MdVerified/> : <></>}
            {dataObject.platform == 0 ? <BsTwitch/> : dataObject.platform == 1 ? <BsYoutube/> : <RiKickFill/>}</span>
        </h1>
        {dataObject.live ? 
          <>
            <div className="flex gap-1">
              <div className="mt-2 w-3 h-3 bg-red-500 rounded-full"></div>
              <h2>{dataObject.viewers}</h2>
              {dataObject.catagory ? (<h2>• {dataObject.catagory}</h2>):(<></>)}
              
            </div>
            <h3 className="text-xs wrap font-bold">{dataObject.streamTitle}</h3>
          </>
        :
          <>
            <h2>Offline</h2>
          </>
        }
      </div>
      </div>
      {displayThumbnails ? <img className="rounded" src={dataObject.streamThumbnail}/> : <></>}
    </a>
  )
}

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const [allLive, setAllLive] = useState([]);
  const [allData, setAllData] = useState([]);

  const [fetching, setFetching] = useState(false);

  const [displayOffline, setDisplayOffline] = useState(true);
  const [displayThumbnails, setDisplayThumbnails] = useState(true);
  
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
    Cookies.set('twitch-list', twitchData, { expires: 365 });
    Cookies.set('youtube-list', youtubeData, { expires: 365 });
    Cookies.set('kick-list', kickData, { expires: 365 });
    retrieveStreamData(newData[0], newData[1], newData[2]);
  }

  const setOptionsCookie = (optionsObject) => {
    let optionsString = JSON.stringify(optionsObject);

    Cookies.set('user-settings', optionsString, { expires: 365 })
  }

  const handleToggleViewOffline = () => {
    let optionsObject = {
      displayOffline: !displayOffline,
      displayThumbnails: displayThumbnails
    };

    setDisplayOffline(!displayOffline);
    setOptionsCookie(optionsObject);
  }

  const handleThumbnailToggle = () => {
    let optionsObject = {
      displayOffline: displayOffline,
      displayThumbnails: !displayThumbnails
    };

    setDisplayThumbnails(!displayThumbnails);
    setOptionsCookie(optionsObject);
  }

  const getCookies = () => {
    let twitchData = Cookies.get('twitch-list');
    let youtubeData = Cookies.get('youtube-list');
    let kickData = Cookies.get('kick-list');
    let optionsData = Cookies.get('user-settings');
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

    if (optionsData) {
      optionsData = JSON.parse(optionsData);
      setDisplayOffline(optionsData.displayOffline);
    }
    retrieveStreamData(twitchData, youtubeData, kickData);
  }

  const retrieveStreamData = (twitchData, youtubeData, kickData) => {
    let fetchingTwitch = false;
    let fetchingYoutube = false;
    let fetchingKick = false;

    let newAllLive = [];
    let newAllData = [];
    setAllData([...newAllData]);
    setAllLive([...newAllLive]);
    // getting twitch data
    if (twitchData.length > 0) {
      setFetching(true);
      fetchingTwitch = true;
      fetch(`${apiURL}/twitch`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(twitchData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.body;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 0;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a, b) => b.viewers - a.viewers);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingTwitch = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingTwitch = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
    }

    // getting youtube data
    if (youtubeData.length > 0) {
      setFetching(true);
      fetchingYoutube = true;
      fetch(`${apiURL}/youtube`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(youtubeData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.body;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 1;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a, b) => b.viewers - a.viewers);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingYoutube = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingYoutube = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
    }

    // getting kick data
    if (kickData.length > 0) {
      setFetching(true);
      fetchingKick = true;
      fetch(`${apiURL}/kick`, {
        mode: 'cors',
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(kickData)
      })
      .then(response => response.json())
      .then(data => {
        data = data.body;
        for (let i = 0; i < data.length; i++) {
          data[i].platform = 2;
          newAllData.push(data[i]);
          if (data[i].live) newAllLive.push(data[i]);
        }
        newAllData.sort((a, b) => b.viewers - a.viewers);
        newAllLive.sort((a, b) => b.viewers - a.viewers);
        setAllData([...newAllData]);
        setAllLive([...newAllLive]);
        fetchingKick = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
      .catch(err => {
        console.log(err);
        fetchingKick = false;
        if (!fetchingTwitch && !fetchingYoutube && !fetchingKick) {
          setFetching(false);
        }
      })
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
        <h1 className="text-lg lg:text-5xl font-bold">IS ANYONE LIVE?</h1>
        <h2 className="m-auto">made by <a href="https://twitter.com/captinturt1e" target="_blank" className="text-blue-200 hover:text-blue-300 transition-all">captinturtle</a></h2>
      </div>
      <div className="text-white gap-8 flex">
        <div className="grid w-screen xl:px-[10vw] grid-cols-1 lg:grid-cols-3 gap-4">
          {displayOffline ?
            <>
              {allData.map(dataObject =>
                <StreamerCard
                  key={dataObject.name}
                  dataObject={dataObject}
                  displayThumbnails={displayThumbnails}
                />
              )}
            </>
          : 
            <>
              {allLive.map(dataObject =>
                <StreamerCard
                  key={dataObject.name}
                  dataObject={dataObject}
                  displayThumbnails={displayThumbnails}
                />
              )}
            </>
          }
          {fetching ? <ImSpinner2 className="m-auto text-3xl my-5 animate-spin col-span-3"/> : <></>}
        </div>
      </div>
      <div className="flex mx-auto gap-8">
        <div>
          <h2 className="mx-auto text-white font-bold mt-5">Display Offline</h2>
          <div onClick={handleToggleViewOffline} className={displayOffline ? 
            "w-12 h-6 bg-blue-500 flex mx-auto mt-2 rounded-full cursor-pointer" : 
            "w-12 h-6 bg-red-400 flex mx-auto mt-2 rounded-full cursor-pointer"}
          >
            <div className={displayOffline ? "flex-grow transition-all" : "transition-all"}/>
            <div className="text-white bg-white transition-all rounded-full w-6 h-6"/>
          </div>
        </div>
        <div>
          <h2 className="mx-auto text-white font-bold mt-5">Display Thumbnails</h2>
          <div onClick={handleThumbnailToggle} className={displayThumbnails ? 
            "w-12 h-6 bg-blue-500 flex mx-auto mt-2 rounded-full cursor-pointer" : 
            "w-12 h-6 bg-red-400 flex mx-auto mt-2 rounded-full cursor-pointer"}
          >
            <div className={displayThumbnails ? "flex-grow transition-all" : "transition-all"}/>
            <div className="text-white bg-white transition-all rounded-full w-6 h-6"/>
          </div>
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