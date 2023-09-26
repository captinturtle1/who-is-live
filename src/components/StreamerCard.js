import { MdVerified } from 'react-icons/md';
import { BsTwitch, BsYoutube } from 'react-icons/bs';
import { RiKickFill } from 'react-icons/ri';

// dataObject.platform: 0 = twitch, 1 = youtube, 2 = kick
export default function StreamerCard({dataObject, displayThumbnails, darkMode}) {

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
        className={`${darkMode ? 'bg-blue-500' : 'bg-white'} p-2 h-fit rounded gap-2 flex flex-col shadow hover:-translate-y-1 transition-all`}
      >
        <div className="flex gap-2">
          <img src={dataObject.profileImageURL} className={dataObject.live ? "w-12 h-12 lg:w-24 lg:h-24 rounded-full" : "w-12 h-12 lg:w-24 lg:h-24 rounded-full"}/>
          <div className='min-w-0'>
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
                <h3 className="text-xs wrap font-bold mb-1 break-words">{dataObject.streamTitle}</h3>
                {dataObject.platform != 1 ? <h3 className="text-xs wrap">{calculateTime(dataObject.streamStartTime)}</h3> : <></>}
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