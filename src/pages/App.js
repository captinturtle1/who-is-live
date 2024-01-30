import { useState, useEffect } from "react";

import AddRemove from "../components/AddRemove.js";
import Settings from "../components/Settings.js";

import Button from "../components/Button.js";
import StreamerCard from "../components/StreamerCard.js";


import { BiRefresh } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';
import { FaGithub } from "react-icons/fa";

import ReactGA from "react-ga4";
const TRACKING_ID = "G-WXSX7SL0MF";
ReactGA.initialize(TRACKING_ID);

export default function App() {
  const [twitchList, setTwitchList] = useState([]);
  const [youtubeList, setYoutubeList] = useState([]);
  const [kickList, setKickList] = useState([]);

  const [isAddRemoveOpen, setIsAddRemoveOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [allLive, setAllLive] = useState([]);
  const [allData, setAllData] = useState([]);

  const [fetching, setFetching] = useState(false);

  const [displayOffline, setDisplayOffline] = useState(true);
  const [displayThumbnails, setDisplayThumbnails] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const [firstTime, setFirstTime] = useState(false);
  
  useEffect(() => {
    getStorage();
    ReactGA.send({ hitType: "pageview", page: "/", title: "Home" });
  }, [])

  const setLists = (newData) => {
    setTwitchList([...newData[0]]);
    setYoutubeList([...newData[1]]);
    setKickList([...newData[2]]);
    setStorage(newData);
    setFirstTime(false);
  }

  const setStorage = (newData) => {
    let twitchData = JSON.stringify(newData[0]);
    let youtubeData = JSON.stringify(newData[1]);
    let kickData = JSON.stringify(newData[2]);
    localStorage.setItem('twitch-list', twitchData);
    localStorage.setItem('youtube-list', youtubeData);
    localStorage.setItem('kick-list', kickData);
    retrieveStreamData(newData[0], newData[1], newData[2]);
  }

  // 0 = displayOffline, 1 = displayThumbnails, 2 = darkMode
  const setOptionsStorage = (update, option) => {
    let optionsObject = {
      displayOffline: option == 0 ? update : displayOffline,
      displayThumbnails: option == 1 ? update : displayThumbnails,
      darkMode: option == 2 ? update : darkMode,
    };

    let optionsString = JSON.stringify(optionsObject);

    localStorage.setItem('user-settings', optionsString)
  }

  const handleToggleViewOffline = () => {
    setDisplayOffline(!displayOffline);
    setOptionsStorage(!displayOffline, 0);
  }

  const handleThumbnailToggle = () => {
    setDisplayThumbnails(!displayThumbnails);
    setOptionsStorage(!displayThumbnails, 1);
  }

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    setOptionsStorage(!darkMode, 2);
  }

  const getStorage = () => {
    let twitchData = localStorage.getItem('twitch-list');
    let youtubeData = localStorage.getItem('youtube-list');
    let kickData = localStorage.getItem('kick-list');
    let optionsData = localStorage.getItem('user-settings');

    if (twitchData || youtubeData || kickData) {
      setFirstTime(false);
    } else {
      setFirstTime(true);
    }

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
      setDisplayThumbnails(optionsData.displayThumbnails);
      setDarkMode(optionsData.darkMode);
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
      fetch('https://twitch.api.isanyone.live/', {
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
      fetch('https://youtube.api.isanyone.live/', {
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
      fetch('https://kick.api.isanyone.live/', {
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
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-slate-800 text-white' : 'bg-zinc-200 text-black'} p-8 transition-all`}>
      <div className="mx-auto flex flex-col">
        <h1 className="text-lg lg:text-5xl font-bold">IS ANYONE LIVE?</h1>
        <div className="m-auto flex gap-2">
          <h2 className="m-auto">made by <a href="https://twitter.com/captinturt1e" target="_blank" className={`${darkMode ? 'text-blue-200 hover:text-blue-300' : 'text-blue-800 hover:text-blue-900'} transition-all`}>captinturtle</a></h2>
          <a className="mt-[6px] text-white hover:text-gray-200 transition-all" target="_blank" href="https://github.com/captinturtle1/who-is-live"><FaGithub/></a>
        </div>
      </div>
      {firstTime ? 
        <div className="flex flex-col m-auto">
          <h1 className="m-atuo text-2xl font-bold">First time?</h1>
          <Button
            doOnClick={() => setIsAddRemoveOpen(true)}
            displayText={'Get started!'}
          />
        </div>
      : 
        <>
          <div className="flex mx-auto gap-4 my-4">
            <Button
              doOnClick={() => setIsAddRemoveOpen(true)}
              displayText={'Edit'}
            />
            <button
              onClick={fetching ? null : () => retrieveStreamData(twitchList, youtubeList, kickList)}
              className={`x-auto p-2 text-white ${fetching ? "bg-gray-500 cursor-default" : "bg-blue-500 hover:bg-blue-600"} transition-all rounded my-2 text-2xl`}
            >
                <BiRefresh className={fetching ? "animate-reverse-spin" : ""}/>
            </button>
            <Button
              doOnClick={() => setIsSettingsOpen(true)}
              displayText={'Settings'}
            />
          </div>
          <div className="gap-8 flex">
            <div className={`grid w-screen xl:px-[10vw] grid-cols-1 ${displayThumbnails ? 'lg:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-5 3xl:grid-cols-7'} gap-4`}>
              {displayOffline ?
                <>
                  {allData.map(dataObject =>
                    <StreamerCard
                      key={dataObject.name + dataObject.platform}
                      dataObject={dataObject}
                      displayThumbnails={displayThumbnails}
                      darkMode={darkMode}
                    />
                  )}
                </>
              : 
                <>
                  {allLive.map(dataObject =>
                    <StreamerCard
                      key={dataObject.name + dataObject.platform}
                      dataObject={dataObject}
                      displayThumbnails={displayThumbnails}
                      darkMode={darkMode}
                    />
                  )}
                </>
              }
              {fetching ? (
                <ImSpinner2 className={`m-auto text-3xl my-5 animate-spin ${displayThumbnails ? "lg:col-span-3" : "md:col-span-3 lg:col-span-5 3xl:col-span-7"}`}/>
              ) : ( 
                <a
                  href="https://play.google.com/store/apps/details?id=com.who_is_live_app"
                  target="_blank"
                  className={`m-auto text my-5 hover:text-zinc-200 transition-all ${displayThumbnails ? "lg:col-span-3" : "md:col-span-3 lg:col-span-5 3xl:col-span-7"}`}
                >
                  Download the Android app!
                </a>
              )}
              
            </div>
          </div>

          

        </>
      }

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
          {isSettingsOpen ?
            <Settings
              setIsSettingsOpen={setIsSettingsOpen}
              handleToggleViewOffline={handleToggleViewOffline}
              displayOffline={displayOffline}
              handleThumbnailToggle={handleThumbnailToggle}
              displayThumbnails={displayThumbnails}
              handleToggleDarkMode={handleToggleDarkMode}
              darkMode={darkMode}
            /> 
          : 
            <></>
          }
        </div>
    </div>
  )
}