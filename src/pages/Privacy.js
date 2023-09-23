const policy = `
Is Anyone Live does not collect or store any user data.
All channels added by the user are stored on the users device.
Lists of channels added by the users are sent to a server to get information on provided channel lists, and results are sent back to the users device.
nothing is stored on a database.
`

export default function Privacy() {
  return (
    <div className="h-screen flex bg-slate-800">
        <p className="m-auto text-white max-w-[500px] text-center">{policy}</p>
    </div>
  );
}