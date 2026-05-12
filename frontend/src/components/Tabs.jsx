import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  {
    label: 'Dashboard',
    path: '/'
  },
  {
    label: 'Devices',
    path: '/devices'
  },
  {
    label: 'Monitoring',
    path: '/monitoring'
  },
  {
    label: 'Terminal',
    path: '/terminal'
  }
];

function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="tabs-row">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`tab-btn ${
            location.pathname === tab.path ? 'active' : ''
          }`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;