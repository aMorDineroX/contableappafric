import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'  // Modifié ici pour inclure l'extension .tsx
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
