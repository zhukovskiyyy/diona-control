import {
  useEffect,
  useState
} from 'react';

import {
  Copy,
  Wifi,
  ExternalLink,
  Route,
  RefreshCw
} from 'lucide-react';

import {
  useNavigate
} from 'react-router-dom';

const { ipcRenderer } =
  window.require('electron');

function Devices() {
  const [devices, setDevices] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  async function scanNetwork() {
    setLoading(true);

    const result =
      await ipcRenderer.invoke(
        'scan-network'
      );

    setDevices(result);

    setLoading(false);
  }

  useEffect(() => {
    scanNetwork();

    const interval =
      setInterval(
        scanNetwork,
        10000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="devices-page">
      <div className="devices-header">
        <div>
          <h1>
            Сетевые устройства
          </h1>

          <p>
            Auto-discovery network scan
          </p>
        </div>

        <button
          className="scan-btn"
          onClick={scanNetwork}
        >
          <RefreshCw size={16} />

          {loading
            ? 'Scanning...'
            : 'Refresh'}
        </button>
      </div>

      <div className="devices-grid">
        {devices.map((device, index) => (
          <div
            key={index}
            className={`device-card ${device.status}`}
            onClick={() => {
              navigate(
                `/device/${index}`
              );
            }}
          >
            <div className="device-card-top">
              <div>
                <h2>
                  {device.hostname}
                </h2>

                <p>
                  {device.os}
                </p>
              </div>

              <div
                className={`device-status ${device.status}`}
              >
                {device.status}
              </div>
            </div>

            <div className="device-ip">
              {device.ip}
            </div>

            <div className="device-group">
              {device.latency}
            </div>

            <div className="device-actions">
              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  navigator.clipboard.writeText(
                    device.ip
                  );
                }}
              >
                <Copy size={15} />
              </button>

              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  ipcRenderer.invoke(
                    'terminal-command',
                    `ping ${device.ip}`
                  );
                }}
              >
                <Wifi size={15} />
              </button>

              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  ipcRenderer.invoke(
                    'terminal-command',
                    `tracert ${device.ip}`
                  );
                }}
              >
                <Route size={15} />
              </button>

              <button
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  window.open(
                    `mstsc /v:${device.ip}`
                  );
                }}
              >
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Devices;