export default function AddRemove({setIsHelpOpen}) {

  const onClickStopPropagation = (e) => {
    e.stopPropagation();
  }

  return (
    <div onClick={() => setIsHelpOpen(false)} className="fixed left-0 right-0 top-0 bottom-0 flex gap-8 bg-black backdrop-blur bg-opacity-10 text-white p-16">
      <div onClick={(e) => onClickStopPropagation(e)} className="flex flex-col gap-4 bg-slate-600 rounded m-auto p-16 max-w-[800px]">
        <h1 className="mx-auto font-bold text-xl">What is this?</h1>
        <p>This is a simple tool to view channels that are live across Twitch, Youtube, and Kick</p>
        <p>To get started, hit "Edit" and enter a channel username. For Youtube, get the channel handle without the @.</p>
        <p>Select the platform icon for whichever platform the channel you are adding is on and hit "Add".</p>
        <p>Save the changes and the website will automatically pull the stream information and display the channel only if it is live.</p>
        <button onClick={() => setIsHelpOpen(false)} className='m-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-5'>Close</button>
      </div>
    </div>
  );
}