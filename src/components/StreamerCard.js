import { MdVerified } from 'react-icons/md';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import { RiKickFill } from 'react-icons/ri';
import { useState } from 'react';

// dataObject.platform: 0 = twitch, 1 = youtube, 2 = kick
export default function StreamerCard({dataObject, displayThumbnails, darkMode}) {
    const [hover, setHover] = useState(false);

    const calculateTime = (startedAt) => {
      let now = Date.now() / 1000;
      let elapsedTime = Math.round(now - startedAt);
      let date = new Date(null);
      date.setSeconds(elapsedTime);
      return date.toISOString().slice(11, 19);
    }
  
    return(
      <a 
        href={dataObject.streamURL}
        target="_blank"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`${darkMode ? (dataObject.live ? 'bg-blue-500' : 'bg-gray-500') : (dataObject.live ? 'bg-white' : 'bg-gray-400')} ${displayThumbnails ? "p-2" : "p-1"} h-fit rounded gap-2 flex flex-col shadow hover:-translate-y-1 transition-all`}
      >
        {!displayThumbnails ? dataObject.live ? hover ? 
          <div className='fixed bg-gray-500 bg-opacity-50 p-2 backdrop-blur rounded -translate-x-1 -translate-y-1 w-full min-h-full animate-display-delay'>
            <h3 className='font-bold'>{dataObject.catagory}</h3>
            <p className='text-sm break-words'>{dataObject.streamTitle}</p>
          </div> : <></> : <></> : <></>
        }
          <div className="flex gap-2">
            <img src={dataObject.profileImageURL} className={displayThumbnails ? `w-12 h-12 lg:w-24 lg:h-24 rounded-full` : `w-16 h-16 rounded-full`}/>
            <div className='min-w-0'>
              <h1 className={`font-bold text-lg ${displayThumbnails ? "lg:text-xl" : "lg:text-base"} flex ${displayThumbnails ? "gap-2" : "gap-1"} overflow-hidden`}>{dataObject.displayName}
                <span className="mt-2 mr-auto flex gap-2">
                  {displayThumbnails ? dataObject.verified ? <MdVerified/> : <></> : <></>}
                  {dataObject.platform == 0 ? <BsTwitch/> : dataObject.platform == 1 ? <BsYoutube/> : <RiKickFill/>}</span>
              </h1>
              {dataObject.live ? 
                <>
                  <div className="flex gap-1">
                    <div className="mt-2 w-3 h-3 bg-red-500 rounded-full"></div>
                    <h2>{dataObject.viewers}</h2>
                    {dataObject.catagory ? displayThumbnails ? <h2>• {dataObject.catagory}</h2> : <></> : <></>}
                  </div>
                  {displayThumbnails ? <h3 className="text-xs wrap font-bold mb-1 break-words">{dataObject.streamTitle}</h3> : <></>}
                  {dataObject.platform != 1 ? displayThumbnails ? <h3 className="text-xs wrap">{calculateTime(dataObject.streamStartTime)}</h3> : <></> : <></>}
                </>
              :
                <>
                  <h2>Offline</h2>
                </>
              }
            </div>
          </div>
        {displayThumbnails ? (dataObject.streamThumbnail ? <img className="rounded" src={dataObject.streamThumbnail + '?' + new Date().getTime()}/> : <></>) : <></>}
      </a>
    )
  }