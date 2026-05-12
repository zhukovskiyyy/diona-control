import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function Processes() {
  const [processes, setProcesses] =
    useState([]);

  async function loadProcesses() {
    const result =
      await ipcRenderer.invoke(
        'get-processes'
      );

    setProcesses(result);
  }

  useEffect(() => {
    loadProcesses();

    const interval =
      setInterval(
        loadProcesses,
        4000
      );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="processes-page">
      <div className="processes-header">
        <div>
          <h1>
            Process Manager
          </h1>

          <p>
            Live system processes
          </p>
        </div>

        <button
          className="scan-btn"
          onClick={loadProcesses}
        >
          Refresh
        </button>
      </div>

      <div className="process-table">
        <div className="process-head">
          <div>Name</div>

          <div>PID</div>

          <div>CPU</div>

          <div>RAM</div>
        </div>

        {processes.map((proc) => (
          <div
            key={proc.pid}
            className="process-row"
          >
            <div>{proc.name}</div>

            <div>{proc.pid}</div>

            <div>{proc.cpu}%</div>

            <div>{proc.memory} MB</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Processes;