import { WebContainerProvider } from './support/WebContainer'
import { Terminal } from './components/Terminal'
import 'xterm/css/xterm.css'
import './App.css'

function App() {
  return (
    <WebContainerProvider>
      <div className="App">
        <Terminal />
      </div>
    </WebContainerProvider>
  )
}

export default App
