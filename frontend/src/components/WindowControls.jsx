import {
  Minus,
  Square,
  X
} from 'lucide-react';

const { ipcRenderer } = window.require('electron');

function WindowControls() {
  return (
    <div className="window-controls">
      <button
        className="window-btn"
        onClick={() => {
          ipcRenderer.send('window-minimize');
        }}
      >
        <Minus size={16} />
      </button>

      <button
        className="window-btn"
        onClick={() => {
          ipcRenderer.send('window-maximize');
        }}
      >
        <Square size={14} />
      </button>

      <button
        className="window-btn close"
        onClick={() => {
          ipcRenderer.send('window-close');
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default WindowControls;