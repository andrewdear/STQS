import './App.css'
import './bootstrap-grid.min.scss'
import {HashRouter, Routes, Route} from "react-router-dom";
import NewGame from './new-game/new-game'
import StartingScreen from "./starting-screen/starting-screen.tsx";
import AgentHome from "./agent/agent-home.tsx";

function App() {
  return (
      <HashRouter>
          <Routes>
              <Route path="/" element={<StartingScreen />}/>
              {/*<Route path="/introduction" element={<NewGame />}/>*/}
              <Route path="/new-game" element={<NewGame />}/>
              <Route path="/agent" element={<AgentHome />}/>
          </Routes>
      </HashRouter>
  )
}

export default App
