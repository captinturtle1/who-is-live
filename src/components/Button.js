export default function Button({doOnClick, displayText}) {
    return (
        <button onClick={doOnClick} className={`x-auto p-2 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded my-2`}>{displayText}</button>
    )
}