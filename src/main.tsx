import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

if (import.meta.env.DEV) {
  console.debug = console.log
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
