import './App.css'
import './bootstrap-grid.min.scss'
import {HashRouter, Routes, Route} from "react-router-dom";
import NewGame from './new-game/new-game'
import StartingScreen from "./starting-screen/starting-screen.tsx";
import AgentHome from "./agent/agent-home.tsx";
import LoadGame from "./starting-screen/load-game.tsx";

function App() {
  return (
      <HashRouter>
          <Routes>
              <Route path="/" element={<StartingScreen />}/>
              <Route path="/load-game" element={<LoadGame />}/>
              <Route path="/new-game" element={<NewGame />}/>
              <Route path="/agent" element={<AgentHome />}/>
          </Routes>
      </HashRouter>
  )
}

export default App
