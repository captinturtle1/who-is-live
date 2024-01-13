import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import AddRemove from "../components/AddRemove.js";
import Help from "../components/Help.js";
import SliderToggle from "../components/SliderToggle.js";
import Button from "../components/Button.js";
import StreamerCard from "../components/StreamerCard.js";


import { BiRefresh } from 'react-icons/bi';
import { ImSpinner2 } from 'react-icons/im';

import ReactGA from 'react-ga';
const TRACKING_ID = "G-WXSX7SL0MF";
ReactGA.initialize(TRACKING_ID);

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
  const [darkMode, setDarkMode] = useState(true);
  
  useEffect(() => {
    getCookies();
    console.log(window.location.pathname + window.location.search)
    ReactGA.pageview(window.location.pathname + window.location.search);
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

  // 0 = displayOffline, 1 = displayThumbnails, 2 = darkMode
  const setOptionsCookie = (update, option) => {
    let optionsObject = {
      displayOffline: option == 0 ? update : displayOffline,
      displayThumbnails: option == 1 ? update : displayThumbnails,
      darkMode: option == 2 ? update : darkMode,
    };

    let optionsString = JSON.stringify(optionsObject);

    Cookies.set('user-settings', optionsString, { expires: 365 })
  }

  const handleToggleViewOffline = () => {
    setDisplayOffline(!displayOffline);
    setOptionsCookie(!displayOffline, 0);
  }

  const handleThumbnailToggle = () => {
    setDisplayThumbnails(!displayThumbnails);
    setOptionsCookie(!displayThumbnails, 1);
  }

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    setOptionsCookie(!darkMode, 2);
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
        <h2 className="m-auto">made by <a href="https://twitter.com/captinturt1e" target="_blank" className={`${darkMode ? 'text-blue-200 hover:text-blue-300' : 'text-blue-800 hover:text-blue-900'} transition-all`}>captinturtle</a></h2>
      </div>
      <div className="flex mx-auto gap-4 my-4">
        <Button
          doOnClick={() => setIsAddRemoveOpen(true)}
          displayText={'Edit'}
        />
        <Button
          doOnClick={() => retrieveStreamData(twitchList, youtubeList, kickList)}
          displayText={<BiRefresh className="text-2xl"/>}
        />
        <Button
          doOnClick={() => setIsHelpOpen(true)}
          displayText={'Help'}
        />
      </div>
      <div className="gap-8 flex">
        <div className="grid w-screen xl:px-[10vw] grid-cols-1 lg:grid-cols-3 gap-4">
          {displayOffline ?
            <>
              {allData.map(dataObject =>
                <StreamerCard
                  key={dataObject.name}
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
                  key={dataObject.name}
                  key={dataObject.name + dataObject.platform}
                  dataObject={dataObject}
                  displayThumbnails={displayThumbnails}
                  darkMode={darkMode}
                />
              )}
            </>
          }
          {fetching ? <ImSpinner2 className="m-auto text-3xl my-5 animate-spin lg:col-span-3"/> : <></>}
        </div>
      </div>
      <div className="flex mx-auto gap-8">
          <SliderToggle
            toggleFunction={handleToggleViewOffline}
            state={displayOffline}
            displayText={'Display Offline'}
          />
          <SliderToggle
            toggleFunction={handleThumbnailToggle}
            state={displayThumbnails}
            displayText={'Display Previews'}
          />
          <SliderToggle
            toggleFunction={handleToggleDarkMode}
            state={darkMode}
            displayText={'Dark mode'}
          />
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