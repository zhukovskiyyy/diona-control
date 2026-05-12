import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const { ipcRenderer } = window.require('electron');

function MonitoringPanel() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    uptime: 0,
    network: 0
  });

  useEffect(() => {
    async function loadMetrics() {
      const data = await ipcRenderer.invoke(
        'get-system-metrics'
      );

      setMetrics(data);
    }

    loadMetrics();

    const interval = setInterval(
      loadMetrics,
      2000
    );

    return () => clearInterval(interval);
  }, []);

  const items = [
    {
      label: 'CPU Usage',
      value: `${metrics.cpu}%`
    },
    {
      label: 'RAM Usage',
      value: `${metrics.ram} GB`
    },
    {
      label: 'Network',
      value: `${metrics.network} MB/s`
    },
    {
      label: 'Uptime',
      value: `${metrics.uptime}h`
    }
  ];

  return (
    <div className="monitoring-panel">
      <div className="monitoring-header">
        <h3>Realtime Monitoring</h3>

        <p>Live infrastructure metrics</p>
      </div>

      <div className="metrics-grid">
        {items.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="metric-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1
            }}
            whileHover={{
              scale: 1.03
            }}
          >
            <div className="metric-label">
              {metric.label}
            </div>

            <div className="metric-value">
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MonitoringPanel;