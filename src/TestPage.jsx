import DashboardComponent from './components/DashboardComponent';

function TestPage() {
  const userType = ['ADMIN', 'CLIENT', 'STUDENT', 'SUPERVISOR'];
  return <DashboardComponent userType={userType[3]} />;
}

export default TestPage;
