import {
  useEffect
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function MeshCentral() {
  useEffect(() => {
    ipcRenderer.send(
      'attach-mesh'
    );

    return () => {
      ipcRenderer.send(
        'detach-mesh'
      );
    };
  }, []);

  return (
    <div className="mesh-page">
      <div className="mesh-page-header">
        <div>
          <h1>MeshCentral</h1>

          <p>
            Встроенная система
            удалённого управления
          </p>
        </div>

        <div className="mesh-live-status">
          CONNECTED
        </div>
      </div>
    </div>
  );
}

export default MeshCentral;