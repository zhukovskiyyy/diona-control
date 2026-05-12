function StatusPanel() {
  return (
    <div className="status-panel">
      <div className="status-header">
        <h3>MeshCentral Embedded Session</h3>
        <span>BrowserView Connected</span>
      </div>

      <div className="mesh-placeholder">
        BrowserView MeshCentral container attached.
      </div>
    </div>
  );
}

export default StatusPanel;
