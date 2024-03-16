import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("main.jsx ran")
let guestId = localStorage.getItem("guestId")
console.log("Stored guestId: " + guestId)

let needsNewId = true
if (guestId != null) {
    const response = await fetch(`/backend/Users/ValidateGuestId?guestId=${guestId}`)
    if (response.ok) {
        needsNewId = false
    }
}

if (needsNewId) {        
    const response = await fetch("/backend/Users/RequestGuestId")
    let json = await response.json()
    guestId = json.guestId;

    //TODO: Error handling page
}

localStorage.setItem("guestId", guestId)
console.log(`Validated Guest Id: ${guestId}`)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
