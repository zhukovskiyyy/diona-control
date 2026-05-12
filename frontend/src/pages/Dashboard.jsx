import DashboardCards from '../components/DashboardCards';

import MonitoringPanel from '../components/MonitoringPanel';

import MeshPanel from '../components/MeshPanel';

import Notifications from '../components/Notifications';

function Dashboard() {
  return (
    <>
      <DashboardCards />

      <div className="dashboard-main-grid">
        <MonitoringPanel />

        <MeshPanel />

        <Notifications />
      </div>
    </>
  );
}

export default Dashboard;