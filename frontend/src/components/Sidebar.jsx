import {
  Globe,
  LayoutDashboard,
  Monitor,
  Activity,
  TerminalSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Briefcase,
  BarChart3,
  Archive,
  BellDot
} from 'lucide-react';

import {
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  useState,
  useEffect
} from 'react';

const { ipcRenderer } =
  window.require('electron');

const items = [

  {
    label: 'Смена',
    icon: <Briefcase size={20} />,
    path: '/shift-manager'
  },

  {
    label: 'Панель',
    icon: <LayoutDashboard size={20} />,
    path: '/'
  },

  {
    label: 'Устройства',
    icon: <Monitor size={20} />,
    path: '/devices'
  },

  {
    label: 'MeshCentral',
    icon: <Globe size={20} />,
    path: '/mesh'
  },

  {
    label: 'Мониторинг',
    icon: <Activity size={20} />,
    path: '/monitoring'
  },

  {
    label: 'Процессы',
    icon: <Cpu size={20} />,
    path: '/processes'
  },

  {
    label: 'Терминал',
    icon: <TerminalSquare size={20} />,
    path: '/terminal'
  },

  {
    label: 'Статистика',
    icon: <BarChart3 size={20} />,
    path: '/statistics'
  },

  {
    label: 'Архив',
    icon: <Archive size={20} />,
    path: '/archive'
  },

  {
    label: 'Настройки',
    icon: <Settings size={20} />,
    path: '/settings'
  }

];

function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [collapsed, setCollapsed] =
    useState(false);

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

  useEffect(() => {

    loadNotifications();

    const interval =
      setInterval(
        loadNotifications,
        3000
      );

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <aside
      className={`sidebar ${
        collapsed
          ? 'collapsed'
          : ''
      }`}
    >

      <div>

        {/* TOP */}

        <div className="sidebar-top">

          {!collapsed && (

            <div className="brand">

              <h1>
                Diona
              </h1>

              <p>
                Cyber Control Center
              </p>

            </div>

          )}

          <button
            className="collapse-btn"
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
          >

            {collapsed ? (

              <ChevronRight size={18} />

            ) : (

              <ChevronLeft size={18} />

            )}

          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="nav-menu">

          {items.map((item) => (

            <button

              key={item.label}

              className={`nav-item ${
                location.pathname ===
                item.path
                  ? 'active'
                  : ''
              }`}

              onClick={() =>
                navigate(item.path)
              }

            >

              <div className="nav-icon">
                {item.icon}
              </div>

              {!collapsed && (

                <>

                  <span>
                    {item.label}
                  </span>

                  {/* NOTIFICATION BADGE */}

                  {item.label ===
                    'Статистика' &&

                    notifications.length > 0 && (

                      <div
                        className="nav-badge"
                      >
                        {
                          notifications.length
                        }
                      </div>

                    )}

                  {/* LIVE DOT */}

                  {item.label ===
                    'Мониторинг' && (

                    <div className="pulse-dot" />

                  )}

                </>

              )}

            </button>

          ))}

        </nav>

      </div>

      {/* PROFILE */}

      <div className="profile-card">

        <div className="avatar">
          D
        </div>

        {!collapsed && (

          <div>

            <strong>
              admin
            </strong>

            <p>
              Infrastructure
              Administrator
            </p>

            {/* LIVE STATUS */}

            <div
              style={{
                marginTop: 10,

                display: 'flex',

                alignItems: 'center',

                gap: 8,

                opacity: 0.7,

                fontSize: 12
              }}
            >

              <BellDot size={14} />

              <span>
                {
                  notifications.length
                } notifications
              </span>

            </div>

          </div>

        )}

      </div>

    </aside>

  );

}

export default Sidebar;