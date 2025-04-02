import DashboardComponent from './components/DashboardComponent';

function TestPage() {
  const users = ['STUDENT', 'CLIENT', 'ADMIN', 'SUPERVISOR'];
  return <DashboardComponent userType={users[0]} />;
}

export default TestPage;
