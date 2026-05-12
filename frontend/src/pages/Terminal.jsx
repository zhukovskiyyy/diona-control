import {
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function Terminal() {
  const [command, setCommand] =
    useState('');

  const [output, setOutput] =
    useState('');

  async function runCommand() {
    if (!command) return;

    const result =
      await ipcRenderer.invoke(
        'terminal-command',
        command
      );

    setOutput(result);
  }

  return (
    <div className="terminal-page">
      <div className="terminal-header">
        <div>
          <h1>Terminal</h1>

          <p>
            Infrastructure shell
          </p>
        </div>
      </div>

      <div className="terminal-box">
        <div className="terminal-output">
          <pre>{output}</pre>
        </div>

        <div className="terminal-input-row">
          <input
            type="text"
            placeholder="Enter command..."
            value={command}
            onChange={(e) => {
              setCommand(
                e.target.value
              );
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runCommand();
              }
            }}
          />

          <button
            onClick={runCommand}
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
}

export default Terminal;