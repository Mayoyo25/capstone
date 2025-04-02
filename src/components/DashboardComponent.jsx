import { useState } from 'react';
import {
  LogOut,
  House,
  ChartBar,
  Users,
  FileText,
  Mail,
  CheckCircle,
  User,
  Clock,
  Bookmark,
} from 'lucide-react';
import DashboardTable from './DynamicTable';
import DashboardTop from './DashboardTop';
import useAuthStore from '../stores/authStore';
import ClientNewProjectModal from './ClientNewProjectModal';
import { sampleData } from '../data.js';

// Placeholder components for non-table views
const AdminDashboard = () => (
  <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
    <div className='bg-blue-50 p-4 rounded-lg'>System Analytics</div>
    <div className='bg-green-50 p-4 rounded-lg'>User Statistics</div>
    <div className='bg-purple-50 p-4 rounded-lg'>Recent Activity</div>
  </div>
);

const StudentDashboard = () => (
  <div className='p-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
    <div className='bg-blue-50 p-4 rounded-lg'>My Projects</div>
    <div className='bg-green-50 p-4 rounded-lg'>Upcoming Deadlines</div>
  </div>
);

const StudentMail = () => (
  <div className='p-4 space-y-2'>
    {[1, 2, 3].map((i) => (
      <div key={i} className='bg-white p-3 rounded-lg shadow'>
        Message {i}
      </div>
    ))}
  </div>
);

// Complete configuration matching your exact requirements
const userDashboardConfig = {
  ADMIN: {
    navItems: [
      {
        id: 1,
        label: 'Dashboard',
        icon: House,
        hasTable: false,
        component: <AdminDashboard />,
      },
      {
        id: 2,
        label: 'Academic Supervisors',
        icon: User,
        columns: [
          { key: 'fullName', title: 'Full Name' },
          { key: 'company', title: 'Company' },
          { key: 'institute', title: 'Institute' },
          { key: 'email', title: 'Email' },
          { key: 'phone', title: 'Phone Number' },
          { key: 'account', title: 'Account' },
        ],
      },
      {
        id: 3,
        label: 'Industry Clients',
        icon: Users,
        columns: [
          { key: 'fullName', title: 'Full Name' },
          { key: 'company', title: 'Company' },
          { key: 'institute', title: 'Institute' },
          { key: 'email', title: 'Email' },
          { key: 'phone', title: 'Phone Number' },
          { key: 'account', title: 'Account' },
        ],
      },
      {
        id: 4,
        label: 'Projects',
        icon: FileText,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'company', title: 'Company' },
          { key: 'institute', title: 'Institute' },
          { key: 'members', title: 'Members' },
          { key: 'deadline', title: 'Deadline' },
          { key: 'completion', title: 'Completion' },
        ],
      },
      {
        id: 5,
        label: 'Tickets',
        icon: Bookmark,
        columns: [
          { key: 'ticketOwner', title: 'Ticket Owner' },
          { key: 'issuedBy', title: 'Issued By' },
          { key: 'title', title: 'Title' },
          { key: 'issuedDate', title: 'Issued Date' },
          { key: 'dueDate', title: 'Due Date' },
          { key: 'type', title: 'Type' },
        ],
      },
    ],
    showNewProjectButton: false,
  },
  SUPERVISOR: {
    navItems: [
      {
        id: 1,
        label: 'Track Progress',
        icon: ChartBar,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'company', title: 'Company' },
          { key: 'institute', title: 'Institute' },
          { key: 'members', title: 'Members' },
          { key: 'deadline', title: 'Deadline' },
          { key: 'completion', title: 'Completion' },
        ],
      },
      {
        id: 2,
        label: 'Monitor Students',
        icon: Users,
        columns: [
          { key: 'student', title: 'Student' },
          { key: 'institute', title: 'Institute' },
          { key: 'project', title: 'Project' },
          { key: 'performance', title: 'Performance' },
          { key: 'industry', title: 'Industry' },
          { key: 'action', title: 'Action' },
        ],
      },
    ],
    showNewProjectButton: false,
  },
  CLIENT: {
    navItems: [
      {
        id: 1,
        label: 'Dashboard',
        icon: House,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'status', title: 'Project Status' },
          { key: 'projectManager', title: 'Project Manager' },
          { key: 'startDate', title: 'Start Date' },
          { key: 'endDate', title: 'End Date' },
          { key: 'viewDetails', title: 'View Details' },
        ],
      },
      {
        id: 2,
        label: 'Track Progress',
        icon: ChartBar,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'projectManager', title: 'Project Manager' },
          { key: 'startDate', title: 'Start Date' },
          { key: 'endDate', title: 'End Date' },
          { key: 'status', title: 'Project Status' },
          { key: 'progress', title: 'Progress' },
        ],
      },
      {
        id: 3,
        label: 'Pending Approvals',
        icon: Clock,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'team', title: 'Team' },
          { key: 'projectManager', title: 'Project Manager' },
          { key: 'viewDetails', title: 'View Details' },
          { key: 'pendingApproval', title: 'Pending Approval' },
        ],
      },
    ],
    showNewProjectButton: true,
  },
  STUDENT: {
    navItems: [
      {
        id: 1,
        label: 'Dashboard',
        icon: House,
        hasTable: false,
        component: <StudentDashboard />,
      },
      {
        id: 2,
        label: 'Projects',
        icon: FileText,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'projectClient', title: 'Project Client' },
          { key: 'projectCategory', title: 'Project Category' },
          { key: 'dueDate', title: 'Due Date' },
          { key: 'status', title: 'Project Status' },
        ],
      },
      {
        id: 3,
        label: 'Mail',
        icon: Mail,
        hasTable: false,
        component: <StudentMail />,
      },
      {
        id: 4,
        label: 'Track Project',
        icon: ChartBar,
        columns: [
          { key: 'project', title: 'Project' },
          { key: 'company', title: 'Company' },
          { key: 'institute', title: 'Institute' },
          { key: 'members', title: 'Members' },
          { key: 'deadline', title: 'Deadline' },
          { key: 'status', title: 'Status' },
        ],
      },
    ],
    showNewProjectButton: false,
  },
};

