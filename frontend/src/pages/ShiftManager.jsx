import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function ShiftManager() {
  const [status, setStatus] =
    useState('Готов к работе');

  const [shiftActive, setShiftActive] =
    useState(false);

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {
    let interval;

    if (shiftActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }

    return () =>
      clearInterval(interval);
  }, [shiftActive]);

  function formatTime(sec) {
    const h = String(
      Math.floor(sec / 3600)
    ).padStart(2, '0');

    const m = String(
      Math.floor(
        (sec % 3600) / 60
      )
    ).padStart(2, '0');

    const s = String(
      sec % 60
    ).padStart(2, '0');

    return `${h}:${m}:${s}`;
  }

  async function startShift() {
    setStatus(
      'Запуск рабочей среды...'
    );

    await ipcRenderer.invoke(
      'start-shift'
    );

    setShiftActive(true);

    setStatus(
      'Смена начата'
    );
  }

  async function endShift() {
    setStatus(
      'Завершение смены...'
    );

    await ipcRenderer.invoke(
      'end-shift'
    );

    setShiftActive(false);

    setSeconds(0);

    setStatus(
      'Смена завершена'
    );
  }

  return (
    <div className="shift-page">
      <div className="shift-header">
        <div>
          <h1>
            Shift Manager
          </h1>

          <p>
            Studio workspace control
          </p>
        </div>
      </div>

      <div className="shift-timer-card">
        <div className="shift-label">
          ДЛИТЕЛЬНОСТЬ СМЕНЫ
        </div>

        <div className="shift-timer">
          {formatTime(seconds)}
        </div>

        <div className="shift-status">
          {status}
        </div>
      </div>

      <div className="shift-actions">
        <button
          className="shift-start-btn"
          onClick={startShift}
        >
          ▶ НАЧАТЬ СМЕНУ
        </button>

        <button
          className="shift-end-btn"
          onClick={endShift}
        >
          ■ ЗАКОНЧИТЬ СМЕНУ
        </button>
      </div>
    </div>
  );
}

export default ShiftManager;