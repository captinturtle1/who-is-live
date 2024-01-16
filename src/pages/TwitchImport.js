import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const appId = "1zhazzeh06yvmnb52iiixw5s8e60qk";

export default function TwitchImport() {
    const [authSuccess, setAuthSuccess] = useState(false);
    const [userFollowers, setUserFollowers] = useState([]);
    const [currentTwitch, setCurrentTwitch] = useState([]);

    useEffect(() => {
        let twitchData = Cookies.get('twitch-list');
        if (twitchData) {
            let twitchCookies = JSON.parse(twitchData);
            setCurrentTwitch([...twitchCookies]);
        }

        if (document.location.hash.includes("access_token")) {
            setAuthSuccess(true);
            let at = document.location.hash.split("=")
            at = at[1].split("&")[0];

            getFollowing(at);
        }
    }, []);

    const getUserId = async (at) => {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + at,
                        'Client-Id': appId
                    }
                };
        
                let response = await fetch(`https://api.twitch.tv/helix/users`, options);
                response = await response.json();
                resolve(response.data[0].id);
            } catch(err) {
                reject(err);
            }
        })
    }

    const getFollowList = async (at, userId, currentList, cursor) => {
        return new Promise (async (resolve, reject) => {
            try {
                let options = {
                    method: "GET",
                    headers: {
                        'Authorization': 'Bearer ' + at,
                        'Client-Id': appId
                    }
                };

                let response;
                if (cursor) {
                    response = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${userId}&first=100&after=${cursor}`, options);
                } else {
                    response = await fetch(`https://api.twitch.tv/helix/channels/followed?user_id=${userId}&first=100`, options);
                }

                response = await response.json();
                for (let i = 0; i < response.data.length; i++) {
                    currentList.push(response.data[i]);
                }

                if (response.pagination.cursor) {
                    await getFollowList(at, userId, currentList, response.pagination.cursor)
                }

                resolve(currentList);
            } catch(err) {
                reject(err);
            }
        })
    }

    const getFollowing = async (at) => {
        let userId = await getUserId(at);
        let following = await getFollowList(at, userId, []);

        let newArray = [];
        for (let i = 0; i < following.length; i++) {
            newArray.push(following[i].broadcaster_login)
        }
        
        setUserFollowers([...newArray]);
    }

    const handleImport = () => {
        let newArray = currentTwitch;

        for (let i = 0; i < userFollowers.length; i++) {
            if (!currentTwitch.includes(userFollowers[i])) newArray.push(userFollowers[i]);
        }

        Cookies.set('twitch-list', JSON.stringify(newArray), { expires: 365 });
        window.location.href = "/";
    }

    const handleRemove = (index) => {
        let newArray = userFollowers;
        newArray.splice(index, 1);
        setUserFollowers([...newArray]);
    }

    return(
        <div className="h-screen bg-slate-800 text-white">
            {authSuccess ? (
                <div className="flex flex-col gap-2">
                    <h1 className="m-auto text-lg font-bold">Channels to import</h1>
                    <h2 className="m-auto">Click to remove</h2>
                    <div className="flex flex-wrap gap-2 mx-64">
                        {userFollowers.map((value, index) => 
                            <div key={value} onClick={() => handleRemove(index)} className="bg-violet-500 hover:bg-violet-600 transition-all rounded cursor-pointer p-2 select-none">{value}</div>
                        )}
                    </div>
                    <div className="flex gap-2 m-auto mt-8">
                        <a href="/" className="bg-blue-500 hover:bg-blue-600 transition-all p-2 rounded">Cancel</a>
                        <button onClick={handleImport} type="button" className="bg-blue-500 hover:bg-blue-600 transition-all p-2 rounded">Import</button>
                    </div>
                </div>
            ):(
                <div className="bg-slate-800 h-screen flex flex-col text-white">
                    <div className="m-auto flex flex-col gap-2">
                        <h1 className="m-auto">Auth Failed :(</h1>
                        <a href="/" className="bg-blue-500 hover:bg-blue-600 transition-all p-2 rounded m-auto">Return Home</a>
                    </div>
                </div>
            )}
        </div>
    );
}