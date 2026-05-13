export default function MeshCentral() {

  const openMesh = () => {

    const {
      ipcRenderer
    } = window.require('electron');

    ipcRenderer.send(
      'open-mesh-window'
    );

  };

  return (

    <div
      style={{
        color: 'white'
      }}
    >

      <h1
        style={{
          fontSize: '56px',
          marginBottom: '10px'
        }}
      >
        MeshCentral
      </h1>

      <p
        style={{
          opacity: 0.7,
          marginBottom: '30px'
        }}
      >
        Встроенная система удалённого управления
      </p>

      <button
        onClick={openMesh}
        style={{

          background:
            'linear-gradient(90deg,#ff00cc,#7a2cff)',

          border: 'none',

          color: 'white',

          padding: '18px 28px',

          borderRadius: '18px',

          fontSize: '18px',

          fontWeight: '700',

          cursor: 'pointer',

          boxShadow:
            '0 0 30px rgba(180,0,255,0.35)'

        }}
      >

        Открыть MeshCentral

      </button>

    </div>

  );

}