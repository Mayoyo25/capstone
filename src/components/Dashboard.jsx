import useAuthStore from '../stores/authStore';
import DashboardComponent from './DashboardComponent';

function Dashboard() {
  const { userData } = useAuthStore();

  return <DashboardComponent userType={userData.user_type} />;
}

export default Dashboard;
