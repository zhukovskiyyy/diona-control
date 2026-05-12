import {
  useEffect,
  useState
} from 'react';

const { ipcRenderer } =
  window.require('electron');

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  /*
    LOAD NOTIFICATIONS
  */

  async function loadNotifications() {

    const result =
      await ipcRenderer.invoke(
        'get-notifications'
      );

    setNotifications(result);

  }

  /*
    REALTIME UPDATE
  */

  useEffect(() => {

    loadNotifications();

    const interval =
      setInterval(
        loadNotifications,
        2000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div className="notifications-panel">

      <div className="notifications-header">

        <h3>
          Notifications
        </h3>

        <span>
          {notifications.length} Active
        </span>

      </div>

      <div className="notifications-list">

        {notifications.map(

          (notification, index) => (

            <div

              key={index}

              className="notification-card"

              style={{

                borderLeft:

                  notification.type ===
                  'danger'

                    ? '4px solid #ff4d6d'

                  : notification.type ===
                    'warning'

                    ? '4px solid #ffd166'

                  : '4px solid #00ffae'

              }}

            >

              <div className="notification-top">

                <strong>
                  {notification.title}
                </strong>

                <span>
                  {notification.time}
                </span>

              </div>

              <p>
                {notification.message}
              </p>

            </div>

          )

        )}

        {notifications.length === 0 && (

          <div
            style={{

              opacity: 0.5,

              padding: 20,

              textAlign: 'center'

            }}
          >

            No notifications yet

          </div>

        )}

      </div>

    </div>

  );
}

export default Notifications;