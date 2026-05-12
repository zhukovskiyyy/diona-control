import {
  useEffect,
  useState
} from 'react';

import {
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';

const { ipcRenderer } =
  window.require('electron');

function Monitoring() {
  const [metrics, setMetrics] =
    useState({
      cpu: 0,
      ram: 0,
      uptime: 0,
      network: 0
    });

  const [history, setHistory] =
    useState([]);

  async function loadMetrics() {
    const result =
      await ipcRenderer.invoke(
        'get-system-metrics'
      );

    setMetrics(result);

    setHistory((prev) => {
      const updated = [
        ...prev,
        {
          cpu: result.cpu,
          ram: parseFloat(
            result.ram
          )
        }
      ];

      return updated.slice(-20);
    });
  }

  useEffect(() => {
    loadMetrics();

    const interval =
      setInterval(
        loadMetrics,
        2000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="monitoring-page">
      <div className="monitoring-header">
        <div>
          <h1>
            Мониторинг системы
          </h1>

          <p>
            Live infrastructure metrics
          </p>
        </div>

        <div className="monitor-live">
          LIVE
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>CPU</h3>

          <div className="metric-value">
            {metrics.cpu}%
          </div>
        </div>

        <div className="metric-card">
          <h3>RAM</h3>

          <div className="metric-value">
            {metrics.ram} GB
          </div>
        </div>

        <div className="metric-card">
          <h3>UPTIME</h3>

          <div className="metric-value">
            {metrics.uptime}h
          </div>
        </div>

        <div className="metric-card">
          <h3>NETWORK</h3>

          <div className="metric-value">
            {metrics.network} MB/s
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2>
            System Performance
          </h2>
        </div>

        <div className="chart-box">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <AreaChart
              data={history}
            >
              <Area
                type="monotone"
                dataKey="cpu"
                stroke="#ff00ff"
                fill="#ff00ff33"
              />

              <Area
                type="monotone"
                dataKey="ram"
                stroke="#7a5cff"
                fill="#7a5cff22"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Monitoring;