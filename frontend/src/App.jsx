import {
  HashRouter,
  Routes,
  Route
} from 'react-router-dom';

import {
  useEffect,
  useState
} from 'react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import WindowControls from './components/WindowControls';
import Tabs from './components/Tabs';

import SplashScreen from './components/SplashScreen';

import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import Monitoring from './pages/Monitoring';
import Terminal from './pages/Terminal';
import MeshCentral from './pages/MeshCentral';
import DeviceDetails from './pages/DeviceDetails';
import Processes from './pages/Processes';
import ShiftManager from './pages/ShiftManager';
import Statistics from './pages/Statistics';
import Archive from './pages/Archive';
import SettingsPage from './pages/Settings';

import './styles/global.css';


function App() {

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setLoading(false);

    }, 2200);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (

    <HashRouter>

      <div className="layout">

        <Sidebar />

        <main className="main-content">

          <div className="custom-titlebar">

            <div className="titlebar-title">
              Diona Control Panel
            </div>

            <WindowControls />

          </div>

          <Topbar />

          <Tabs />

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/devices"
              element={<Devices />}
            />

            <Route
              path="/monitoring"
              element={<Monitoring />}
            />

            <Route
              path="/terminal"
              element={<Terminal />}
            />

            <Route
              path="/mesh"
              element={<MeshCentral />}
            />

            <Route
              path="/device/:id"
              element={<DeviceDetails />}
            />

            <Route
              path="/processes"
              element={<Processes />}
            />

            <Route
              path="/shift-manager"
              element={<ShiftManager />}
            />

            <Route
              path="/statistics"
              element={<Statistics />}
            />

            <Route
              path="/archive"
              element={<Archive />}
            />

            <Route
              path="/settings"
              element={<SettingsPage />}
            />

          </Routes>

        </main>

      </div>

    </HashRouter>

  );

}

export default App;