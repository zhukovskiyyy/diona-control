import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function Archive() {

  const [archive, setArchive] =
    useState([]);

  const [search, setSearch] =
    useState('');

  /*
    LOAD ARCHIVE
  */

  async function loadArchive() {

    const result =
      await ipcRenderer.invoke(
        'get-archive'
      );

    setArchive(
      result.reverse()
    );
  }

  /*
    LOAD
  */

  useEffect(() => {

    loadArchive();

  }, []);

  return (

    <div className="statistics-page">

      {/* HEADER */}

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
            Архив статистики
          </h1>

          <p>
            История прошлых смен
          </p>

        </div>

        {/* ACTIONS */}

        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >

          <input

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Поиск комнаты или статистики..."

            style={{

              width: 340,

              padding:
                '14px 18px',

              borderRadius: 16,

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.04)',

              color: 'white',

              outline: 'none'

            }}

          />

          {/* CLEAR BUTTON */}

          <button

            className="scan-btn"

            style={{
              background:
                '#dc2626'
            }}

            onClick={async () => {

              await ipcRenderer.invoke(
                'clear-archive'
              );

              loadArchive();

            }}

          >

            Очистить архив

          </button>

        </div>

      </div>

      {/* ARCHIVE LIST */}

      <div
        style={{

          display: 'flex',

          flexDirection:
            'column',

          gap: 24,

          marginTop: 30

        }}
      >

        {archive.map(

          (shift, index) => (

            <div

              key={index}

              className="device-card"

              style={{
                padding: 26
              }}

            >

              {/* TOP */}

              <div

                style={{

                  marginBottom: 24,

                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center'

                }}

              >

                <div>

                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 700
                    }}
                  >
                    Архив смены
                  </h2>

                  <p
                    style={{
                      opacity: 0.5,
                      marginTop: 6
                    }}
                  >
                    {shift.createdAt}
                  </p>

                </div>

                <div className="device-status online">
                  ARCHIVE
                </div>

              </div>

              {/* ROOMS */}

              <div

                style={{

                  display: 'grid',

                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(320px, 1fr))',

                  gap: 20

                }}

              >

                {Object.entries(
                  shift.statistics
                ).map(

                  ([room, messages]) => {

                    const filtered =

                      messages.filter(

                        (msg) =>

                          room
                            .toLowerCase()
                            .includes(
                              search.toLowerCase()
                            ) ||

                          msg.text
                            .toLowerCase()
                            .includes(
                              search.toLowerCase()
                            )

                      );

                    if (
                      filtered.length === 0
                    ) {

                      return null;

                    }

                    return (

                      <div

                        key={room}

                        style={{

                          background:
                            'rgba(255,255,255,0.04)',

                          border:
                            '1px solid rgba(255,255,255,0.06)',

                          borderRadius: 20,

                          padding: 18

                        }}

                      >

                        <h3

                          style={{

                            fontSize: 24,

                            marginBottom: 18,

                            fontWeight: 700

                          }}

                        >

                          {room}

                        </h3>

                        <div

                          style={{

                            display: 'flex',

                            flexDirection:
                              'column',

                            gap: 12

                          }}

                        >

                          {filtered.map(

                            (msg, i) => (

                              <div

                                key={i}

                                style={{

                                  background:
                                    'rgba(255,255,255,0.03)',

                                  padding: 14,

                                  borderRadius: 14

                                }}

                              >

                                <div

                                  style={{

                                    fontWeight: 600,

                                    whiteSpace:
                                      'pre-wrap',

                                    lineHeight: 1.5,

                                    overflowWrap:
                                      'break-word'

                                  }}

                                >

                                  {msg.text}

                                </div>

                                <div

                                  style={{

                                    opacity: 0.45,

                                    marginTop: 8,

                                    fontSize: 12

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

          )

        )}

        {/* EMPTY */}

        {archive.length === 0 && (

          <div

            className="device-card"

            style={{

              padding: 40,

              textAlign: 'center',

              opacity: 0.5

            }}

          >

            Архив пуст

          </div>

        )}

      </div>

    </div>

  );
}

export default Archive;