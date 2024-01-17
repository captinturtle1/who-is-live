import SliderToggle from "./SliderToggle";

export default function Settings({
        setIsSettingsOpen,
        handleToggleViewOffline,
        displayOffline,
        handleThumbnailToggle,
        displayThumbnails,
        handleToggleDarkMode,
        darkMode
}) {
    const onClickStopPropagation = (e) => {
        e.stopPropagation();
    }

    return (
      <div onClick={() => setIsSettingsOpen(false)} className="fixed left-0 right-0 top-0 bottom-0 flex gap-8 bg-black backdrop-blur bg-opacity-10 text-white p-8 lg:p-16">
        <div onClick={(e) => onClickStopPropagation(e)} className="flex flex-col gap-4 bg-slate-600 rounded m-auto p-8 lg:p-16 max-w-[800px]">
          <h1 className="mx-auto font-bold text-xl">Settings</h1>
          <div className="grid grid-cols-2 gap-6">
            <SliderToggle
              toggleFunction={handleToggleViewOffline}
              state={displayOffline}
              displayText={'Display Offline'}
            />
            <SliderToggle
              toggleFunction={handleThumbnailToggle}
              state={!displayThumbnails}
              displayText={'Simple View'}
            />
            <SliderToggle
              toggleFunction={handleToggleDarkMode}
              state={darkMode}
              displayText={'Dark mode'}
            />
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className='m-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-5'>Close</button>
        </div>
      </div>
    );
}