const DashboardComponent = ({ userType = 'STUDENT' }) => {
  const [activePage, setActivePage] = useState(1);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const { logout } = useAuthStore();

  // Safely get configuration
  const config = userDashboardConfig[userType] || userDashboardConfig.STUDENT;
  const navItems = config.navItems;
  const activeNavItem =
    navItems.find((item) => item.id === activePage) || navItems[0];

  const renderContent = () => {
    if (activeNavItem.hasTable === false) {
      return activeNavItem.component;
    }

    // Get data for the current view
    const viewData = sampleData[userType]?.[activeNavItem.label] || [];

    return (
      <div className='p-4'>
        <h3 className='text-lg font-medium mb-4'>{activeNavItem.label}</h3>
        <DashboardTable columns={activeNavItem.columns} data={viewData} />
      </div>
    );
  };

  return (
    <>
      {config.showNewProjectButton && (
        <ClientNewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      )}

      <main className='grid grid-cols-[250px_1fr] h-screen bg-gray-50'>
        {/* Navigation */}
        <div className='p-4 border-r border-gray-200 flex flex-col h-full w-full'>
          <div className='flex-1'>
            <h3 className='font-bold mb-6 text-lg'>CPMP DASHBOARD</h3>
            <nav className='space-y-2'>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                    activePage === item.id
                      ? 'bg-white shadow-md font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className='text-brand' size={20} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={logout}
            className='mt-6 flex items-center gap-2 text-red-500 p-3 hover:bg-red-50 rounded-lg w-full'
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className='flex flex-col overflow-hidden'>
          <DashboardTop
            onNewProject={
              config.showNewProjectButton
                ? () => setIsNewProjectModalOpen(true)
                : null
            }
            userType={userType}
          />
          <div className='flex-1 overflow-auto p-6'>{renderContent()}</div>
        </div>
      </main>
    </>
  );
};

export default DashboardComponent;
