function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h2>Diona Infrastructure</h2>

        <p>
          Централизованная система
          управления инфраструктурой
        </p>
      </div>

      <div className="topbar-right">
        <input
          className="search"
          placeholder="Поиск устройств, логов, сессий..."
        />

        <div className="status online">
          <div className="dot" />
          MeshCentral подключен
        </div>
      </div>
    </header>
  );
}

export default Topbar;