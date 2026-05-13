import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function Statistics() {

  const [stats, setStats] =
    useState({});

  const [copiedRoom, setCopiedRoom] =
    useState(null);

  /*
    EXTRACT TOTAL
  */

  function extractTotal(
    text
  ) {

    const match =
      text.match(

        /(total|Total|TOTAL|тотал|Тотал|ТОТАЛ|итого|Итого|ИТОГО|всього|Всього|ВСЬОГО|загалом|Загалом|ЗАГАЛОМ|сумма|Сумма|СУММА)\s*:?\s*(\d+)/i

      );

    return match
      ? Number(match[2])
      : 0;

  }

  /*
    LOAD STATS
  */

  async function loadStats() {

    const result =
      await ipcRenderer.invoke(
        'get-statistics'
      );

    setStats(result);

  }

  /*
    REMIND
  */

  async function remindAll() {

    await ipcRenderer.invoke(
      'remind-all'
    );

  }

  /*
    CLEAR ROOM
  */

  async function clearRoom(
    room
  ) {

    await ipcRenderer.invoke(

      'clear-room-statistics',

      room

    );

    loadStats();

  }

  /*
    DELETE MESSAGE
  */

  async function deleteMessage(
    room,
    index
  ) {

    await ipcRenderer.invoke(

      'delete-stat-message',

      {
        room,
        index
      }

    );

    loadStats();

  }

  /*
    LOAD INTERVAL
  */

  useEffect(() => {

    loadStats();

    const interval =
      setInterval(
        loadStats,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  /*
    ALL TOTALS
  */

  const allTotals =

    Object.values(stats)
      .flat()
      .reduce(

        (sum, msg) =>

          sum +
          extractTotal(
            msg.text
          ),

        0

      );

  return (

    <div className="statistics-page">

      <div
        className="devices-header"
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap'
        }}
      >

        <div>

          <h1>
            Статистика комнат
          </h1>

          <p>
            Telegram statistics system
          </p>

          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap'
            }}
          >

            <div
              className="device-card"
              style={{
                padding:
                  '18px 24px',
                minWidth: 240
              }}
            >

              <div
                style={{
                  opacity: 0.5,
                  fontSize: 14
                }}
              >
                Общий total смены
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontSize: 34,
                  fontWeight: 800
                }}
              >
                {allTotals.toLocaleString()} tk
              </div>

            </div>

          </div>

        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center'
          }}
        >

          <button
            className="scan-btn"
            onClick={remindAll}
          >
            Напомнить всем
          </button>

          <button
            className="scan-btn"
            onClick={async () => {

              await ipcRenderer.invoke(
                'archive-statistics'
              );

              window.location.reload();

            }}
          >
            Отправить в архив
          </button>

        </div>

      </div>

      <div
        className="devices-grid"
        style={{
          display: 'grid',

          gridTemplateColumns:
            'repeat(auto-fill, minmax(420px, 1fr))',

          gap: 24,

          marginTop: 30
        }}
      >

        {Object.entries(stats).map(
          ([room, messages]) => {

            const roomTotal =

              messages.reduce(

                (sum, msg) =>

                  sum +
                  extractTotal(
                    msg.text
                  ),

                0

              );

            return (

              <div
                key={room}
                className="device-card online"
                style={{
                  minHeight: 300,
                  padding: 24
                }}
              >

                <div className="device-card-top">

                  <div>

                    <h2
                      style={{
                        fontSize: 34,
                        fontWeight: 700
                      }}
                    >
                      {room}
                    </h2>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 16,
                        opacity: 0.7,
                        fontWeight: 600
                      }}
                    >
                      Total: {roomTotal} tk
                    </div>

                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 10
                    }}
                  >

                    <button
                      className="scan-btn"
                      style={{
                        padding:
                          '8px 14px',

                        fontSize: 13,

                        background:
                          copiedRoom === room
                            ? '#16a34a'
                            : '',

                        transition:
                          '0.2s'
                      }}
                      onClick={() => {

                        const text =

                          messages
                            .map(
                              (m) => m.text
                            )
                            .join('\n');

                        navigator.clipboard.writeText(
                          text
                        );

                        setCopiedRoom(room);

                        setTimeout(() => {

                          setCopiedRoom(null);

                        }, 1200);

                      }}
                    >
                      {copiedRoom === room
                        ? '✅ Скопировано'
                        : 'Копировать'}
                    </button>

                    <button
                      className="scan-btn"
                      style={{
                        padding:
                          '8px 14px',

                        fontSize: 13,

                        background:
                          '#dc2626'
                      }}
                      onClick={() =>
                        clearRoom(room)
                      }
                    >
                      Очистить
                    </button>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: 24,
                    display: 'flex',
                    flexDirection:
                      'column',
                    gap: 14
                  }}
                >

                  {messages.map(
                    (msg, index) => (

                      <div
                        key={index}
                        style={{
                          background:
                            'rgba(255,255,255,0.05)',

                          border:
                            '1px solid rgba(255,255,255,0.06)',

                          padding: 16,

                          borderRadius: 16,

                          position: 'relative'
                        }}
                      >

                        <button

                          onClick={() =>
                            deleteMessage(
                              room,
                              index
                            )
                          }

                          style={{

                            position: 'absolute',

                            top: 12,

                            right: 12,

                            width: 30,

                            height: 30,

                            borderRadius: 8,

                            border: 'none',

                            background: '#dc2626',

                            color: 'white',

                            cursor: 'pointer',

                            fontWeight: 700

                          }}

                        >
                          ×
                        </button>

                        <div
                          style={{
                            fontSize: 16,

                            fontWeight: 700,

                            lineHeight: 1.6,

                            whiteSpace:
                              'pre-wrap',

                            overflowWrap:
                              'break-word'
                          }}
                        >
                          {msg.text}
                        </div>

                        <div
                          style={{
                            marginTop: 10,

                            opacity: 0.45,

                            fontSize: 13
                          }}
                        >
                          {msg.time}
                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            );

          }
        )}

      </div>

    </div>

  );

}

export default Statistics;