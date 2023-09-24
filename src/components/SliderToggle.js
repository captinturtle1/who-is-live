export default function SliderToggle({toggleFunction, state, displayText}) {
    return (
        <div>
            <h2 className="mx-auto font-bold mt-5">{displayText}</h2>
            <div onClick={toggleFunction} className={state ? 
              "w-12 h-6 bg-blue-500 flex mx-auto mt-2 rounded-full cursor-pointer" : 
              "w-12 h-6 bg-red-400 flex mx-auto mt-2 rounded-full cursor-pointer"}
            >
              <div className={state ? "flex-grow transition-all" : "transition-all"}/>
              <div className="bg-white transition-all rounded-full w-6 h-6"/>
            </div>
        </div>
    )
}