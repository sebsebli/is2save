import ScenarioEditor from "./pages/ScenarioEditor";
import {
  Alignment,
  Button,
  Classes,
  H5,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  HotkeysProvider
} from "@blueprintjs/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import NavBar from "./components/NavBar";
import defaultScenario from './assets/defaultScenario.json'

import { store, useGlobalState } from 'state-pool';
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useBeforeunload } from 'react-beforeunload';
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import SimSettings from "./pages/SimSettings";
import CompareResults from "./pages/CompareResults";
const defaultSettings = {
  randomSeed: false,
  seed: 1,
  savingInterval: 15,
  navigation: 0,
  predictionThreshold: 0.5,
  routingMode: 0

}

function App() {
  const [scenario, setScenario, updateScenario] = useGlobalState("scenario", { default: defaultScenario });
  const [evaluation, setEvaluation, updateEvaluation] = useGlobalState("evaluation", { default: [] });
  const [simulationSettings, setSimulatinSettings, updateSimulatinSettings] = useGlobalState("simSettings", { default: defaultSettings });
  const [mapImage, setMapImage, updateMapImage] = useGlobalState("mapImage", { default: null });

  const currentScenario = localStorage.getItem('dss2save-currentScenario');
  const [saved, setSaved] = useState(true)

  useBeforeunload((event) => {
    if (!saved) {
      event.preventDefault();
      return "Don't forget to save your scenario first!"
    }
  });

  useEffect(() => {
    if (currentScenario) {
      setScenario(JSON.parse(currentScenario))

    }
  }, [])

  useEffect(() => {
    localStorage.setItem("dss2save-currentScenario", JSON.stringify(scenario));
    setSaved(false)
  }, [scenario])




  return (<Router>

    <HotkeysProvider>
      <NavBar />

      <Routes>
        <Route path="/editor" element={<ScenarioEditor setSaved={() => { setSaved(true) }} />
        } />

        <Route path="/" element={<HomePage />
        } />
        <Route path="/dashboard" element={<Dashboard />
        } />
        <Route path="/simulation" element={<SimSettings />
        } />
        <Route path="/compare" element={<CompareResults />
        } />
      </Routes>


      <ToastContainer />
    </HotkeysProvider>
  </Router>
  );
}

export default App;
