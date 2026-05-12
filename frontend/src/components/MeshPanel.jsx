function MeshPanel() {
  return (
    <div className="mesh-panel">
      <div className="mesh-header">
        <div>
          <h3>MeshCentral Session</h3>

          <p>
            Embedded secure remote infrastructure
          </p>
        </div>

        <div className="mesh-status">
          CONNECTED
        </div>
      </div>

      <div className="mesh-overlay">
        BrowserView attached
      </div>
    </div>
  );
}

export default MeshPanel;