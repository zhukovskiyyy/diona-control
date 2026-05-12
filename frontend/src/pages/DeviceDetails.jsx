import {
  useParams
} from 'react-router-dom';

function DeviceDetails() {
  const { id } = useParams();

  return (
    <div className="device-details-page">
      <div className="device-details-header">
        <div>
          <h1>
            Device #{id}
          </h1>

          <p>
            Infrastructure node
          </p>
        </div>

        <div className="device-online">
          ONLINE
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>System</h3>

          <div className="detail-item">
            <span>OS</span>

            <strong>
              Windows 11 Pro
            </strong>
          </div>

          <div className="detail-item">
            <span>Hostname</span>

            <strong>
              ADMIN-PC
            </strong>
          </div>

          <div className="detail-item">
            <span>IP</span>

            <strong>
              10.101.10.232
            </strong>
          </div>
        </div>

        <div className="details-card">
          <h3>Performance</h3>

          <div className="metric-big">
            18%
          </div>

          <p>CPU Usage</p>
        </div>

        <div className="details-card">
          <h3>Memory</h3>

          <div className="metric-big">
            7.4 GB
          </div>

          <p>RAM Usage</p>
        </div>

        <div className="details-card">
          <h3>Actions</h3>

          <button className="detail-btn">
            Restart
          </button>

          <button className="detail-btn">
            Shutdown
          </button>

          <button className="detail-btn">
            Open Mesh
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeviceDetails;