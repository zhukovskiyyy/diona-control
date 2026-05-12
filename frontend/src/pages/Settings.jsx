import {
  Bell,
  Bot,
  Shield,
  Database,
  MonitorSmartphone,
  Save,
  RefreshCw
} from 'lucide-react';

import {
  motion
} from 'framer-motion';

import {
  useEffect,
  useState
} from 'react';

function SettingsPage() {

  const [
    countShiftTotal,
    setCountShiftTotal
  ] = useState(true);

  useEffect(() => {

    const saved =
      localStorage.getItem(
        'countShiftTotal'
      );

    if (saved !== null) {

      setCountShiftTotal(
        JSON.parse(saved)
      );

    }

  }, []);

  const toggleShiftTotal = () => {

    const value =
      !countShiftTotal;

    setCountShiftTotal(value);

    localStorage.setItem(
      'countShiftTotal',
      JSON.stringify(value)
    );

  };

  return (

    <div
      style={{
        paddingBottom: 60
      }}
    >

      {/* HEADER */}

      <div
        className="devices-header"
        style={{
          marginBottom: 30
        }}
      >

        <div>

          <h1>
            Настройки системы
          </h1>

          <p>
            Diona Infrastructure Configuration
          </p>

        </div>

      </div>

      {/* GRID */}

      <div
        style={{

          display: 'grid',

          gridTemplateColumns:
            'repeat(auto-fill,minmax(420px,1fr))',

          gap: 24

        }}
      >

        {/* TELEGRAM */}

        <motion.div

          className="device-card"

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

        >

          <div className="device-card-top">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >

              <Bot size={24} />

              <h2>
                Telegram Bot
              </h2>

            </div>

            <div className="device-status online">
              ONLINE
            </div>

          </div>

          <div
            style={{
              marginTop: 24
            }}
          >

            <div className="setting-item">

              <span>
                Admin Chat ID
              </span>

              <strong>
                869376046
              </strong>

            </div>

            <div className="setting-item">

              <span>
                Auto Reminders
              </span>

              <strong>
                Enabled
              </strong>

            </div>

            <div className="setting-item">

              <span>
                Archive System
              </span>

              <strong>
                Active
              </strong>

            </div>

            {/* TOTAL SWITCH */}

            <div
              style={{

                marginTop: 22,

                padding: '18px',

                borderRadius: 18,

                background:
                  'rgba(255,255,255,0.04)',

                border:
                  '1px solid rgba(255,255,255,0.06)',

                display: 'flex',

                justifyContent:
                  'space-between',

                alignItems: 'center'

              }}
            >

              <div>

                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 4
                  }}
                >

                  Подсчет общего тотала

                </div>

                <div
                  style={{
                    opacity: 0.6,
                    fontSize: 13
                  }}
                >

                  Учитывать total в смене

                </div>

              </div>

              <button

                onClick={
                  toggleShiftTotal
                }

                style={{

                  width: 74,

                  height: 38,

                  border: 'none',

                  borderRadius: 999,

                  cursor: 'pointer',

                  position: 'relative',

                  transition: '.25s',

                  background:
                    countShiftTotal
                      ? 'linear-gradient(135deg,#ff00cc,#7a2cff)'
                      : 'rgba(255,255,255,0.08)'

                }}

              >

                <div

                  style={{

                    position: 'absolute',

                    top: 5,

                    left:
                      countShiftTotal
                        ? 40
                        : 5,

                    width: 28,

                    height: 28,

                    borderRadius: '50%',

                    background: '#fff',

                    transition: '.25s'

                  }}

                />

              </button>

            </div>

            <button
              className="scan-btn"
              style={{
                width: '100%',
                marginTop: 24
              }}
            >

              <RefreshCw size={16} />

              Restart Bot

            </button>

          </div>

        </motion.div>

        {/* REMINDERS */}

        <motion.div

          className="device-card"

          initial={{
            opacity: 0,
            y: 20
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            delay: 0.05
          }}

        >

          <div className="device-card-top">

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >

              <Bell size={24} />

              <h2>
                Reminder Times
              </h2>

            </div>

            <div className="device-status online">
              ACTIVE
            </div>

          </div>

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >

            {[
              '14:50',
              '17:50',
              '20:50',
              '06:50'
            ].map((time) => (

              <div

                key={time}

                style={{

                  background:
                    'rgba(255,255,255,0.05)',

                  border:
                    '1px solid rgba(255,255,255,0.06)',

                  padding:
                    '16px 18px',

                  borderRadius: 16,

                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems: 'center'

                }}

              >

                <strong>
                  {time}
                </strong>

                <div className="device-status online">
                  ON
                </div>

              </div>

            ))}

          </div>

        </motion.div>

      </div>

    </div>

  );

}

export default SettingsPage;